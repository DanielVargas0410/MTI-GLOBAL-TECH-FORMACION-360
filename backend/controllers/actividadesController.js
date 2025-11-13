// Controlador para gestionar actividades de auditoría
const db = require('../db');

// Obtener todas las actividades con información de usuario, curso y video
const getAllActividades = (req, res) => {
  const query = `
    SELECT
      a.*,
      u.nombre_completo as nombre_usuario,
      u.email as email_usuario,
      c.titulo as curso_titulo,
      v.titulo as video_titulo
    FROM actividades a
    LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
    LEFT JOIN cursos c ON a.id_curso = c.id_curso
    LEFT JOIN videos v ON a.id_video = v.id_video
    ORDER BY a.fecha_actividad DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener actividades:', err);
      return res.status(500).json({ error: 'Error al obtener actividades' });
    }
    res.json(results);
  });
};

// Obtener actividad por ID
const getActividadById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT
      a.*,
      u.nombre_completo as nombre_usuario,
      u.email as email_usuario,
      c.titulo as curso_titulo,
      v.titulo as video_titulo
    FROM actividades a
    LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
    LEFT JOIN cursos c ON a.id_curso = c.id_curso
    LEFT JOIN videos v ON a.id_video = v.id_video
    WHERE a.id_actividad = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener actividad:', err);
      return res.status(500).json({ error: 'Error al obtener actividad' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.json(results[0]);
  });
};

// Obtener actividades por usuario
const getActividadesByUsuario = (req, res) => {
  const { id_usuario } = req.params;
  const query = `
    SELECT
      a.*,
      u.nombre_completo as nombre_usuario,
      u.email as email_usuario,
      c.titulo as curso_titulo,
      v.titulo as video_titulo
    FROM actividades a
    LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
    LEFT JOIN cursos c ON a.id_curso = c.id_curso
    LEFT JOIN videos v ON a.id_video = v.id_video
    WHERE a.id_usuario = ?
    ORDER BY a.fecha_actividad DESC
  `;

  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener actividades del usuario:', err);
      return res.status(500).json({ error: 'Error al obtener actividades del usuario' });
    }
    res.json(results);
  });
};

// Obtener actividades por tipo
const getActividadesByTipo = (req, res) => {
  const { tipo } = req.params;
  const query = `
    SELECT
      a.*,
      u.nombre_completo as nombre_usuario,
      u.email as email_usuario,
      c.titulo as curso_titulo,
      v.titulo as video_titulo
    FROM actividades a
    LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
    LEFT JOIN cursos c ON a.id_curso = c.id_curso
    LEFT JOIN videos v ON a.id_video = v.id_video
    WHERE a.tipo_actividad = ?
    ORDER BY a.fecha_actividad DESC
  `;

  db.query(query, [tipo], (err, results) => {
    if (err) {
      console.error('Error al obtener actividades por tipo:', err);
      return res.status(500).json({ error: 'Error al obtener actividades por tipo' });
    }
    res.json(results);
  });
};

// Crear nueva actividad
const createActividad = (req, res) => {
  const { id_usuario, tipo_actividad, descripcion, id_curso, id_video, user_agent } = req.body;

  // Validar campos requeridos
  if (!id_usuario || !tipo_actividad) {
    return res.status(400).json({ error: 'ID de usuario y tipo de actividad son requeridos' });
  }

  const query = `
    INSERT INTO actividades (id_usuario, tipo_actividad, descripcion, id_curso, id_video, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [id_usuario, tipo_actividad, descripcion, id_curso, id_video, user_agent], (err, result) => {
    if (err) {
      console.error('Error al crear actividad:', err);
      return res.status(500).json({ error: 'Error al crear actividad' });
    }
    res.status(201).json({
      message: 'Actividad creada exitosamente',
      id_actividad: result.insertId
    });
  });
};

