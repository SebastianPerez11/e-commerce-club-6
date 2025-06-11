const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../config/upload');

// Crear
router.post('/', auth , isAdmin , async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos
router.get('/', auth ,  async (req, res) => {
  try {
    const productos = await Product.find(); // Buscar todos los productos
    res.json(productos); // Devolver en formato JSON
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', auth , async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
});


// Editar
router.put('/:id', auth , isAdmin ,  async (req, res) => {
  try {
    const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!productoActualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar
router.delete('/:id',auth, isAdmin ,  async (req, res) => {
  try {
    const productoEliminado = await Product.findByIdAndDelete(req.params.id);
    if (!productoEliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Ruta para subir imagen
router.post('/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  res.status(200).json({
    mensaje: 'Imagen subida correctamente',
    archivo: req.file.filename,
    ruta: `/uploads/${req.file.filename}`
  });
});


module.exports = router;