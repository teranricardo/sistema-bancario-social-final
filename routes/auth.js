const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.c');

// Mostrar el formulario de registro
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { redirect } = await authController.register(req.body);
    res.redirect(redirect);
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
});

// Mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { token, redirect } = await authController.login(req.body);
    res.cookie('token', token, { httpOnly: true });
    res.redirect(redirect);
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
});

// Cerrar sesión
router.get('/logout', async (req, res) => {
  try {
    const { redirect } = await authController.logout();
    res.clearCookie('token');
    res.redirect(redirect);
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;