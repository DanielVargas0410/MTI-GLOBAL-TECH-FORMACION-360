// Controlador para gestión de usuarios
const db = require('../db');
const bcrypt = require('bcrypt');

// Función para crear un nuevo usuario
const createUser = async (req, res) => {
  console.log('Datos recibidos en createUser:', req.body);
  const { email, nombre_completo, telefono, direccion, ciudad, pais, password, rol, estado } = req.body;

  try {
    // Verificar si el email ya existe
    const [existingUser] = await db.promise().query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      console.log('Email ya existe:', email);
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña hasheada correctamente');

    const query = `
      INSERT INTO usuarios (email, nombre_completo, telefono, direccion, ciudad, pais, password_hash, rol, estado, fecha_registro)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [email, nombre_completo, telefono || null, direccion || null, ciudad || null, pais || null, hashedPassword, rol, estado];
    console.log('Valores a insertar:', values);

    const [result] = await db.promise().query(query, values);
    console.log('Usuario creado exitosamente, ID:', result.insertId);
    res.status(201).json({ message: 'Usuario creado exitosamente', id_usuario: result.insertId });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.promise().query('SELECT id_usuario, email, nombre_completo, telefono, direccion, ciudad, pais, foto_perfil_url, rol, estado, fecha_registro, fecha_ultimo_acceso FROM usuarios');
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para actualizar un usuario
const updateUser = async (req, res) => {
  const { id_usuario } = req.params;
  const { email, nombre_completo, telefono, direccion, ciudad, pais, foto_perfil_url, rol, estado } = req.body;

  try {
    const query = `
      UPDATE usuarios
      SET email = ?, nombre_completo = ?, telefono = ?, direccion = ?, ciudad = ?, pais = ?, foto_perfil_url = ?, rol = ?, estado = ?
      WHERE id_usuario = ?
    `;
    const values = [email, nombre_completo, telefono, direccion, ciudad, pais, foto_perfil_url, rol, estado, id_usuario];

    await db.promise().query(query, values);
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para eliminar un usuario
const deleteUser = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    await db.promise().query('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario]);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para obtener un usuario por su ID
const getUserById = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const [user] = await db.promise().query('SELECT id_usuario, email, nombre_completo, telefono, direccion, ciudad, pais, rol, estado, fecha_registro, fecha_ultimo_acceso, foto_perfil_url FROM usuarios WHERE id_usuario = ?', [id_usuario]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para obtener los cursos de un usuario
const getUserCourses = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const query = `
      SELECT
          c.id_curso,
          c.titulo,
          c.descripcion,
          ce.created_at as fecha_inscripcion,
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
    const [courses] = await db.promise().query(query, [id_usuario]);
    res.json(courses);
  } catch (error) {
    console.error('Error al obtener los cursos del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para que un estudiante actualice su propio perfil
const updateStudentProfile = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const updateData = {};

    if (req.body.nombre_completo !== undefined) {
      updateData.nombre_completo = req.body.nombre_completo;
    }
    if (req.body.telefono !== undefined) {
      updateData.telefono = req.body.telefono;
    }
    if (req.body.direccion !== undefined) {
      updateData.direccion = req.body.direccion;
    }
    if (req.body.ciudad !== undefined) {
      updateData.ciudad = req.body.ciudad;
    }
    if (req.body.pais !== undefined) {
      updateData.pais = req.body.pais;
    }

    // Si se sube una nueva imagen, usar la ruta del archivo subido
    if (req.file) {
      updateData.foto_perfil_url = `/uploads/imagenes_usuarios/${req.file.filename}`;
    } else if (req.body.foto_perfil_url !== undefined) {
      updateData.foto_perfil_url = req.body.foto_perfil_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    const query = `UPDATE usuarios SET ? WHERE id_usuario = ?`;
    await db.promise().query(query, [updateData, id_usuario]);

    res.json({ message: 'Perfil actualizado exitosamente', foto_perfil_url: updateData.foto_perfil_url });
  } catch (error) {
    console.error('Error al actualizar el perfil del estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserCourses,
  updateStudentProfile
};
