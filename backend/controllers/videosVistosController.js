// backend/controllers/videosVistosController.js
const db = require('../db');

// Función para actualizar el progreso del curso
const updateCourseProgress = async (id_usuario, id_video) => {
  try {
    // Encontrar el curso asociado al video
    const [videoToCourse] = await db.promise().query(`
      SELECT m.id_curso FROM videos v
      JOIN modulos m ON v.id_modulo = m.id_modulo
      WHERE v.id_video = ?
    `, [id_video]);

    if (videoToCourse.length === 0) {
      console.log('No se encontró curso para este video.');
      return; // No se encontró curso para este video
    }
    const id_curso = videoToCourse[0].id_curso;

    // Contar videos vistos para ese curso y usuario
    const [countResult] = await db.promise().query(`
      SELECT COUNT(*) as vistos FROM videos_vistos vv
      JOIN videos v ON vv.id_video = v.id_video
      JOIN modulos m ON v.id_modulo = m.id_modulo
      WHERE vv.id_usuario = ? AND m.id_curso = ?
    `, [id_usuario, id_curso]);
    const videosVistos = countResult[0].vistos;

    // Actualizar la tabla cursos_estudiante
    await db.promise().query(`
      UPDATE cursos_estudiante
      SET videos_vistos = ?
      WHERE id_usuario = ? AND id_curso = ?
    `, [videosVistos, id_usuario, id_curso]);

  } catch (error) {
    console.error('Error al actualizar el progreso del curso:', error);
  }
};

