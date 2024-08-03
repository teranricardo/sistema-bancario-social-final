const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.c');

// Mostrar el formulario de registro
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Registrar un nuevo usuario
router.post('/register', (req, res) => authController.register(req, res));

// Mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Iniciar sesión
router.post('/login', (req, res) => authController.login(req, res));

// Cerrar sesión
router.get('/logout', (req, res) => authController.logout(req, res));

module.exports = router;