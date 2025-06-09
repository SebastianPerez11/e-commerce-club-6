const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Crear
router.post('/',auth, async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Editar
router.put('/:id', async (req, res) => {
  try {
    const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!productoActualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    const productoEliminado = await Product.findByIdAndDelete(req.params.id);
    if (!productoEliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;