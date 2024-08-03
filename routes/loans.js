var express = require('express');
var router = express.Router();
var loansController = require("../controllers/loans.c");
const { verifyToken, verifyRole } = require('../middlewares/auth');

/* POST crear loan */
router.post('/', loansController.create);

/* GET formulario de creación de préstamo */
router.get('/new', verifyToken, verifyRole('admin'), loansController.createForm);

/* GET loan listing. */
router.get('/', loansController.show);

/* GET loan por id */
router.get('/:id', loansController.showByID);

/* GET formulario de edición de préstamo */
router.get('/:id/edit', verifyToken, verifyRole('admin'), loansController.edit);

/* PUT actualizar préstamo */
router.put('/:id', verifyToken, verifyRole('admin'), loansController.update);

/* GET confirmación de eliminación */
router.get('/:id/delete', verifyToken, verifyRole('admin'), (req, res) => {
  const loanId = req.params.id;
  res.render('loans/delete', { loanId });
});

/* DELETE eliminar loan */
router.delete('/:id', verifyToken, verifyRole('admin'), loansController.delete);

/* GET próxima fecha de pago de loan */
router.get('/next-payment-date/:id', verifyToken, verifyRole('admin'), loansController.getNextPaymentDate);

module.exports = router;