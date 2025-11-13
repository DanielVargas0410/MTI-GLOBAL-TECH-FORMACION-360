// Controlador para gestión de cursos_estudiante
const db = require('../db');

// Función para generar un código de activación aleatorio
const generateActivationCode = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Obtener todos los cursos_estudiante
const getAllCursosEstudiante = async (req, res) => {
  try {
    const [cursosEstudiante] = await db.promise().query(`
      SELECT ce.*,
        JSON_OBJECT('nombre_completo', u.nombre_completo, 'email', u.email) as usuario,
        JSON_OBJECT('titulo', c.titulo, 'codigo_acceso', c.codigo_acceso) as curso
      FROM cursos_estudiante ce
      LEFT JOIN usuarios u ON ce.id_usuario = u.id_usuario
      LEFT JOIN cursos c ON ce.id_curso = c.id_curso
    `);
    res.json(cursosEstudiante);
  } catch (error) {
    console.error('Error al obtener cursos_estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo curso_estudiante (Asignación por parte del admin)
const createCursoEstudiante = async (req, res) => {
  const { id_usuario, id_curso } = req.body;
  const codigo_activacion = generateActivationCode();

  try {
    const insertQuery = `
      INSERT INTO cursos_estudiante (id_usuario, id_curso, codigo_activacion, estado)
      VALUES (?, ?, ?, ?)
    `;
    const values = [id_usuario, id_curso, codigo_activacion, 'pendiente'];
    const [result] = await db.promise().query(insertQuery, values);
    const insertId = result.insertId;

    const selectQuery = `
      SELECT ce.*,
        JSON_OBJECT('nombre_completo', u.nombre_completo, 'email', u.email) as usuario,
        JSON_OBJECT('titulo', c.titulo, 'codigo_acceso', c.codigo_acceso) as curso
      FROM cursos_estudiante ce
      LEFT JOIN usuarios u ON ce.id_usuario = u.id_usuario
      LEFT JOIN cursos c ON ce.id_curso = c.id_curso
      WHERE ce.id_curso_estudiante = ?
    `;
    const [newCursoEstudiante] = await db.promise().query(selectQuery, [insertId]);

    res.status(201).json(newCursoEstudiante[0]);

  } catch (error) {
    console.error('Error al crear curso_estudiante:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El usuario ya tiene este curso asignado.' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar un curso_estudiante
const updateCursoEstudiante = async (req, res) => {
  const { id_curso_estudiante } = req.params;
  const { estado, videos_vistos, comentario_curso } = req.body;
  try {
    const query = `
      UPDATE cursos_estudiante
      SET estado = ?, videos_vistos = ?, comentario_curso = ?
      WHERE id_curso_estudiante = ?
    `;
    const values = [estado, videos_vistos, comentario_curso, id_curso_estudiante];
    await db.promise().query(query, values);
    res.json({ message: 'Curso estudiante actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar curso_estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un curso_estudiante
const deleteCursoEstudiante = async (req, res) => {
  const { id_curso_estudiante } = req.params;
  try {
    await db.promise().query('DELETE FROM cursos_estudiante WHERE id_curso_estudiante = ?', [id_curso_estudiante]);
    res.json({ message: 'Curso estudiante eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar curso_estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getCursosByStudentId = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const query = `
      SELECT
          c.id_curso,
          c.titulo,
          c.descripcion,
          c.imagen_url,
          ce.estado,
          COUNT(v.id_video) AS total_videos,
          ce.videos_vistos,
          IF(COUNT(v.id_video) > 0, (ce.videos_vistos / COUNT(v.id_video)) * 100, 0) AS progreso
      FROM
          cursos_estudiante ce
      JOIN
          cursos c ON ce.id_curso = c.id_curso
      LEFT JOIN
          modulos m ON c.id_curso = m.id_curso
      LEFT JOIN
          videos v ON m.id_modulo = v.id_modulo
      WHERE
          ce.id_usuario = ?
      GROUP BY
          c.id_curso, ce.id_curso_estudiante;
    `;
    const [cursos] = await db.promise().query(query, [id_usuario]);
    res.json(cursos);
  } catch (error) {
    console.error('Error al obtener los cursos del estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para que un estudiante active un curso
const activarCurso = async (req, res) => {
  const { id_usuario, codigo_activacion } = req.body;

  if (!id_usuario || !codigo_activacion) {
    return res.status(400).json({ error: 'El ID de usuario y el código de activación son requeridos.' });
  }

  try {
    const findQuery = `
      SELECT id_curso_estudiante, estado
      FROM cursos_estudiante
      WHERE id_usuario = ? AND codigo_activacion = ?
    `;
    const [rows] = await db.promise().query(findQuery, [id_usuario, codigo_activacion]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Código de activación inválido o no corresponde al usuario.' });
    }

    const cursoEstudiante = rows[0];

    if (cursoEstudiante.estado !== 'pendiente') {
      return res.status(409).json({ error: 'Este curso ya ha sido activado.' });
    }

    const updateQuery = `
      UPDATE cursos_estudiante
      SET estado = 'activo', fecha_activacion = CURRENT_TIMESTAMP
      WHERE id_curso_estudiante = ?
    `;
    await db.promise().query(updateQuery, [cursoEstudiante.id_curso_estudiante]);

    res.json({ message: 'Curso activado exitosamente.' });
  } catch (error) {
    console.error('Error al activar el curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllCursosEstudiante,
  getCursosByStudentId,
  createCursoEstudiante,
  updateCursoEstudiante,
  deleteCursoEstudiante,
  activarCurso
};
