// Rutas para gestionar actividades de auditoría
const express = require('express');
const router = express.Router();
const actividadesController = require('../controllers/actividadesController');

// Obtener todas las actividades
router.get('/', actividadesController.getAllActividades);

// Obtener actividad por ID
router.get('/:id', actividadesController.getActividadById);

// Obtener actividades por usuario
router.get('/usuario/:id_usuario', actividadesController.getActividadesByUsuario);

// Obtener actividades por tipo
router.get('/tipo/:tipo', actividadesController.getActividadesByTipo);

// Crear nueva actividad
router.post('/', actividadesController.createActividad);

// Actualizar actividad
router.put('/:id', actividadesController.updateActividad);

// Eliminar actividad
router.delete('/:id', actividadesController.deleteActividad);

// Obtener estadísticas de actividades
router.get('/estadisticas/resumen', actividadesController.getEstadisticasActividades);

// Obtener estadísticas mensuales de usuarios y cursos
router.get('/estadisticas/mensuales', actividadesController.getEstadisticasMensuales);

module.exports = router;
