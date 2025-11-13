const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../multerConfig');

// Rutas para gestión de usuarios
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id_usuario', userController.getUserById);
router.get('/:id_usuario/courses', userController.getUserCourses);
router.put('/:id_usuario', userController.updateUser);
router.delete('/:id_usuario', userController.deleteUser);

// Ruta para que un estudiante actualice su propio perfil
router.put('/profile/:id_usuario', upload.single('foto_perfil'), userController.updateStudentProfile);

module.exports = router;
