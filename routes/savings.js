var express = require('express');
var router = express.Router();
var savingsController = require("../controllers/savings.c");
const { verifyToken, verifyRole } = require('../middlewares/auth');

/* GET lista de cuentas de ahorro */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { savings } = await savingsController.show();
    res.render('savings/index', { savings });
  } catch (err) {
    res.status(500).send(`Error al listar cuentas de ahorro: ${err}`);
  }
});

/* GET formulario de creación de cuenta de ahorro */
router.get('/new', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { users } = await savingsController.createForm();
    res.render('savings/new', { users });
  } catch (err) {
    res.status(500).send(`Error al obtener usuarios: ${err}`);
  }
});

/* POST crear nueva cuenta de ahorro */
router.post('/', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    await savingsController.create(req.body);
    res.redirect('/savings');
  } catch (err) {
    res.status(500).send(`Error al crear la cuenta de ahorro: ${err}`);
  }
});

/* GET detalle de cuenta de ahorro por ID */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { saving } = await savingsController.showByID(req.params.id);
    res.render('savings/show', { saving });
  } catch (err) {
    res.status(500).send(`Error al buscar la cuenta de ahorro: ${err}`);
  }
});

/* GET formulario de edición de cuenta de ahorro */
router.get('/:id/edit', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { saving, users } = await savingsController.edit(req.params.id);
    res.render('savings/edit', { saving, users });
  } catch (err) {
    res.status(500).send(`Error al cargar la cuenta de ahorro para editar: ${err}`);
  }
});

/* PUT actualizar cuenta de ahorro */
router.put('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    await savingsController.update(req.params.id, req.body);
    res.redirect(`/savings/${req.params.id}`);
  } catch (err) {
    res.status(500).send(`Error al editar la cuenta de ahorro: ${err}`);
  }
});

/* GET confirmación de eliminación */
router.get('/:id/delete', verifyToken, verifyRole('admin'), (req, res) => {
  res.render('savings/delete', { savingId: req.params.id });
});

/* DELETE eliminar cuenta de ahorro */
router.delete('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    await savingsController.delete(req.params.id);
    res.redirect('/savings');
  } catch (err) {
    res.status(500).send(`Error al eliminar la cuenta de ahorro: ${err}`);
  }
});

module.exports = router;