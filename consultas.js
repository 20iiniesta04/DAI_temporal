// consultas.js
import mongoose from "mongoose";
import connectDB from "./model/connectDB.js";
import Producto from "./model/producto.js";

await connectDB();

// Productos de menos de 1 €
const productosMenos1 = await Producto.find({ price: { $lt: "1 €" } });
console.log("Productos de menos de 1 €:");
console.log(productosMenos1);

// Productos de menos de 1 € que no sean agua
const productosMenos1NoAgua = await Producto.find({
  price: { $lt: "1 €" },
  name: { $not: /agua/i }
});
console.log("\nProductos de menos de 1 € que no sean agua:");
console.log(productosMenos1NoAgua);

// Aceites ordenados por precio
// Primero necesitamos transformar price a número. Supongamos que lo guardamos como string con €, lo convertimos:
const aceites = await Producto.find({ name: /aceite/i });
const aceitesOrdenados = aceites.sort((a, b) => {
  const precioA = parseFloat(a.price.replace("€", "").replace(",", "."));
  const precioB = parseFloat(b.price.replace("€", "").replace(",", "."));
  return precioA - precioB;
});
console.log("\nAceites ordenados por precio:");
console.log(aceitesOrdenados);

// Productos en garrafa
const garrafas = await Producto.find({ size: /Garrafa/i });
console.log("\nProductos en garrafa:");
console.log(garrafas);

mongoose.connection.close();

