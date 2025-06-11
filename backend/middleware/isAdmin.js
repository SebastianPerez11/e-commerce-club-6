module.exports = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next(); // Si es admin, continúa
  } else {
    res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
  }
};