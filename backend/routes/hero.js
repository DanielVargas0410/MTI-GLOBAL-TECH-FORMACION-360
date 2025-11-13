const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const upload = require('../multerConfig'); // Importar configuración de Multer

// Rutas para gestión de imágenes del hero
router.get('/', heroController.getAllHeroImages);
router.get('/active', heroController.getActiveHeroImage);
router.post('/', upload.single('image'), heroController.createHeroImage);
router.put('/:id', upload.single('image'), heroController.updateHeroImage);
router.put('/:id/activate', heroController.activateHeroImage);
router.delete('/:id', heroController.deleteHeroImage);

module.exports = router;
