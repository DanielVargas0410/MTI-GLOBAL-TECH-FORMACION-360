const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// Rutas para gestión de categorías
router.get('/', categoriasController.getAllCategorias);
router.post('/', categoriasController.createCategoria);
router.put('/:id_categoria', categoriasController.updateCategoria);
router.delete('/:id_categoria', categoriasController.deleteCategoria);

module.exports = router;
