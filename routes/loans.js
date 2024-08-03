var express = require('express');
var router = express.Router();
var loansController = require("../controllers/loans.c");
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

/* GET formulario de creación de préstamo */
router.get('/new', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { users } = await loansController.createForm();
    res.render('loans/new', { users });
  } catch (err) {
    res.status(500).send(`Error al obtener usuarios: ${err}`);
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

module.exports = router;
