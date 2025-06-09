const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const nuevoUsuario = new User({ nombre, email, contraseña });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, usuario: { nombre: usuario.nombre, email: usuario.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
