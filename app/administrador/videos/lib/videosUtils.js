// Utilidades específicas para el módulo de videos

/**
 * Obtiene el color del badge según el estado del video
 * @param {string} estado - Estado del video
 * @returns {string} Clase CSS para el color
 */
export function getEstadoColor(estado) {
  const colores = {
    activo: 'estadoActivo',
    inactivo: 'estadoInactivo',
    procesando: 'estadoProcesando'
  };
  return colores[estado] || 'estadoInactivo';
}

/**
 * Filtra videos por estado
 * @param {Array} videos - Lista de videos
 * @param {string} estado - Estado a filtrar
 * @returns {Array} Videos filtrados
 */
export function filtrarVideosPorEstado(videos, estado) {
  if (!estado || estado === 'all') return videos;
  return videos.filter(video => video.estado === estado);
}

/**
 * Filtra videos por módulo
 * @param {Array} videos - Lista de videos
 * @param {string} id_modulo - ID del módulo a filtrar
 * @returns {Array} Videos filtrados
 */
export function filtrarVideosPorModulo(videos, id_modulo) {
  if (!id_modulo || id_modulo === 'all') return videos;
  return videos.filter(video => video.id_modulo.toString() === id_modulo);
}

/**
 * Ordena videos por título alfabéticamente
 * @param {Array} videos - Lista de videos
 * @returns {Array} Videos ordenados
 */
export function ordenarVideosPorTitulo(videos) {
  return [...videos].sort((a, b) => a.titulo.localeCompare(b.titulo));
}

/**
 * Ordena videos por número de orden
 * @param {Array} videos - Lista de videos
 * @returns {Array} Videos ordenados
 */
export function ordenarVideosPorOrden(videos) {
  if (!Array.isArray(videos)) return [];
  return [...videos].sort((a, b) => a.numero_orden - b.numero_orden);
}