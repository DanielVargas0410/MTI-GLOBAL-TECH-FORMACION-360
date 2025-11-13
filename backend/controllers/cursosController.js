// Controlador para gestión de cursos
const db = require('../db');

// Obtener todos los cursos
const getAllCursos = async (req, res) => {
  try {
    const [cursos] = await db.promise().query(`
      SELECT c.*, cat.nombre as categoria_nombre
      FROM cursos c
      LEFT JOIN categorias cat ON c.id_categoria = cat.id_categoria
    `);
    res.json(cursos);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo curso
const createCurso = async (req, res) => {
  const { titulo, descripcion, codigo_acceso, id_categoria, precio, estado } = req.body;
  // La URL de la imagen se construye a partir del archivo subido
  const imagen_url = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;

  // Validar que el código de acceso no esté vacío
  if (!codigo_acceso || codigo_acceso.trim() === '') {
    return res.status(400).json({ error: 'El código de acceso es obligatorio' });
  }

  try {
    const query = `
      INSERT INTO cursos (titulo, descripcion, imagen_url, codigo_acceso, id_categoria, precio, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [titulo, descripcion, imagen_url, codigo_acceso.trim(), id_categoria, precio, estado || 'borrador'];
    await db.promise().query(query, values);
    res.status(201).json({ message: 'Curso creado exitosamente' });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar un curso
const updateCurso = async (req, res) => {
  const { id_curso } = req.params;
  const { titulo, descripcion, codigo_acceso, id_categoria, precio, estado } = req.body;
  let { imagen_url } = req.body;

  // Validar que el código de acceso no esté vacío
  if (!codigo_acceso || codigo_acceso.trim() === '') {
    return res.status(400).json({ error: 'El código de acceso es obligatorio' });
  }

  // Si se sube un nuevo archivo, se actualiza la URL de la imagen
  if (req.file) {
    imagen_url = `http://localhost:3001/uploads/${req.file.filename}`;
  }

  try {
    const query = `
      UPDATE cursos
      SET titulo = ?, descripcion = ?, imagen_url = ?, codigo_acceso = ?, id_categoria = ?, precio = ?, estado = ?
      WHERE id_curso = ?
    `;
    const values = [titulo, descripcion, imagen_url, codigo_acceso.trim(), id_categoria, precio, estado, id_curso];
    await db.promise().query(query, values);
    res.json({ message: 'Curso actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un curso
const deleteCurso = async (req, res) => {
  const { id_curso } = req.params;
  try {
    await db.promise().query('DELETE FROM cursos WHERE id_curso = ?', [id_curso]);
    res.json({ message: 'Curso eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener el detalle completo de un curso con sus módulos y videos
const getCourseDetail = async (req, res) => {
  const { id_curso } = req.params;

  try {
    // 1. Obtener la información del curso
    const [courseResult] = await db.promise().query('SELECT * FROM cursos WHERE id_curso = ?', [id_curso]);
    if (courseResult.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    const course = courseResult[0];

    // 2. Obtener los módulos del curso
    const [modules] = await db.promise().query('SELECT * FROM modulos WHERE id_curso = ? ORDER BY numero_orden', [id_curso]);

    // 3. Para cada módulo, obtener sus videos
    const modulesWithVideos = await Promise.all(
      modules.map(async (module) => {
        const [videos] = await db.promise().query('SELECT * FROM videos WHERE id_modulo = ? ORDER BY numero_orden', [module.id_modulo]);
        return {
          ...module,
          videos: videos,
        };
      })
    );

    // 4. Ensamblar el objeto final
    const courseDetail = {
      ...course,
      modulos: modulesWithVideos,
    };

    res.json(courseDetail);
  } catch (error) {
    console.error('Error al obtener el detalle del curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const activateCourseByCode = async (req, res) => {
  const { id_usuario, codigo_acceso } = req.body;

  if (!id_usuario || !codigo_acceso) {
    return res.status(400).json({ error: 'ID de usuario y código de acceso son requeridos' });
  }

  try {
    // 1. Encontrar el curso por su código de acceso
    const [courseResult] = await db.promise().query('SELECT id_curso FROM cursos WHERE codigo_acceso = ?', [codigo_acceso]);
    if (courseResult.length === 0) {
      return res.status(404).json({ error: 'El código del curso no es válido o no existe.' });
    }
    const id_curso = courseResult[0].id_curso;

    // 2. Verificar si el usuario ya está inscrito en el curso
    const [enrollmentResult] = await db.promise().query('SELECT id_curso_estudiante FROM cursos_estudiante WHERE id_usuario = ? AND id_curso = ?', [id_usuario, id_curso]);
    if (enrollmentResult.length > 0) {
      return res.status(409).json({ error: 'Ya estás inscrito en este curso.' });
    }

    // 3. Inscribir al usuario en el curso
    await db.promise().query('INSERT INTO cursos_estudiante (id_usuario, id_curso) VALUES (?, ?)', [id_usuario, id_curso]);

    res.status(201).json({ message: '¡Curso activado exitosamente!' });

  } catch (error) {
    console.error('Error al activar el curso:', error);
    res.status(500).json({ error: 'Error interno del servidor al intentar activar el curso.' });
  }
};

module.exports = {
  getAllCursos,
  createCurso,
  updateCurso,
  deleteCurso,
  getCourseDetail,
  activateCourseByCode
};