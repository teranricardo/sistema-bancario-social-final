const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

// Página de inicio
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sistema Bancario Social' });
});

// Menú principal (requiere autenticación)
router.get('/menu', verifyToken, function(req, res, next) {
  res.render('menu', { title: 'Menú Principal' });
});

module.exports = router;