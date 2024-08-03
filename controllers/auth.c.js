const usersModel = require('../models/users.m');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  async register(req, res) {
    const { name, username, password, role } = req.body;
    if (!name || !username || !password || !role) {
      return res.status(400).render('error', { message: "Todos los campos son requeridos." });
    }

    try {
      const user = await usersModel.findByUsername(username);
      if (user) {
        return res.status(400).render('error', { message: "El nombre de usuario ya está en uso." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { name, username, password: hashedPassword, role };
      await usersModel.create(newUser);

      res.status(201).redirect('/auth/login');
    } catch (error) {
      res.status(500).render('error', { message: `Error al registrar usuario: ${error.message}` });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).render('error', { message: "El nombre de usuario y la contraseña son requeridos." });
    }

    try {
      const user = await usersModel.findByUsername(username);
      if (!user) {
        return res.status(401).render('error', { message: "Nombre de usuario o contraseña incorrectos." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).render('error', { message: "Nombre de usuario o contraseña incorrectos." });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/menu')
    } catch (error) {
      res.status(500).render('error', { message: `Error al iniciar sesión: ${error.message}` });
    }
  }

  logout(req, res) {
    res.clearCookie('token');
    res.redirect('/auth/login');
  }
}

module.exports = new AuthController();