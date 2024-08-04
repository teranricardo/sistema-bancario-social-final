const express = require('express');
const router = express.Router();
const cooperativesController = require('../controllers/cooperatives.c');
const { verifyToken, verifyRole } = require('../middlewares/auth');

// Crear cooperativa
router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { status, data } = await cooperativesController.create(req.body);
    res.status(status).redirect(`/cooperatives`);
  } catch (err) {
    res.status(405).render('error', { message: err.message });
  }
});

// Listar cooperativas
router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { status, data } = await cooperativesController.show();
    res.status(status).render('cooperatives/index', { cooperatives: data });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Ruta para mostrar el formulario de creación de cooperativa
router.get('/new', verifyToken, verifyRole(['admin']), (req, res) => {
  res.render('cooperatives/new');
});


// Obtener cooperativa por ID
router.get('/:id', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const { status, data } = await cooperativesController.showByID(req.params.id);
    res.status(status).render('cooperatives/show', { cooperative: data });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Editar cooperativa
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { status, message } = await cooperativesController.edit(req.params.id, req.body);
    res.status(status).render('cooperatives/show', { message });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Eliminar cooperativa
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { status, message } = await cooperativesController.delete(req.params.id);
    res.status(status).render('cooperatives/index', { message });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});


// Ruta para mostrar el formulario para agregar un nuevo miembro
router.get('/:id/add-user', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { status, data } = await cooperativesController.showByID(req.params.id);
    const { users } = await cooperativesController.createForm();
    res.status(status).render('cooperatives/add-user', { cooperative: data, users });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Agregar usuario a cooperativa
router.post('/:id/add-user', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.body;  // Asumiendo que el userId viene en el cuerpo de la solicitud
    const { status, message } = await cooperativesController.addUser(req.params.id, userId);
    res.status(status).redirect(`/cooperatives/${req.params.id}`);  // Redirige a la vista de la cooperativa
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});


// Ruta para mostrar la vista de confirmación de eliminación de miembro
router.get('/:cooperativeId/members/:memberId/delete', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { cooperativeId, memberId } = req.params;
    res.render('cooperatives/deleteMember', { cooperativeId, memberId });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Eliminar miembro de la cooperativa
router.delete('/:cooperativeId/members/:memberId',  verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { cooperativeId, memberId } = req.params;
    // Llama a la función de controlador que maneja la eliminación del miembro
    await cooperativesController.removeMember(cooperativeId, memberId);
    res.status(200).send('Miembro eliminado con éxito');
  } catch (err) {
    res.status(500).send(`Error al eliminar el miembro: ${err}`);
  }
});


// Ruta para manejar la edición de una cooperativa
router.get('/:id/edit',  verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { status, data } = await cooperativesController.showByID(req.params.id);
    res.status(status).render('cooperatives/edit', { cooperative: data });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Ruta para manejar la eliminación de una cooperativa
router.get('/:id/delete',  verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { status, message } = await cooperativesController.delete(req.params.id);
    res.status(status).redirect('/cooperatives');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Ruta para el pago de cuotas
router.post('/:id/pay-fees',  verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { status, message } = await cooperativesController.payFees(req.params.id);
    res.status(status).redirect('/cooperatives');
  } catch (error) {
    res.status(500).render('error', { message: error.message });

  }
});

module.exports = router;