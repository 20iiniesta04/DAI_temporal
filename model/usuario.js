// ./model/usuario.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Definición del esquema de usuario
const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Aseguramos que el nombre de usuario sea único
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware (pre-save) para hashear la contraseña antes de guardarla
usuarioSchema.pre('save', async function(next) {
  // Solo hashea si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar contraseñas (uso en el login)
usuarioSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
