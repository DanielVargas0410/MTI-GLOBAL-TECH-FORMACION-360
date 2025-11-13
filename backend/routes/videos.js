const express = require('express');
const router = express.Router();
const videosController = require('../controllers/videosController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Configuración de Multer para subida de archivos ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'videoFile') {
      uploadPath += 'videos/';
    } else if (file.fieldname === 'thumbnailFile') {
      uploadPath += 'imagenes_videos/';
    }
    // Crear directorio si no existe
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'videoFile') {
      const filetypes = /mp4|mov|avi|mkv/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      }
      return cb(new Error('Error: ¡Solo se permiten archivos de video (MP4, MOV, AVI, MKV)!'));
    } else if (file.fieldname === 'thumbnailFile') {
      const filetypes = /jpeg|jpg|png|gif|webp/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      }
      return cb(new Error('Error: ¡Solo se permiten archivos de imagen (JPEG, PNG, GIF, WEBP)!'));
    }
    cb(new Error('Tipo de archivo no soportado'));
  }
});

const uploadFields = upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]);
// ----------------------------------------------------

// Rutas para gestión de videos
router.get('/', videosController.getAllVideos);
router.get('/modulo/:id_modulo', videosController.getVideosByModulo);
router.get('/estudiante/:id_usuario', videosController.getVideosByStudentId);
router.post('/', uploadFields, videosController.createVideo);
router.put('/:id_video', uploadFields, videosController.updateVideo);
router.delete('/:id_video', videosController.deleteVideo);

module.exports = router;