// Obtener estadísticas generales de videos vistos
const getVideosVistosStats = async (req, res) => {
  try {
    // Estadísticas generales
    const [generalStats] = await db.promise().query(`
      SELECT
        COUNT(DISTINCT vv.id_usuario) as total_usuarios_activos,
        COUNT(DISTINCT vv.id_video) as total_videos_vistos,
        COUNT(vv.id_visto) as total_visualizaciones,
        AVG(TIMESTAMPDIFF(MINUTE, vv.fecha_primera_vista, vv.fecha_ultima_vista)) as tiempo_promedio_sesion
      FROM videos_vistos vv
    `);

    // Videos más vistos
    const [topVideos] = await db.promise().query(`
      SELECT
        v.id_video,
        v.titulo as video_titulo,
        m.titulo as modulo_titulo,
        c.titulo as curso_titulo,
        COUNT(vv.id_visto) as total_vistas,
        COUNT(DISTINCT vv.id_usuario) as usuarios_unicos
      FROM videos_vistos vv
      JOIN videos v ON vv.id_video = v.id_video
      JOIN modulos m ON v.id_modulo = m.id_modulo
      JOIN cursos c ON m.id_curso = c.id_curso
      GROUP BY v.id_video, v.titulo, m.titulo, c.titulo
      ORDER BY total_vistas DESC
      LIMIT 10
    `);

    // Usuarios más activos
    const [topUsers] = await db.promise().query(`
      SELECT
        u.id_usuario,
        u.nombre_completo,
        u.email,
        COUNT(vv.id_visto) as videos_vistos,
        COUNT(DISTINCT m.id_curso) as cursos_activos,
        MAX(vv.fecha_ultima_vista) as ultima_actividad
      FROM videos_vistos vv
      JOIN usuarios u ON vv.id_usuario = u.id_usuario
      JOIN videos v ON vv.id_video = v.id_video
      JOIN modulos m ON v.id_modulo = m.id_modulo
      GROUP BY u.id_usuario, u.nombre_completo, u.email
      ORDER BY videos_vistos DESC
      LIMIT 10
    `);

    res.json({
      general: generalStats[0],
      topVideos,
      topUsers
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener usuarios con sus cursos inscritos
const getUsuariosConCursos = async (req, res) => {
  try {
    const query = `
      SELECT
        u.id_usuario,
        u.nombre_completo,
        u.email,
        u.fecha_registro,
        ce.id_curso,
        c.titulo as curso_titulo,
        c.estado as curso_estado,
        ce.estado as estado_inscripcion,
        ce.fecha_activacion,
        ce.videos_vistos,
        ce.fecha_ultimo_acceso,
        (SELECT COUNT(v.id_video)
         FROM videos v
         JOIN modulos m ON v.id_modulo = m.id_modulo
         WHERE m.id_curso = ce.id_curso) as total_videos_curso
      FROM usuarios u
      LEFT JOIN cursos_estudiante ce ON u.id_usuario = ce.id_usuario
      LEFT JOIN cursos c ON ce.id_curso = c.id_curso
      WHERE u.rol = 'estudiante'
      ORDER BY u.nombre_completo, c.titulo
    `;

    const [results] = await db.promise().query(query);

    // Agrupar por usuario
    const usuariosMap = new Map();

    results.forEach(row => {
      if (!usuariosMap.has(row.id_usuario)) {
        usuariosMap.set(row.id_usuario, {
          id_usuario: row.id_usuario,
          nombre_completo: row.nombre_completo,
          email: row.email,
          fecha_registro: row.fecha_registro,
          cursos: []
        });
      }

      if (row.id_curso) {
        usuariosMap.get(row.id_usuario).cursos.push({
          id_curso: row.id_curso,
          titulo: row.curso_titulo,
          estado_curso: row.curso_estado,
          estado_inscripcion: row.estado_inscripcion,
          fecha_activacion: row.fecha_activacion,
          videos_vistos: row.videos_vistos,
          total_videos: row.total_videos_curso,
          fecha_ultimo_acceso: row.fecha_ultimo_acceso
        });
      }
    });

    const usuarios = Array.from(usuariosMap.values());
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios con cursos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Marcar un video como visto (crear o ignorar si ya existe)
const markAsSeen = async (req, res) => {
  const { id_usuario, id_video } = req.body;
  if (!id_usuario || !id_video) {
    return res.status(400).json({ error: 'ID de usuario e ID de video son requeridos' });
  }

  try {
    const query = 'INSERT IGNORE INTO videos_vistos (id_usuario, id_video) VALUES (?, ?)';
    const [result] = await db.promise().query(query, [id_usuario, id_video]);

    // Si se insertó una nueva fila, actualizar el progreso
    if (result.affectedRows > 0) {
      await updateCourseProgress(id_usuario, id_video);
    }

    res.status(201).json({ message: 'Video marcado como visto' });
  } catch (error) {
    console.error('Error al marcar video como visto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Desmarcar un video como visto
const unmarkAsSeen = async (req, res) => {
  const { id_usuario, id_video } = req.body;
  if (!id_usuario || !id_video) {
    return res.status(400).json({ error: 'ID de usuario e ID de video son requeridos' });
  }

  try {
    const query = 'DELETE FROM videos_vistos WHERE id_usuario = ? AND id_video = ?';
    const [result] = await db.promise().query(query, [id_usuario, id_video]);

    if (result.affectedRows > 0) {
      await updateCourseProgress(id_usuario, id_video);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro de video visto no encontrado' });
    }
    res.json({ message: 'Video desmarcado como visto' });
  } catch (error) {
    console.error('Error al desmarcar video como visto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener solo los IDs de los videos vistos por un usuario
const getSeenVideoIdsByUser = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const query = 'SELECT id_video FROM videos_vistos WHERE id_usuario = ?';
    const [results] = await db.promise().query(query, [id_usuario]);
    const videoIds = results.map(row => row.id_video);
    res.json(videoIds);
  } catch (error) {
    console.error('Error al obtener IDs de videos vistos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los registros de videos vistos con información detallada
const getAllVideosVistos = async (req, res) => {
  try {
    const query = `
      SELECT
        vv.id_visto as id_video_visto,
        vv.fecha_primera_vista as fecha_visualizacion,
        vv.fecha_ultima_vista as fecha_ultima_visualizacion,
        0 as progreso_segundos, -- Placeholder, ya que no hay campo de progreso en la tabla
        u.id_usuario,
        u.nombre_completo as nombre_usuario,
        u.email as email_usuario,
        u.telefono as telefono_usuario,
        u.ciudad as ciudad_usuario,
        u.pais as pais_usuario,
        u.rol as rol_usuario,
        u.estado as estado_usuario,
        u.fecha_registro as fecha_registro_usuario,
        u.fecha_ultimo_acceso as fecha_ultimo_acceso_usuario,
        v.id_video,
        v.titulo as titulo_video,
        v.descripcion as descripcion_video,
        v.video_url,
        v.thumbnail_url,
        v.numero_orden as orden_video,
        v.estado as estado_video,
        m.id_modulo,
        m.titulo as titulo_modulo,
        m.descripcion as descripcion_modulo,
        m.numero_orden as orden_modulo,
        m.estado as estado_modulo,
        c.id_curso,
        c.titulo as titulo_curso,
        c.descripcion as descripcion_curso,
        c.imagen_url as imagen_curso,
        c.codigo_acceso,
        c.precio as precio_curso,
        c.estado as estado_curso,
        c.fecha_creacion as fecha_creacion_curso,
        c.fecha_publicacion as fecha_publicacion_curso,
        ce.estado as estado_inscripcion_curso,
        ce.fecha_activacion as fecha_activacion_curso,
        ce.videos_vistos as videos_vistos_curso,
        ce.fecha_ultimo_acceso as fecha_ultimo_acceso_curso
      FROM videos_vistos vv
      JOIN usuarios u ON vv.id_usuario = u.id_usuario
      JOIN videos v ON vv.id_video = v.id_video
      JOIN modulos m ON v.id_modulo = m.id_modulo
      JOIN cursos c ON m.id_curso = c.id_curso
      LEFT JOIN cursos_estudiante ce ON ce.id_usuario = vv.id_usuario AND ce.id_curso = c.id_curso
      ORDER BY vv.fecha_primera_vista DESC
    `;

    const [results] = await db.promise().query(query);
    res.json(results);
  } catch (error) {
    console.error('Error al obtener todos los videos vistos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  markAsSeen,
  unmarkAsSeen,
  getSeenVideoIdsByUser,
  getVideosVistosStats,
  getUsuariosConCursos,
  getAllVideosVistos,
};
