const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Obtenemos el token del header Authorization: Bearer <token>
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, token faltante' });
  }

  try {
    // Verificamos que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del usuario decodificados en req.user para usarlo después
    req.user = decoded;

    // Continuamos con la siguiente función del middleware o ruta
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = auth;
