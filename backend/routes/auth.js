// Rutas para autenticación
const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Configuración de multer para subir fotos de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/imagenes_usuarios/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Validaciones para registro
const registerValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('nombre_completo').notEmpty().withMessage('Nombre completo es requerido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  body('telefono').optional().isMobilePhone().withMessage('Teléfono inválido'),
  body('direccion').optional().isLength({ max: 300 }).withMessage('Dirección demasiado larga'),
  body('ciudad').optional().isLength({ max: 100 }).withMessage('Ciudad demasiado larga'),
  body('pais').optional().isLength({ max: 100 }).withMessage('País demasiado largo'),
  body('foto_perfil_url').optional().isLength({ max: 500 }).withMessage('URL de foto demasiado larga')
];

// Validaciones para login
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña es requerida')
];

// Ruta para registro de usuarios
router.post('/register', registerValidation, register);

// Ruta para login de usuarios
router.post('/login', loginValidation, login);

// Ruta para subir foto de perfil
router.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
