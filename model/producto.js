// ./model/producto.js
import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  precio_rebajado: {
    type: String,
    default: ""   // Si no hay rebaja → 0
  }
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;

