// Controlador para gestión de videos
const db = require('../db');

// Obtener todos los videos
const getAllVideos = async (req, res) => {
  try {
    const [videos] = await db.promise().query(`
      SELECT v.*, m.titulo as modulo_titulo, c.id_curso, c.titulo as curso_titulo
      FROM videos v
      LEFT JOIN modulos m ON v.id_modulo = m.id_modulo
      LEFT JOIN cursos c ON m.id_curso = c.id_curso
      ORDER BY c.titulo, m.titulo, v.numero_orden
    `);
    res.json(videos);
  } catch (error) {
    console.error('Error al obtener videos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener videos por módulo específico
const getVideosByModulo = async (req, res) => {
  const { id_modulo } = req.params;
  try {
    const [videos] = await db.promise().query(`
      SELECT v.*, m.titulo as modulo_titulo, c.id_curso, c.titulo as curso_titulo
      FROM videos v
      LEFT JOIN modulos m ON v.id_modulo = m.id_modulo
      LEFT JOIN cursos c ON m.id_curso = c.id_curso
      WHERE v.id_modulo = ?
      ORDER BY v.numero_orden
    `, [id_modulo]);
    res.json(videos);
  } catch (error) {
    console.error('Error al obtener videos del módulo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo video
const createVideo = async (req, res) => {
  const { titulo, descripcion, id_modulo, estado } = req.body;

  try {
    // 1. Calcular el siguiente número de orden para el módulo
    const [result] = await db.promise().query('SELECT MAX(numero_orden) as max_orden FROM videos WHERE id_modulo = ?', [id_modulo]);
    const newOrderNumber = (result[0].max_orden || 0) + 1;

    // 2. Determinar la URL del video
    let videoUrl = req.body.video_url;
    if (req.files && req.files.videoFile) {
      videoUrl = `/uploads/videos/${req.files.videoFile[0].filename}`;
    }

    // 3. Determinar la URL de la miniatura
    let thumbnailUrl = req.body.thumbnail_url;
    if (req.files && req.files.thumbnailFile) {
      thumbnailUrl = `/uploads/imagenes_videos/${req.files.thumbnailFile[0].filename}`;
    }

    // 4. Insertar el video en la base de datos
    const query = `
      INSERT INTO videos (titulo, descripcion, video_url, thumbnail_url, id_modulo, numero_orden, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [titulo, descripcion, videoUrl, thumbnailUrl, id_modulo, newOrderNumber, estado || 'activo'];
    await db.promise().query(query, values);
    res.status(201).json({ message: 'Video creado exitosamente' });

  } catch (error) {
    console.error('Error al crear video:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Error de duplicado, contacte a soporte.' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Actualizar un video
const updateVideo = async (req, res) => {
  const { id_video } = req.params;
  const { titulo, descripcion, id_modulo, numero_orden, estado } = req.body;

  let videoUrl = req.body.video_url;
  if (req.files && req.files.videoFile) {
    videoUrl = `/uploads/videos/${req.files.videoFile[0].filename}`;
  }

  let thumbnailUrl = req.body.thumbnail_url;
  if (req.files && req.files.thumbnailFile) {
    thumbnailUrl = `/uploads/imagenes_videos/${req.files.thumbnailFile[0].filename}`;
  }

  try {
    const query = `
      UPDATE videos
      SET titulo = ?, descripcion = ?, video_url = ?, thumbnail_url = ?, id_modulo = ?, numero_orden = ?, estado = ?
      WHERE id_video = ?
    `;
    const values = [titulo, descripcion, videoUrl, thumbnailUrl, id_modulo, numero_orden, estado, id_video];
    await db.promise().query(query, values);
    res.json({ message: 'Video actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar video:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Ya existe un video con ese número de orden en este módulo' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Eliminar un video
const deleteVideo = async (req, res) => {
  const { id_video } = req.params;
  try {
    await db.promise().query('DELETE FROM videos WHERE id_video = ?', [id_video]);
    res.json({ message: 'Video eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar video:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getVideosByStudentId = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const query = `
      SELECT
        v.id_video,
        v.titulo AS video_titulo,
        v.descripcion AS video_descripcion,
        v.video_url,
        v.thumbnail_url,
        m.id_modulo,
        m.titulo AS modulo_titulo,
        c.id_curso,
        c.titulo AS curso_titulo
      FROM videos v
      JOIN modulos m ON v.id_modulo = m.id_modulo
      JOIN cursos c ON m.id_curso = c.id_curso
      JOIN cursos_estudiante ce ON c.id_curso = ce.id_curso
      WHERE
        ce.id_usuario = ? AND ce.estado = 'activo'
      ORDER BY
        c.titulo, m.numero_orden, v.numero_orden;
    `;
    const [videos] = await db.promise().query(query, [id_usuario]);
    res.json(videos);
  } catch (error) {
    console.error('Error al obtener los videos del estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllVideos,
  getVideosByModulo,
  getVideosByStudentId,
  createVideo,
  updateVideo,
  deleteVideo
};