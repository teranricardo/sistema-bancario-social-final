var express = require('express');
var router = express.Router();
var usersController = require("../controllers/users.c");
const { verifyToken, verifyRole } = require('../middlewares/auth');

/* GET listar usuarios */
router.get('/', async (req, res) => {
  try {
    const users = await usersController.show();
    res.render('users/index', { users });
  } catch (err) {
    res.status(500).send(`Error al listar usuarios: ${err}`);
  }
});

/* GET confirmación de eliminación */
router.get('/new', verifyToken, verifyRole('admin'), (req, res) => {
  res.render('users/new');
});

/* POST registrar usuarios */
router.post('/register', async (req, res) => {
  try {
    const result = await usersController.register(req.body);
    if (result.error) {
      return res.status(400).render('error', { message: result.error });
    }
    res.status(201).redirect('/users');
  } catch (error) {
    res.status(500).render('error', { message: `Error al registrar usuario: ${error.message}` });
  }
});

/* GET mostrar usuario por id */
router.get('/:id', async (req, res) => {
  try {
    const user = await usersController.showByID(req.params.id);
    if (!user) {
      return res.status(404).send(`No se encontró el usuario con id: ${req.params.id}`);
    }
    res.render('users/show', { user });
  } catch (err) {
    res.status(500).send(`Error al buscar usuario: ${err}`);
  }
});

/* GET editar usuario */
router.get('/:id/edit', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const user = await usersController.showByID(req.params.id);
    if (!user) {
      return res.status(404).send(`No se encontró el usuario con id: ${req.params.id}`);
    }
    res.render('users/edit', { user });
  } catch (err) {
    res.status(500).send(`Error al buscar usuario: ${err}`);
  }
});

/* PUT editar usuario */
router.put('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const result = await usersController.update(req.params.id, req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    res.redirect(`/users/${req.params.id}`);
  } catch (err) {
    res.status(500).send(`Error al editar el usuario: ${err}`);
  }
});

/* GET confirmación de eliminación */
router.get('/:id/delete', verifyToken, verifyRole('admin'), (req, res) => {
  const userId = req.params.id;
  res.render('users/delete', { userId });
});

/* DELETE eliminar usuario */
router.delete('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const result = await usersController.delete(req.params.id);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    res.redirect('/users');
  } catch (err) {
    res.status(500).send(`Error al eliminar usuario: ${err}`);
  }
});

/* GET cuentas del usuario */
router.get('/:id/accounts', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { user, accounts } = await usersController.getAccounts(req.params.id);
    res.render('users/accounts', { accounts, user });
  } catch (err) {
    res.status(500).send(`Error al obtener cuentas del usuario: ${err}`);
  }
});

/* GET resumen de cuentas del usuario */
router.get('/:id/accounts/summary', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { user, summary } = await usersController.summaryAccounts(req.params.id);
    res.render('users/summary', { summary, user });
  } catch (err) {
    res.status(500).send(`Error al obtener resumen de cuentas del usuario: ${err}`);
  }
});

module.exports = router;