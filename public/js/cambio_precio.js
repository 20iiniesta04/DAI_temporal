// public/js/cambio_precio.js

const cambiar_precio = async (evt) => {
    const boton = evt.target;
    const idProducto = boton.dataset.id; // Leemos el ID del atributo data-id

    // Buscamos el input asociado a este botón
    const inputPrecio = document.getElementById(`input-precio-${idProducto}`);
    const nuevoPrecio = inputPrecio.value;

    if (!nuevoPrecio) {
        alert("Introduce un precio");
        return;
    }

    // Feedback visual: deshabilitar botón
    boton.disabled = true;
    boton.textContent = "...";

    try {
        const response = await fetch(`/api/productos/${idProducto}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ 
                price: parseFloat(nuevoPrecio) 
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Precio actualizado:", data);
            
            // Feedback Visual en el botón
            boton.textContent = "✅";
            boton.style.backgroundColor = "#28a745";
            
            // ACTUALIZAR EL PRECIO VISIBLE EN LA TARJETA
            // Formatear el número para que se vea español (coma y dos decimales)
            const precioNumerico = parseFloat(nuevoPrecio);
            const precioFormateado = precioNumerico.toFixed(2).replace('.', ',') + ' €';

            // Intentamos encontrar el elemento del precio en la tarjeta
            const tarjeta = boton.closest('.producto-card');
            const elementoPrecio = tarjeta.querySelector('.precio-rebajado') || tarjeta.querySelector('.precio');
            
            if (elementoPrecio) {
                elementoPrecio.textContent = precioFormateado; // Ahora se verá "8,50 €"
            }

            // Restaurar botón...
            setTimeout(() => {
                 // ...
            }, 2000);
        } else {
            throw new Error("Error en la API");
        }

    } catch (err) {
        console.error(err);
        boton.textContent = "❌";
        boton.style.backgroundColor = "red";
        setTimeout(() => { boton.disabled = false; boton.textContent = "Cambiar"; }, 2000);
    }
};

// Asignar el evento a todos los botones cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll('.boton-cambiar-precio');
    for (const boton of botones) {
        boton.addEventListener('click', cambiar_precio);
    }
});