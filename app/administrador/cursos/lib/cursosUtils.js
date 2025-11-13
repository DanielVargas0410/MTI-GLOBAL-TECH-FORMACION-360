// Utilidades específicas para el módulo de cursos

/**
 * Formatea el precio de un curso
 * @param {number} precio - Precio del curso
 * @returns {string} Precio formateado
 */
export function formatPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(precio);
}

/**
 * Valida el código de acceso de un curso
 * @param {string} codigo - Código a validar
 * @returns {boolean} True si es válido
 */
export function validarCodigoAcceso(codigo) {
  // Ejemplo: debe tener al menos 5 caracteres, solo letras y números
  const regex = /^[A-Za-z0-9]{5,}$/;
  return regex.test(codigo);
}

/**
 * Obtiene el color del badge según el estado
 * @param {string} estado - Estado del curso
 * @returns {string} Clase CSS para el color
 */
export function getEstadoColor(estado) {
  const colores = {
    activo: 'estadoActivo',
    inactivo: 'estadoInactivo',
    borrador: 'estadoBorrador'
  };
  return colores[estado] || 'estadoBorrador';
}

/**
 * Filtra cursos por estado
 * @param {Array} cursos - Lista de cursos
 * @param {string} estado - Estado a filtrar
 * @returns {Array} Cursos filtrados
 */
export function filtrarCursosPorEstado(cursos, estado) {
  if (!estado) return cursos;
  return cursos.filter(curso => curso.estado === estado);
}

/**
 * Ordena cursos por título alfabéticamente
 * @param {Array} cursos - Lista de cursos
 * @returns {Array} Cursos ordenados
 */
export function ordenarCursosPorTitulo(cursos) {
  return [...cursos].sort((a, b) => a.titulo.localeCompare(b.titulo));
}
