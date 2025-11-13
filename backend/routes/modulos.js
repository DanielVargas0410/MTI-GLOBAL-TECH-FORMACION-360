const express = require('express');
const router = express.Router();
const modulosController = require('../controllers/modulosController');

// Rutas para gestión de módulos
router.get('/', modulosController.getAllModulos); // Obtener todos los módulos
router.get('/curso/:id_curso', modulosController.getModulosByCurso); // Obtener módulos de un curso específico
router.post('/', modulosController.createModulo); // Crear nuevo módulo
router.put('/:id_modulo', modulosController.updateModulo); // Actualizar módulo
router.delete('/:id_modulo', modulosController.deleteModulo); // Eliminar módulo

module.exports = router;
