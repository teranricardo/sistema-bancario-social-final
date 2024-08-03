var express = require('express');
var router = express.Router();
var loansController = require("../controllers/loans.c");
const userController = require('../controllers/users.c');
const { verifyToken, verifyRole } = require('../middlewares/auth');

/* POST crear préstamo */
router.post('/', async (req, res) => {
  try {
    await loansController.create(req.body);
    res.redirect('/loans');
  } catch (err) {
    res.status(500).send(`Error al crear el préstamo: ${err}`);
  }
});

/* POST crear préstamo */
router.post('/user', async (req, res) => {
  try {
    await loansController.create(req.body);
    res.redirect('/profile');
  } catch (err) {
    res.status(500).send(`Error al crear el préstamo: ${err}`);
  }
});

/* GET formulario de creación de préstamo */
router.get('/new', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { users } = await loansController.createForm();
    res.render('loans/new', { users });
  } catch (err) {
    res.status(500).send(`Error al obtener usuarios: ${err}`);
  }
});

// Formulario para crear un préstamo de un usuario
router.get('/new-loan', verifyToken, async function (req, res, next) {
  try {
    const user = await userController.showByID(req.user.id); // Obtener los datos del usuario logueado
    res.render('loans/newUser', { user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/* GET listado de préstamos */
router.get('/', async (req, res) => {
  try {
    const { loans } = await loansController.show();
    res.render('loans/index', { loans });
  } catch (err) {
    res.status(500).send(`Error al listar los préstamos: ${err}`);
  }
});

/* GET detalle de préstamo por ID */
router.get('/:id', async (req, res) => {
  try {
    const { loan } = await loansController.showByID(req.params.id);
    res.render('loans/show', { loan });
  } catch (err) {
    res.status(500).send(`Error al buscar el préstamo: ${err}`);
  }
});

/* GET formulario de edición de préstamo */
router.get('/:id/edit', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { loan, users } = await loansController.edit(req.params.id);
    res.render('loans/edit', { loan, users });
  } catch (err) {
    res.status(500).send(`Error al cargar el préstamo para editar: ${err}`);
  }
});

/* PUT actualizar préstamo */
router.put('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    await loansController.update(req.params.id, req.body);
    res.redirect(`/loans/${req.params.id}`);
  } catch (err) {
    res.status(500).send(`Error al editar el préstamo: ${err}`);
  }
});

/* GET confirmación de eliminación */
router.get('/:id/delete', verifyToken, verifyRole('admin'), (req, res) => {
  res.render('loans/delete', { loanId: req.params.id });
});

/* GET confirmación de eliminación */
router.get('/:id/delete/user', verifyToken, verifyRole('admin'), (req, res) => {
  res.render('loans/deleteUser', { loanId: req.params.id });
});

/* DELETE eliminar préstamo */
router.delete('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    await loansController.delete(req.params.id);
    res.redirect('/loans');
  } catch (err) {
    res.status(500).send(`Error al eliminar el préstamo: ${err}`);
  }
});

/* GET próxima fecha de pago de préstamo */
router.get('/next-payment-date/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { id, date } = await loansController.getNextPaymentDate(req.params.id);
    res.render('next-payment-date', { id, date });
  } catch (err) {
    res.status(500).send(`Error al buscar el préstamo: ${err}`);
  }
});

/* GET formulario de nuevo movimiento de préstamo */
router.get('/newMovement/:loanId', verifyToken, async (req, res) => {
  try {
    const loanId = req.params.loanId;
    res.render('loans/newMovement', { loanId });
  } catch (err) {
    res.status(500).send(`Error al cargar el formulario de movimiento: ${err}`);
  }
});

/* POST crear movimiento de préstamo */
router.post('/:id/movements', verifyToken, async (req, res) => {
  try {
    await loansController.createMovement({ ...req.body, loanId: req.params.id });
    res.redirect(`/profile`);
  } catch (err) {
    res.status(500).send(`Error al crear el movimiento: ${err}`);
  }
});

/* GET listar movimientos de préstamo */
router.get('/:id/movements', verifyToken, async (req, res) => {
  try {
    const { movements } = await loansController.showMovements(req.params.id);
    res.render('loans/movements', { movements });
  } catch (err) {
    res.status(500).send(`Error al listar los movimientos: ${err}`);
  }
});

module.exports = router;
