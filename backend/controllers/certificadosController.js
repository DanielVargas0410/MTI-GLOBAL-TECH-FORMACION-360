// Controlador para la gestión de certificados
const db = require('../db');

// Obtener todos los certificados con información relacionada
const getAllCertificados = (req, res) => {
  const query = `
    SELECT c.*,
           u.nombre_completo, u.email,
           cu.titulo as curso_titulo, cu.descripcion as curso_descripcion
    FROM certificados c
    LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
    LEFT JOIN cursos cu ON c.id_curso = cu.id_curso
    ORDER BY c.fecha_emision DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener certificados:', err);
      return res.status(500).json({ error: 'Error al obtener certificados' });
    }
    res.json(results);
  });
};

// Obtener un certificado específico por ID
const getCertificadoById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT c.*,
           u.nombre_completo, u.email,
           cu.titulo as curso_titulo, cu.descripcion as curso_descripcion
    FROM certificados c
    LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
    LEFT JOIN cursos cu ON c.id_curso = cu.id_curso
    WHERE c.id_certificado = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener certificado:', err);
      return res.status(500).json({ error: 'Error al obtener certificado' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Certificado no encontrado' });
    }
    res.json(results[0]);
  });
};

// Crear un nuevo certificado
const createCertificado = (req, res) => {
  const { id_usuario, id_curso, codigo_certificado, nombre_certificado, estado = 'activo' } = req.body;

  // Validar campos requeridos
  if (!id_usuario || !id_curso || !codigo_certificado) {
    return res.status(400).json({ error: 'ID de usuario, ID de curso y código de certificado son requeridos' });
  }

  // Verificar que no exista ya un certificado para este usuario y curso
  const checkQuery = 'SELECT id_certificado FROM certificados WHERE id_usuario = ? AND id_curso = ?';
  db.query(checkQuery, [id_usuario, id_curso], (err, results) => {
    if (err) {
      console.error('Error al verificar certificado existente:', err);
      return res.status(500).json({ error: 'Error al verificar certificado existente' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Ya existe un certificado para este usuario y curso' });
    }

    // Verificar que el código no esté duplicado
    const codeCheckQuery = 'SELECT id_certificado FROM certificados WHERE codigo_certificado = ?';
    db.query(codeCheckQuery, [codigo_certificado], (err, codeResults) => {
      if (err) {
        console.error('Error al verificar código de certificado:', err);
        return res.status(500).json({ error: 'Error al verificar código de certificado' });
      }

      if (codeResults.length > 0) {
        return res.status(409).json({ error: 'El código de certificado ya existe' });
      }

      // Crear el nuevo certificado
      const insertQuery = 'INSERT INTO certificados (id_usuario, id_curso, codigo_certificado, nombre_certificado, estado) VALUES (?, ?, ?, ?, ?)';
      db.query(insertQuery, [id_usuario, id_curso, codigo_certificado, nombre_certificado || null, estado], (err, result) => {
        if (err) {
          console.error('Error al crear certificado:', err);
          return res.status(500).json({ error: 'Error al crear certificado' });
        }
        res.status(201).json({
          message: 'Certificado creado exitosamente',
          id_certificado: result.insertId
        });
      });
    });
  });
};

// Actualizar un certificado
const updateCertificado = (req, res) => {
  const { id } = req.params;
  const { id_usuario, id_curso, codigo_certificado, nombre_certificado, estado } = req.body;

  // Validar campos requeridos
  if (!id_usuario || !id_curso || !codigo_certificado) {
    return res.status(400).json({ error: 'ID de usuario, ID de curso y código de certificado son requeridos' });
  }

  // Verificar que el certificado existe
  const checkQuery = 'SELECT id_certificado FROM certificados WHERE id_certificado = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Error al verificar certificado:', err);
      return res.status(500).json({ error: 'Error al verificar certificado' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Certificado no encontrado' });
    }

    // Verificar que no exista otro certificado con la misma combinación usuario-curso
    const conflictQuery = 'SELECT id_certificado FROM certificados WHERE id_usuario = ? AND id_curso = ? AND id_certificado != ?';
    db.query(conflictQuery, [id_usuario, id_curso, id], (err, conflictResults) => {
      if (err) {
        console.error('Error al verificar conflictos:', err);
        return res.status(500).json({ error: 'Error al verificar conflictos' });
      }

      if (conflictResults.length > 0) {
        return res.status(409).json({ error: 'Ya existe otro certificado con esta combinación de usuario y curso' });
      }

      // Verificar que el código no esté duplicado en otros certificados
      const codeConflictQuery = 'SELECT id_certificado FROM certificados WHERE codigo_certificado = ? AND id_certificado != ?';
      db.query(codeConflictQuery, [codigo_certificado, id], (err, codeConflictResults) => {
        if (err) {
          console.error('Error al verificar código de certificado:', err);
          return res.status(500).json({ error: 'Error al verificar código de certificado' });
        }

        if (codeConflictResults.length > 0) {
          return res.status(409).json({ error: 'El código de certificado ya existe en otro certificado' });
        }

        // Actualizar el certificado
        const updateQuery = 'UPDATE certificados SET id_usuario = ?, id_curso = ?, codigo_certificado = ?, nombre_certificado = ?, estado = ? WHERE id_certificado = ?';
        db.query(updateQuery, [id_usuario, id_curso, codigo_certificado, nombre_certificado || null, estado, id], (err, result) => {
          if (err) {
            console.error('Error al actualizar certificado:', err);
            return res.status(500).json({ error: 'Error al actualizar certificado' });
          }
          res.json({ message: 'Certificado actualizado exitosamente' });
        });
      });
    });
  });
};

// Eliminar un certificado
const deleteCertificado = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM certificados WHERE id_certificado = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar certificado:', err);
      return res.status(500).json({ error: 'Error al eliminar certificado' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Certificado no encontrado' });
    }
    res.json({ message: 'Certificado eliminado exitosamente' });
  });
};

// Obtener certificados por usuario
const getCertificadosByUsuario = (req, res) => {
  const { id_usuario } = req.params;
  const query = `
    SELECT c.*,
           cu.titulo as curso_titulo, cu.descripcion as curso_descripcion
    FROM certificados c
    LEFT JOIN cursos cu ON c.id_curso = cu.id_curso
    WHERE c.id_usuario = ?
    ORDER BY c.fecha_emision DESC
  `;

  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener certificados del usuario:', err);
      return res.status(500).json({ error: 'Error al obtener certificados del usuario' });
    }
    res.json(results);
  });
};

// Obtener certificados por curso
const getCertificadosByCurso = (req, res) => {
  const { id_curso } = req.params;
  const query = `
    SELECT c.*,
           u.nombre_completo, u.email
    FROM certificados c
    LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_curso = ?
    ORDER BY c.fecha_emision DESC
  `;

  db.query(query, [id_curso], (err, results) => {
    if (err) {
      console.error('Error al obtener certificados del curso:', err);
      return res.status(500).json({ error: 'Error al obtener certificados del curso' });
    }
    res.json(results);
  });
};

// Obtener certificados por código
const getCertificadoByCodigo = (req, res) => {
  const { codigo } = req.params;
  const query = `
    SELECT c.*,
           u.nombre_completo, u.email,
           cu.titulo as curso_titulo, cu.descripcion as curso_descripcion
    FROM certificados c
    LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
    LEFT JOIN cursos cu ON c.id_curso = cu.id_curso
    WHERE c.codigo_certificado = ?
  `;

  db.query(query, [codigo], (err, results) => {
    if (err) {
      console.error('Error al obtener certificado por código:', err);
      return res.status(500).json({ error: 'Error al obtener certificado por código' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Certificado no encontrado' });
    }
    res.json(results[0]);
  });
};

module.exports = {
  getAllCertificados,
  getCertificadoById,
  createCertificado,
  updateCertificado,
  deleteCertificado,
  getCertificadosByUsuario,
  getCertificadosByCurso,
  getCertificadoByCodigo
};
