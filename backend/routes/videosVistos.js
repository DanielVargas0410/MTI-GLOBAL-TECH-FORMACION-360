// backend/routes/videosVistos.js
const express = require('express');
const router = express.Router();
const videosVistosController = require('../controllers/videosVistosController');

// Obtener todos los registros de videos vistos
router.get('/', videosVistosController.getAllVideosVistos);

// Marcar un video como visto
router.post('/', videosVistosController.markAsSeen);

// Desmarcar un video como visto
router.delete('/', videosVistosController.unmarkAsSeen);

// Obtener los IDs de los videos vistos por un usuario
router.get('/usuario/:id_usuario', videosVistosController.getSeenVideoIdsByUser);

// Obtener estadísticas de videos vistos
router.get('/stats', videosVistosController.getVideosVistosStats);

// Obtener usuarios con sus cursos inscritos
router.get('/usuarios-cursos', videosVistosController.getUsuariosConCursos);

module.exports = router;
