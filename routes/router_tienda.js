import express from "express";
import Producto from "../model/producto.js";

const router = express.Router();

router.get('/', async (req, res) => {
  const query = req.query.q || null;

  try {
    if (query) {
      // Solo mostrar resultados de búsqueda
      const productos = await Producto.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { categoría: { $regex: query, $options: 'i' } },
          { size: { $regex: query, $options: 'i' } }
        ]
      });
      res.render('portada.html', { productos, query, destacados: null });
    } else {
      // Mostrar 3 productos destacados al azar
      const destacados = await Producto.aggregate([{ $sample: { size: 3 } }]);
      res.render('portada.html', { destacados, productos: null, query: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

router.get('/productos', async (req, res) => {
    try {
        // 1. Consultar todos los productos sin filtros
        const todos_productos = await Producto.find({}).lean(); // Usamos .lean() para objetos JS simples

        // 2. Renderizar la plantilla 'portada.html' o una nueva, pasando la lista
        // Usaremos la misma estructura que la búsqueda para reutilizar el HTML
        res.render('portada.html', { 
            productos: todos_productos, 
            query: 'Todos los productos', 
            destacados: null 
        });
        
    } catch (err) {
        console.error("Error al cargar todos los productos:", err);
        res.status(500).send({ error: "Error al cargar el catálogo completo." });
    }
});

router.get('/busqueda', (req, res) => {
    res.render('busqueda.html');
});

export default router;

