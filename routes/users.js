var express = require('express');
var router = express.Router();
var usersController = require("../controllers/users.c");
const { verifyToken, verifyRole } = require('../middlewares/auth');

/* GET listar usuarios */
router.get('/', (req, res) => usersController.show(req, res));

/* GET confirmación de eliminación */
router.get('/new', verifyToken, verifyRole('admin'), (req, res) => {
  res.render('users/new');
});

/* GET registrar usuarios */
router.post('/register', usersController.register);

/* GET listar usuarios */
router.get('/', usersController.show);

/* GET mostrar usuario por id */
router.get('/:id', usersController.showByID);

/* GET mostrar usuario por id */
router.get('/:id/edit', verifyToken, verifyRole('admin'), usersController.edit);

/* PUT editar usuario */
router.put('/:id', verifyToken, verifyRole('admin'), usersController.update);

/* GET confirmación de eliminación */
router.get('/:id/delete', verifyToken, verifyRole('admin'), (req, res) => {
  const userId = req.params.id;
  res.render('users/delete', { userId });
});

/* DELETE eliminar usuario */
router.delete('/:id', verifyToken, verifyRole('admin'), (req, res) => usersController.delete(req, res));

/* GET cuentas del usuario */
router.get('/:id/accounts', verifyToken, verifyRole('admin'), (req, res) => usersController.getAccounts(req, res));

/* GET resumen de cuentas del usuario */
router.get('/:id/accounts/summary', verifyToken, verifyRole('admin'), (req, res) => usersController.summaryAccounts(req, res));

module.exports = router;