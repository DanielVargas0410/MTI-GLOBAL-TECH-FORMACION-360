const express = require('express');
const router = express.Router();
const cursosEstudianteController = require('../controllers/cursosEstudianteController');

// Rutas para gestión de cursos_estudiante
router.get('/', cursosEstudianteController.getAllCursosEstudiante);
router.get('/estudiante/:id_usuario', cursosEstudianteController.getCursosByStudentId);
router.post('/', cursosEstudianteController.createCursoEstudiante);
router.put('/:id_curso_estudiante', cursosEstudianteController.updateCursoEstudiante);
router.delete('/:id_curso_estudiante', cursosEstudianteController.deleteCursoEstudiante);

// Ruta para que un estudiante active un curso
router.post('/activar', cursosEstudianteController.activarCurso);

module.exports = router;
