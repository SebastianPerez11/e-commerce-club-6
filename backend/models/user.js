const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Esquema del usuario
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ['cliente', 'admin'],
    default: 'cliente',
  },
}, {
  timestamps: true,
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar contraseñas al hacer login
userSchema.methods.compararContraseña = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.contraseña);
};

// 👇 Esto previene errores si el modelo ya fue registrado antes
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;