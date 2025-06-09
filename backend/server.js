const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const usersRouter = require('./api/users');

// Crear servidor
const app = express();
const PORT = process.env.PORT || 6969;

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/products', require('./api/products'));
app.use('/api/users', usersRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🚀 API funcionando correctamente');
});

// Escuchar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
