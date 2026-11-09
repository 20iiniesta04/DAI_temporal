import mongoose from 'mongoose';
import fs from 'fs';
import connectDB from './model/db.js';
import Producto from './model/producto.js';


// Función para leer el archivo
function Lee_archivo(ruta) {
  try {
    const datos = fs.readFileSync(ruta, 'utf-8');  // Leer el archivo JSON
    return datos;
  } catch (error) {
    console.error('Error al leer el archivo:', error.message);
  }
}

await connectDB();

const datos_productos = Lee_archivo('datos_mercadona.json');  // Usamos la función para leer el archivo
const lista_productos = JSON.parse(datos_productos);  // Parseamos el JSON

await Guardar_en_modelo(Producto, lista_productos);

mongoose.connection.close();

// Guardar los datos en la base de datos
async function Guardar_en_modelo(modelo, lista) {
  try {
    const insertados = await modelo.insertMany(lista);  // Insertamos los productos
    console.log(`Insertados ${insertados.length} documentos`);
  } catch (error) {
    console.error(`Error guardando lista ${error.message}`);
  }
}