// Actualizar actividad
const updateActividad = (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;

  const query = 'UPDATE actividades SET descripcion = ? WHERE id_actividad = ?';

  db.query(query, [descripcion, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar actividad:', err);
      return res.status(500).json({ error: 'Error al actualizar actividad' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.json({ message: 'Actividad actualizada exitosamente' });
  });
};

// Eliminar actividad
const deleteActividad = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM actividades WHERE id_actividad = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar actividad:', err);
      return res.status(500).json({ error: 'Error al eliminar actividad' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.json({ message: 'Actividad eliminada exitosamente' });
  });
};

// Obtener estadísticas de actividades
const getEstadisticasActividades = (req, res) => {
  const query = `
    SELECT
      tipo_actividad,
      COUNT(*) as total,
      DATE(fecha_actividad) as fecha
    FROM actividades
    WHERE fecha_actividad >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY tipo_actividad, DATE(fecha_actividad)
    ORDER BY fecha DESC, total DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener estadísticas:', err);
      return res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
    res.json(results);
  });
};

// Obtener estadísticas mensuales de usuarios, cursos y progreso de videos
const getEstadisticasMensuales = (req, res) => {
  // Query for monthly user registrations
  const usersQuery = `
    SELECT
      DATE_FORMAT(fecha_registro, '%Y-%m') as month,
      COUNT(*) as estudiantes
    FROM usuarios
    WHERE fecha_registro >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(fecha_registro, '%Y-%m')
    ORDER BY month
  `;

  // Query for monthly course creations
  const coursesQuery = `
    SELECT
      DATE_FORMAT(fecha_creacion, '%Y-%m') as month,
      COUNT(*) as cursos
    FROM cursos
    WHERE fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m')
    ORDER BY month
  `;

  // Query for monthly video views
  const videosQuery = `
    SELECT
      DATE_FORMAT(fecha_primera_vista, '%Y-%m') as month,
      COUNT(*) as videos_vistos
    FROM videos_vistos
    WHERE fecha_primera_vista >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(fecha_primera_vista, '%Y-%m')
    ORDER BY month
  `;

  // Query for total videos per course (static data)
  const totalVideosQuery = `
    SELECT
      c.id_curso,
      c.titulo,
      COUNT(v.id_video) as total_videos
    FROM cursos c
    LEFT JOIN modulos m ON c.id_curso = m.id_curso
    LEFT JOIN videos v ON m.id_modulo = v.id_modulo
    GROUP BY c.id_curso, c.titulo
    ORDER BY c.titulo
  `;

  // Execute all queries
  db.query(usersQuery, (err, usersResults) => {
    if (err) {
      console.error('Error fetching monthly users:', err);
      return res.status(500).json({ error: 'Error fetching monthly users' });
    }

    db.query(coursesQuery, (err, coursesResults) => {
      if (err) {
        console.error('Error fetching monthly courses:', err);
        return res.status(500).json({ error: 'Error fetching monthly courses' });
      }

      db.query(videosQuery, (err, videosResults) => {
        if (err) {
          console.error('Error fetching monthly videos:', err);
          return res.status(500).json({ error: 'Error fetching monthly videos' });
        }

        db.query(totalVideosQuery, (err, totalVideosResults) => {
          if (err) {
            console.error('Error fetching total videos:', err);
            return res.status(500).json({ error: 'Error fetching total videos' });
          }

          // Merge the results
          const monthlyData = {};

          // Add users data
          usersResults.forEach(item => {
            const month = item.month;
            monthlyData[month] = {
              month,
              estudiantes: item.estudiantes,
              cursos: 0,
              videos_vistos: 0,
              total_videos: 0
            };
          });

          // Add courses data
          coursesResults.forEach(item => {
            const month = item.month;
            if (monthlyData[month]) {
              monthlyData[month].cursos = item.cursos;
            } else {
              monthlyData[month] = {
                month,
                estudiantes: 0,
                cursos: item.cursos,
                videos_vistos: 0,
                total_videos: 0
              };
            }
          });

          // Add videos data
          videosResults.forEach(item => {
            const month = item.month;
            if (monthlyData[month]) {
              monthlyData[month].videos_vistos = item.videos_vistos;
            } else {
              monthlyData[month] = {
                month,
                estudiantes: 0,
                cursos: 0,
                videos_vistos: item.videos_vistos,
                total_videos: 0
              };
            }
          });

          // Calculate total videos (sum of all courses' videos)
          const totalVideosSum = totalVideosResults.reduce((sum, course) => sum + course.total_videos, 0);

          // Add total videos to each month
          Object.keys(monthlyData).forEach(month => {
            monthlyData[month].total_videos = totalVideosSum;
          });

          const result = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
          res.json(result);
        });
      });
    });
  });
};

module.exports = {
  getAllActividades,
  getActividadById,
  getActividadesByUsuario,
  getActividadesByTipo,
  createActividad,
  updateActividad,
  deleteActividad,
  getEstadisticasActividades,
  getEstadisticasMensuales
};
