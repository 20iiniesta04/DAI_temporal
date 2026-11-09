// ./routes/router_admin.js
import express from "express";
import Producto from "../model/producto.js";
import { esAdmin } from "../middlewares/auth.js"; // Importamos el middleware

const router = express.Router();

// Ruta para mostrar el formulario de cambio de precio
// PROTEGIDA por el middleware esAdmin
router.get('/cambiar_precio', esAdmin, async (req, res) => {
    const { product_id } = req.query;

    try {
        const producto = await Producto.findById(product_id).lean();

        if (!producto) {
            return res.status(404).send("Producto no encontrado.");
        }
        
        // Renderiza un formulario simple para cambiar el precio
        res.render('admin_precio.html', { producto, success: null, error: null });

    } catch (error) {
        console.error("Error al cargar producto para admin:", error);
        res.status(500).send("Error interno.");
    }
});

// Ruta para procesar el cambio de precio
// PROTEGIDA por el middleware esAdmin
router.post('/cambiar_precio', esAdmin, async (req, res) => {
    const { product_id, new_price, new_rebajado } = req.body;

    // Convertir a números
    const price = parseFloat(new_price);
    const precio_rebajado = parseFloat(new_rebajado) || null;

    // Validación básica
    if (isNaN(price) || price <= 0) {
        return res.render('admin_precio.html', { error: "El precio debe ser un número positivo.", producto: { _id: product_id } });
    }

    try {
        await Producto.findByIdAndUpdate(product_id, { 
            price: price, 
            precio_rebajado: precio_rebajado 
        });

        // Redirigir y mostrar mensaje de éxito (o redirigir a la portada)
        res.redirect(`/`);

    } catch (error) {
        console.error("Error al actualizar precio:", error);
        res.render('admin_precio.html', { 
            error: "Error al guardar en la base de datos.", 
            producto: { _id: product_id, name: "Producto" } 
        });
    }
});

export default router;
