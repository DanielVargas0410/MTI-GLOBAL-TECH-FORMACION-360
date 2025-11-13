const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');
const upload = require('../multerConfig'); // Importar configuración de Multer

// Rutas para gestión de cursos
router.get('/', cursosController.getAllCursos);
// Usar multer para el campo 'imagen'
router.post('/', upload.single('imagen'), cursosController.createCurso);
router.get('/:id_curso/detail', cursosController.getCourseDetail);
router.post('/activar', cursosController.activateCourseByCode);
// Usar multer para el campo 'imagen'
router.put('/:id_curso', upload.single('imagen'), cursosController.updateCurso);
router.delete('/:id_curso', cursosController.deleteCurso);

module.exports = router;
