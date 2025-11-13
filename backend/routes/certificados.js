const express = require('express');
const router = express.Router();
const certificadosController = require('../controllers/certificadosController');

// Rutas para certificados
router.get('/', certificadosController.getAllCertificados);
router.get('/:id', certificadosController.getCertificadoById);
router.post('/', certificadosController.createCertificado);
router.put('/:id', certificadosController.updateCertificado);
router.delete('/:id', certificadosController.deleteCertificado);

// Rutas adicionales para obtener certificados por usuario, curso y código
router.get('/usuario/:id_usuario', certificadosController.getCertificadosByUsuario);
router.get('/curso/:id_curso', certificadosController.getCertificadosByCurso);
router.get('/codigo/:codigo', certificadosController.getCertificadoByCodigo);

module.exports = router;
