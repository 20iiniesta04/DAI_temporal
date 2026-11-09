import express from "express";
import Producto from "../model/producto.js"; // Tu modelo de Mongoose

const router = express.Router();

// Función de utilidad para limpiar y convertir el precio a número
const limpiarPrecio = (priceString) => {
    if (!priceString) return 0;
    
    // 1. Reemplazar la coma decimal por punto (ej: "0,75 €" -> "0.75 €")
    let cleanedPrice = priceString.replace(',', '.');
    
    // 2. Eliminar el símbolo de euro y cualquier caracter no numérico (excepto el punto)
    cleanedPrice = cleanedPrice.replace(/[^0-9.]/g, '').trim();

    // 3. Convertir a float. Si la cadena es "0.75", parseFloat(cleanedPrice) será 0.75 (número)
    // Usamos el operador ternario para asegurar que el valor sea un float o 0
    const finalPrice = parseFloat(cleanedPrice);

    return isNaN(finalPrice) ? 0 : finalPrice;
};

// RUTA: GET /carrito (Visualizar el carrito y calcular totales)
router.get('/', (req, res) => {
    const cart_items = req.session.carrito || {};
    
    let subtotal = 0;
    const carrito_list = [];

    // Procesar los ítems del carrito para calcular totales
    for (const productId in cart_items) {
        const item = cart_items[productId];
        
        
        // Si no existe (por si ya había ítems en la sesión antes de este cambio), limpiamos el string original
        const price = item.numericPrice || limpiarPrecio(item.price); 
        
        const itemTotal = price * item.cantidad;
        subtotal += itemTotal;
        
        // Formatear el ítem para pasarlo a la plantilla
        carrito_list.push({
            ...item,
            //  Formatear el total de línea a formato español para mostrar en la plantilla
            line_total: itemTotal.toFixed(2).replace('.', ',') + ' €' 
        });
    }

    // Renderizar la plantilla 'carrito.html'
    return res.render('carrito.html', {
        carrito: carrito_list,
        // Formatear los totales generales a formato español para mostrar
        subtotal: subtotal.toFixed(2).replace('.', ',') + ' €',
        total: subtotal.toFixed(2).replace('.', ',') + ' €'     
    });
});


// RUTA: POST /carrito/agregar (Añadir un producto)

router.post('/agregar', async (req, res) => {
    const productId = req.body.product_id;
    
    try {
        const product = await Producto.findOne({ _id: productId }).lean(); 
        
        if (!product) {
            return res.redirect(req.get('referer') || '/'); 
        }

        if (!req.session.carrito) {
            req.session.carrito = {}; 
        }
        
        const currentCart = req.session.carrito;
        
        // LÓGICA CLAVE: Determinar qué precio usar
        let priceToUse = product.price;

        // Comprobamos si existe precio rebajado y no es "0" o null.
        if (product.precio_rebajado && product.precio_rebajado !== "0" && product.precio_rebajado !== "0 €") {
            priceToUse = product.precio_rebajado;
        }

        // Limpiar el precio seleccionado (rebajado o normal) y guardarlo como número
        const numericPrice = limpiarPrecio(priceToUse); 

        if (currentCart[productId]) {
            currentCart[productId].cantidad += 1;
        } else {
            currentCart[productId] = {
                id: product._id.toString(), 
                name: product.name,
                // Guardamos el string original (puede ser el rebajado) para mostrar en la vista
                price: priceToUse,       
                numericPrice: numericPrice, // 👈 USAMOS ESTE PARA TODOS LOS CÁLCULOS
                cantidad: 1,
                imageUrl: product.imageUrl,
            };
        }

        return res.redirect(req.get('referer') || '/carrito');
    } catch (error) {
        console.error("Error al añadir al carrito:", error);
        return res.status(500).send("Error interno del servidor.");
    }
});


// RUTA: POST /carrito/actualizar (Cambiar la cantidad)
router.post('/actualizar', (req, res) => {
    const productId = req.body.product_id;
    const newQuantity = parseInt(req.body.quantity, 10);
    
    if (req.session.carrito && req.session.carrito[productId]) {
        
        if (newQuantity > 0) {
            // Actualizar la cantidad
            req.session.carrito[productId].cantidad = newQuantity;
        } else {
            // Si la cantidad es 0 o menos, eliminar el producto
            delete req.session.carrito[productId];
        }
    }
    
    return res.redirect(req.get('referer') || '/carrito'); 
});


// RUTA: POST /carrito/eliminar (Eliminar un producto)
router.post('/eliminar', (req, res) => {
    const productIdToDelete = req.body.product_id;
    
    if (req.session.carrito && req.session.carrito[productIdToDelete]) {
        delete req.session.carrito[productIdToDelete];
    }
    
    return res.redirect(req.get('referer') || '/carrito');
});


export default router;
