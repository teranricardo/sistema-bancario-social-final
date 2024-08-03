var express = require('express');
var router = express.Router();
var savingsController = require("../controllers/savings.c");
const userController = require('../controllers/users.c');
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

// Formulario para crear una cuenta de ahorro de un usuario
router.get('/new-saving', verifyToken, async function (req, res, next) {
  try {
    const user = await userController.showByID(req.user.id); // Obtener los datos del usuario logueado
    res.render('savings/newUser', { user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
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

/* POST crear nueva cuenta de ahorro */
router.post('/user', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    await savingsController.create(req.body);
    res.redirect('/profile');
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

/* GET confirmación de eliminación */
router.get('/:id/delete/user', verifyToken, verifyRole('admin'), (req, res) => {
  res.render('savings/deleteUser', { savingId: req.params.id });
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

router.get('/newMovement/:savingId', verifyToken, async (req, res) => {
  try {
    const savingId = req.params.savingId;

    res.render('savings/newMovement', { savingId });
  } catch (err) {
    res.status(500).send(`Error al cargar el formulario de movimiento: ${err}`);
  }
});

/* POST crear movimiento de cuenta de ahorro */
router.post('/:id/movements', verifyToken, async (req, res) => {
  try {
    await savingsController.createMovement({ ...req.body, savingsId: req.params.id });
    res.redirect(`/profile`);
  } catch (err) {
    res.status(500).send(`Error al crear el movimiento: ${err}`);
  }
});

/* GET listar movimientos de cuenta de ahorro */
router.get('/:id/movements', verifyToken, async (req, res) => {
  try {
    const { movements } = await savingsController.showMovements(req.params.id);
    res.render('savings/movements', { movements });
  } catch (err) {
    res.status(500).send(`Error al listar los movimientos: ${err}`);
  }
});

module.exports = router;