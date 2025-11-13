const db = require('../db');

// Obtener todas las imágenes del hero
const getAllHeroImages = async (req, res) => {
  try {
    const [images] = await db.promise().query('SELECT * FROM hero_images ORDER BY created_at DESC');
    res.json(images);
  } catch (error) {
    console.error('Error al obtener imágenes del hero:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener la imagen activa del hero
const getActiveHeroImage = async (req, res) => {
  try {
    const [images] = await db.promise().query('SELECT * FROM hero_images WHERE estado = "activo" LIMIT 1');
    if (images.length === 0) {
      return res.json({ image_url: '/placeholder.svg' }); // Imagen por defecto
    }
    res.json(images[0]);
  } catch (error) {
    console.error('Error al obtener imagen activa del hero:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear una nueva imagen del hero
const createHeroImage = async (req, res) => {
  const { titulo, descripcion } = req.body;
  const image_url = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;

  if (!image_url) {
    return res.status(400).json({ error: 'Se requiere una imagen' });
  }

  try {
    const query = `
      INSERT INTO hero_images (image_url, titulo, descripcion, estado)
      VALUES (?, ?, ?, 'inactivo')
    `;
    const values = [image_url, titulo || null, descripcion || null];
    const [result] = await db.promise().query(query, values);
    res.status(201).json({
      message: 'Imagen del hero creada exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear imagen del hero:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar una imagen del hero
const updateHeroImage = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estado } = req.body;
  let { image_url } = req.body;

  if (req.file) {
    image_url = `http://localhost:3001/uploads/${req.file.filename}`;
  }

  try {
    const query = `
      UPDATE hero_images
      SET image_url = ?, titulo = ?, descripcion = ?, estado = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const values = [image_url, titulo || null, descripcion || null, estado, id];
    await db.promise().query(query, values);
    res.json({ message: 'Imagen del hero actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar imagen del hero:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Activar una imagen del hero (desactivar las demás)
const activateHeroImage = async (req, res) => {
  const { id } = req.params;

  try {
    // Desactivar todas las imágenes
    await db.promise().query('UPDATE hero_images SET estado = "inactivo"');

    // Activar la imagen seleccionada
    await db.promise().query('UPDATE hero_images SET estado = "activo" WHERE id = ?', [id]);

    res.json({ message: 'Imagen del hero activada exitosamente' });
  } catch (error) {
    console.error('Error al activar imagen del hero:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar una imagen del hero
const deleteHeroImage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().query('DELETE FROM hero_images WHERE id = ?', [id]);
    res.json({ message: 'Imagen del hero eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar imagen del hero:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllHeroImages,
  getActiveHeroImage,
  createHeroImage,
  updateHeroImage,
  activateHeroImage,
  deleteHeroImage
};
