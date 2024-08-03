// var express = require('express');
// var router = express.Router();
// var cooperativesController = require("../controllers/cooperatives.c");

// /* POST crear cooperative */
// router.post('/', (req, res) => cooperativesController.create(req, res));

// /* GET cooperative listing. */
// router.get('/', (req, res) => cooperativesController.show(req, res));

// /* GET cooperative por id */
// router.get('/:id', (req, res) => cooperativesController.showByID(req, res));

// /* PUT editar cooperative */
// router.put('/:id', (req, res) => cooperativesController.edit(req, res));

// /* DELETE eliminar cooperative */
// router.delete('/:id', (req, res) => cooperativesController.delete(req, res));

// /* PUT agregar usuario a cooperative */
// router.put('/add-user/:id', (req, res) => cooperativesController.addUser(req, res));

// module.exports = router;


const express = require('express');
const router = express.Router();
const cooperativesController = require('../controllers/cooperatives.c');

// Crear cooperativa
router.post('/', async (req, res) => {
  try {
    const { status, data } = await cooperativesController.create(req.body);
    res.status(status).send(data);
  } catch (err) {
    res.status(405).send(err.message);
  }
});

// Listar cooperativas
router.get('/', async (req, res) => {
  try {
    const { status, data } = await cooperativesController.show();
    res.status(status).send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Obtener cooperativa por ID
router.get('/:id', async (req, res) => {
  try {
    const { status, data } = await cooperativesController.showByID(req.params.id);
    res.status(status).send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Editar cooperativa
router.put('/:id', async (req, res) => {
  try {
    const { status, message } = await cooperativesController.edit(req.params.id, req.body);
    res.status(status).send(message);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Eliminar cooperativa
router.delete('/:id', async (req, res) => {
  try {
    const { status, message } = await cooperativesController.delete(req.params.id);
    res.status(status).send(message);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Agregar usuario a cooperativa
router.put('/add-user/:id', async (req, res) => {
  try {
    const { status, message } = await cooperativesController.addUser(req.params.id, req.body.userId);
    res.status(status).send(message);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
