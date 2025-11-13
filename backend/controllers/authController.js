// Controlador para autenticación: registro y login
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const db = require('../db');

// Función para registrar un nuevo usuario
const register = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, nombre_completo, telefono, direccion, ciudad, pais, foto_perfil_url, password } = req.body;

  try {
    // Verificar si el email ya existe
    const [existingUser] = await db.promise().query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Verificar si es el primer usuario para asignar rol administrador
    const [userCount] = await db.promise().query('SELECT COUNT(*) as count FROM usuarios');
    const rol = userCount[0].count === 0 ? 'administrador' : 'estudiante';

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar el nuevo usuario con todos los campos
    const [result] = await db.promise().query(
      `INSERT INTO usuarios
      (email, nombre_completo, telefono, direccion, ciudad, pais, foto_perfil_url, password_hash, rol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        nombre_completo,
        telefono || null,
        direccion || null,
        ciudad || null,
        pais || 'Colombia',
        foto_perfil_url || null,
        hashedPassword,
        rol
      ]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente', id_usuario: result.insertId, rol, nombre_completo });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para iniciar sesión
const login = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const [users] = await db.promise().query('SELECT id_usuario, nombre_completo, password_hash, rol FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Actualizar fecha de último acceso
    await db.promise().query('UPDATE usuarios SET fecha_ultimo_acceso = NOW() WHERE id_usuario = ?', [user.id_usuario]);

    // Obtener todos los datos del usuario para el frontend
    const [userData] = await db.promise().query(
      'SELECT id_usuario, email, nombre_completo, telefono, direccion, ciudad, pais, foto_perfil_url, rol, estado FROM usuarios WHERE id_usuario = ?',
      [user.id_usuario]
    );

    res.json({ message: 'Login exitoso', user: userData[0] });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { register, login };
