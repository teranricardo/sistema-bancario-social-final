var express = require('express');
var router = express.Router();
var savingsController = require("../controllers/savings.c");
const { verifyToken, verifyRole } = require('../middlewares/auth');

/* GET lista de cuentas de ahorro */
router.get('/', verifyToken, savingsController.show);

/* GET formulario de creación de cuenta de ahorro */
router.get('/new', verifyToken, verifyRole('admin'), savingsController.createForm);

/* POST crear nueva cuenta de ahorro */
router.post('/', verifyToken, verifyRole('admin'), savingsController.create);

/* GET detalle de cuenta de ahorro por ID */
router.get('/:id', verifyToken, savingsController.showByID);

/* GET formulario de edición de cuenta de ahorro */
router.get('/:id/edit', verifyToken, verifyRole('admin'), savingsController.edit);

/* PUT actualizar cuenta de ahorro */
router.put('/:id', verifyToken, verifyRole('admin'), savingsController.update);

/* GET confirmación de eliminación */
router.get('/:id/delete', verifyToken, verifyRole('admin'), (req, res) => {
  const savingId = req.params.id;
  res.render('savings/delete', { savingId });
});

/* DELETE eliminar cuenta de ahorro */
router.delete('/:id', verifyToken, verifyRole('admin'), savingsController.delete);

module.exports = router;