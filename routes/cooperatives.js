var express = require('express');
var router = express.Router();
var cooperativesController = require("../controllers/cooperatives.c");

/* POST crear cooperative */
router.post('/', (req, res) => cooperativesController.create(req, res));

/* GET cooperative listing. */
router.get('/', (req, res) => cooperativesController.show(req, res));

/* GET cooperative por id */
router.get('/:id', (req, res) => cooperativesController.showByID(req, res));

/* PUT editar cooperative */
router.put('/:id', (req, res) => cooperativesController.edit(req, res));

/* DELETE eliminar cooperative */
router.delete('/:id', (req, res) => cooperativesController.delete(req, res));

/* PUT agregar usuario a cooperative */
router.put('/add-user/:id', (req, res) => cooperativesController.addUser(req, res));

module.exports = router;