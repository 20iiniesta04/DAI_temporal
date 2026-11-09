// ./routes/router_api.js

import express from "express";
import Producto from "../model/producto.js";
import logger from "../config/logger.js"; // Asegúrate de que esta ruta sea correcta
// Si es necesario, importa 'esAdmin' si deseas proteger los métodos POST, PUT, DELETE

const router = express.Router();

// Middleware de manejo de errores simple (para evitar bloques try/catch repetitivos)
const asyncHandler = fn => (req, res, next) => {
    // Envuelve la función asíncrona en un Promise.resolve y captura errores
    Promise.resolve(fn(req, res, next)).catch(err => {
        logger.error(`Error en API: ${err.message}`, { path: req.path, method: req.method });
        next(err); // Pasa el error al manejador de errores de Express
    });
};


// GET /api/productos - Obtener todos los productos
router.get('/', asyncHandler(async (req, res) => {
    const productos = await Producto.find({});
    res.json(productos); 
}));


// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', asyncHandler(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
        logger.warn(`Intento de acceso a producto no encontrado: ${req.params.id}`);
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto);
}));


// POST /api/productos - Añadir un producto 
router.post('/', asyncHandler(async (req, res) => { 
    const { name, price, size, imageUrl, precio_rebajado } = req.body;
    
    // Crear una nueva instancia del modelo
    const newProduct = new Producto({
        name,
        // Conversión a Number para asegurar que los precios se guarden bien
        price: parseFloat(price), 
        size,
        imageUrl,
        precio_rebajado: precio_rebajado ? parseFloat(precio_rebajado) : null
    });

    // Guardar en la base de datos
    const savedProduct = await newProduct.save();
    
    // Loguear el éxito
    logger.info(`Nuevo producto añadido: ${savedProduct.name} (ID: ${savedProduct._id})`);
    
    // Devolver el recurso creado (Código 201)
    res.status(201).json(savedProduct); 

}));


// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', asyncHandler(async (req, res) => {
    const deletedProduct = await Producto.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    logger.warn(`Producto eliminado: ${deletedProduct.name} (ID: ${deletedProduct._id})`);
    res.status(204).send(); // 204 No Content
}));


// PUT /api/productos/:id - Modificar precio
router.put('/:id', asyncHandler(async (req, res) => {
    const updates = req.body;
    
    // Construir el objeto de actualización con conversión de tipos
    const updateData = {
        price: updates.price ? parseFloat(updates.price) : undefined,
        precio_rebajado: updates.precio_rebajado !== undefined ? parseFloat(updates.precio_rebajado) : undefined
    };
    
    const updatedProduct = await Producto.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true } 
    );

    if (!updatedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    
    logger.info(`Precio actualizado para: ${updatedProduct.name}`);
    res.json(updatedProduct);
}));


// GET /api/busqueda-anticipada/:texto
// Busca productos que contengan el texto (case-insensitive)
router.get('/busqueda-anticipada/:texto', asyncHandler(async (req, res) => {
    const texto = req.params.texto;
    
    // Validar longitud mínima por seguridad (aunque el front lo controle)
    if (texto.length < 3) {
        return res.json([]); 
    }

    // $regex: busca coincidencias parciales
    // $options: 'i' ignora mayúsculas/minúsculas
    const productos = await Producto.find({ 
        name: { $regex: texto, $options: 'i' } 
    });

    res.json(productos);
}));


export default router;
