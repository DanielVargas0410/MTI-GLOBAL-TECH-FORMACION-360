// Utilidades para gestión de módulos

/**
 * Filtra módulos por estado
 * @param {Array} modulos - Lista de módulos
 * @param {string} filtroEstado - Estado a filtrar ('activo', 'inactivo', '' para todos)
 * @returns {Array} Lista filtrada de módulos
 */
export function filtrarModulosPorEstado(modulos, filtroEstado) {
  if (!filtroEstado) return modulos;
  return modulos.filter(modulo => modulo.estado === filtroEstado);
}

/**
 * Ordena módulos por número de orden
 * @param {Array} modulos - Lista de módulos
 * @returns {Array} Lista ordenada de módulos
 */
export function ordenarModulosPorOrden(modulos) {
  return [...modulos].sort((a, b) => a.numero_orden - b.numero_orden);
}

/**
 * Obtiene el color correspondiente al estado del módulo
 * @param {string} estado - Estado del módulo
 * @returns {string} Clase CSS para el color
 */
export function getEstadoModuloColor(estado) {
  const colores = {
    activo: 'estado-activo',
    inactivo: 'estado-inactivo'
  };
  return colores[estado] || 'estado-activo';
}

/**
 * Formatea el número de orden del módulo
 * @param {number} numeroOrden - Número de orden
 * @returns {string} Número formateado
 */
export function formatNumeroOrden(numeroOrden) {
  return numeroOrden.toString().padStart(2, '0');
}

/**
 * Valida los datos de un módulo antes de enviar al servidor
 * @param {Object} moduloData - Datos del módulo
 * @returns {Object} Objeto con validación {isValid: boolean, errors: Array}
 */
export function validarModuloData(moduloData) {
  const errors = [];

  if (!moduloData.titulo?.trim()) {
    errors.push('El título es obligatorio');
  }

  if (!moduloData.id_curso) {
    errors.push('Debe seleccionar un curso');
  }

  if (!moduloData.numero_orden || moduloData.numero_orden < 1) {
    errors.push('El número de orden debe ser mayor a 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
