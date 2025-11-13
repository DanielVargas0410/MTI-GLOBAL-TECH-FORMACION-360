// Servidor Express básico para el backend de Formación 360
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoriasRoutes = require('./routes/categorias');
const cursosRoutes = require('./routes/cursos');
const modulosRoutes = require('./routes/modulos');
const videosRoutes = require('./routes/videos');
const cursosEstudianteRoutes = require('./routes/cursosEstudiante');
const videosVistosRoutes = require('./routes/videosVistos');
const certificadosRoutes = require('./routes/certificados')
const actividadesRoutes = require('./routes/actividades')
const heroRoutes = require('./routes/hero')

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para CORS
app.use(cors());

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Servir archivos estáticos desde uploads
app.use('/uploads', express.static('uploads'));

// Rutas de autenticación
app.use('/auth', authRoutes);

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/test-db', (req, res) => {
  // Ejecutar una consulta simple para probar la conexión
  db.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
    res.json({ message: 'Conexión a la base de datos exitosa', results });
  });
});

// Ruta básica de bienvenida
app.get('/', (req, res) => {
  res.json({ message: 'Backend de Formación 360 funcionando correctamente' });
});

// Rutas para usuarios
app.use('/users', userRoutes);

// Rutas para categorías
app.use('/categorias', categoriasRoutes);

// Rutas para cursos
app.use('/cursos', cursosRoutes);

// Rutas para módulos
app.use('/modulos', modulosRoutes);

// Rutas para videos
app.use('/videos', videosRoutes);

// Rutas para cursos_estudiante
app.use('/cursos-estudiante', cursosEstudianteRoutes);

// Rutas para videos_vistos
app.use('/videos-vistos', videosVistosRoutes);

// Rutas para certificados
app.use('/certificados', certificadosRoutes)
app.use('/actividades', actividadesRoutes)

// Rutas para imágenes del hero
app.use('/hero', heroRoutes)

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
