// Controlador para gestión de módulos
const db = require('../db');

// Obtener todos los módulos con información del curso
const getAllModulos = async (req, res) => {
  try {
    const [modulos] = await db.promise().query(`
      SELECT m.*, c.titulo as curso_titulo
      FROM modulos m
      LEFT JOIN cursos c ON m.id_curso = c.id_curso
      ORDER BY m.id_curso, m.numero_orden
    `);
    res.json(modulos);
  } catch (error) {
    console.error('Error al obtener módulos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener módulos por curso específico
const getModulosByCurso = async (req, res) => {
  const { id_curso } = req.params;
  try {
    const [modulos] = await db.promise().query(`
      SELECT m.*, c.titulo as curso_titulo
      FROM modulos m
      LEFT JOIN cursos c ON m.id_curso = c.id_curso
      WHERE m.id_curso = ?
      ORDER BY m.numero_orden
    `, [id_curso]);
    res.json(modulos);
  } catch (error) {
    console.error('Error al obtener módulos del curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo módulo
const createModulo = async (req, res) => {
  const { titulo, descripcion, id_curso, numero_orden, estado } = req.body;
  try {
    const query = `
      INSERT INTO modulos (titulo, descripcion, id_curso, numero_orden, estado)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [titulo, descripcion, id_curso, numero_orden, estado || 'activo'];
    await db.promise().query(query, values);
    res.status(201).json({ message: 'Módulo creado exitosamente' });
  } catch (error) {
    console.error('Error al crear módulo:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Ya existe un módulo con ese número de orden en este curso' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Actualizar un módulo
const updateModulo = async (req, res) => {
  const { id_modulo } = req.params;
  const { titulo, descripcion, id_curso, numero_orden, estado } = req.body;
  try {
    const query = `
      UPDATE modulos
      SET titulo = ?, descripcion = ?, id_curso = ?, numero_orden = ?, estado = ?
      WHERE id_modulo = ?
    `;
    const values = [titulo, descripcion, id_curso, numero_orden, estado, id_modulo];
    await db.promise().query(query, values);
    res.json({ message: 'Módulo actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar módulo:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Ya existe un módulo con ese número de orden en este curso' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Eliminar un módulo
const deleteModulo = async (req, res) => {
  const { id_modulo } = req.params;
  try {
    await db.promise().query('DELETE FROM modulos WHERE id_modulo = ?', [id_modulo]);
    res.json({ message: 'Módulo eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar módulo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllModulos,
  getModulosByCurso,
  createModulo,
  updateModulo,
  deleteModulo
};
