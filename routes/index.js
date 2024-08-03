const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const userController = require('../controllers/users.c');

// Página de inicio
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Sistema Bancario Social' });
});

// Menú principal (requiere autenticación)
router.get('/menu', verifyToken, function (req, res, next) {
  res.render('menu', { title: 'Menú Principal' });
});

// Perfil del usuario (requiere autenticación)
router.get('/profile', verifyToken, async function (req, res, next) {
  try {
    const user = await userController.showByID(req.user.id); // Obtener los datos del usuario logueado
    res.render('users/profile', { user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Formulario para crear un préstamo (requiere autenticación)
router.get('/profile/create-loan', verifyToken, async function (req, res, next) {
  try {
    const user = await userController.showByID(req.user.id); // Obtener los datos del usuario logueado
    res.render('loans/newUser', { user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Formulario para crear un préstamo (requiere autenticación)
router.get('/profile/create-saving', verifyToken, async function (req, res, next) {
  try {
    const user = await userController.showByID(req.user.id); // Obtener los datos del usuario logueado
    res.render('savings/newUser', { user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;