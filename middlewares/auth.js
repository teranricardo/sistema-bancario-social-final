const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).render('error', { message: "Token no proporcionado." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).render('error', { message: "Token inválido." });
    }
    req.user = decoded;
    next();
  });
}

function verifyRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).render('error', { message: "No tienes permiso para acceder a esta ruta." });
    }
    next();
  };
}

module.exports = { verifyToken, verifyRole };