// Controlador para gestión de categorías
const db = require('../db');

// Obtener todas las categorías
const getAllCategorias = async (req, res) => {
  try {
    const [categorias] = await db.promise().query('SELECT * FROM categorias');
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
  const { nombre, descripcion, estado } = req.body;
  try {
    const query = `
      INSERT INTO categorias (nombre, descripcion, estado)
      VALUES (?, ?, ?)
    `;
    const values = [nombre, descripcion, estado || 'activo'];
    await db.promise().query(query, values);
    res.status(201).json({ message: 'Categoría creada exitosamente' });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar una categoría
const updateCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  const { nombre, descripcion, estado } = req.body;
  try {
    const query = `
      UPDATE categorias
      SET nombre = ?, descripcion = ?, estado = ?
      WHERE id_categoria = ?
    `;
    const values = [nombre, descripcion, estado, id_categoria];
    await db.promise().query(query, values);
    res.json({ message: 'Categoría actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar una categoría
const deleteCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  try {
    await db.promise().query('DELETE FROM categorias WHERE id_categoria = ?', [id_categoria]);
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
