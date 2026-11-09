// public/js/busqueda.js

const inputBusqueda = document.getElementById('input-busqueda');
const mensajeResultados = document.getElementById('mensaje-resultados');
const contenedorResultados = document.getElementById('contenedor-resultados');
// Obtenemos la referencia al template
const template = document.getElementById('plantilla-producto');

const realizarBusqueda = async (e) => {
    const texto = e.target.value;

    if (texto.length < 3) {
        mensajeResultados.textContent = "Introduce al menos 3 caracteres...";
        mensajeResultados.className = "text-xl text-gray-600 font-medium text-center mb-8"; 
        contenedorResultados.innerHTML = ''; // Limpiar
        return;
    }

    mensajeResultados.textContent = `Buscando "${texto}"...`;

    try {
        const response = await fetch(`/api/productos/busqueda-anticipada/${texto}`);
        
        if (response.ok) {
            const productos = await response.json();
            
            // Limpiamos resultados anteriores
            contenedorResultados.innerHTML = '';

            if (productos.length > 0) {
                mensajeResultados.textContent = `Encontrados ${productos.length} productos:`;
                mensajeResultados.className = "text-xl text-[#00802b] font-bold text-center mb-8";
                
                // Bucle de renderizado
                productos.forEach(p => {
                    muestraProducto(p);
                });

            } else {
                mensajeResultados.textContent = `No hay resultados para "${texto}".`;
                mensajeResultados.className = "text-xl text-red-600 font-bold text-center mb-8";
            }

        } else {
            console.error("Error servidor");
        }

    } catch (error) {
        console.error("Error:", error);
    }
};

// Función separada para pintar cada tarjeta
function muestraProducto(p) {
    // Clonar el contenido del template (true = clonar todo lo de dentro)
    const clon = template.content.cloneNode(true);

    // Rellenar los huecos con los datos del producto 'p'
    // Usamos querySelector SOBRE EL CLON, no sobre el document
    const img = clon.querySelector('.p-img');
    img.src = p.imageUrl || 'https://via.placeholder.com/150'; // Fallback si no hay imagen
    img.alt = p.name;

    clon.querySelector('.p-nombre').textContent = p.name;
    clon.querySelector('.p-tamano').textContent = p.size || '';
    
    // Lógica simple de precio (puedes mejorarla para mostrar rebajas)
    const precioFinal = p.precio_rebajado || p.price;
    clon.querySelector('.p-precio').textContent = parseFloat(precioFinal).toFixed(2).replace('.', ',') + ' €';

    // Añadir el clon al grid principal
    contenedorResultados.append(clon);
}

inputBusqueda.addEventListener('input', realizarBusqueda);