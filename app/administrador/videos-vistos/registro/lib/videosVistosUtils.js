// Utilidades específicas para el módulo de videos_vistos

/**
 * Obtiene el color del badge según el estado del video visto
 * @param {string} estado - Estado del video visto
 * @returns {string} Clase CSS para el color
 */
export function getEstadoColor(estado) {
  const colores = {
    visto: 'estadoVisto',
    'no visto': 'estadoNoVisto'
  };
  return colores[estado] || 'estadoVisto';
}

/**
 * Filtra videos_vistos por usuario
 * @param {Array} videosVistos - Lista de videos_vistos
 * @param {string} id_usuario - ID del usuario a filtrar
 * @returns {Array} Videos vistos filtrados
 */
export function filtrarVideosVistosPorUsuario(videosVistos, id_usuario) {
  if (!id_usuario) return videosVistos;
  return videosVistos.filter(vv => vv.id_usuario.toString() === id_usuario);
}

/**
 * Filtra videos_vistos por video
 * @param {Array} videosVistos - Lista de videos_vistos
 * @param {string} id_video - ID del video a filtrar
 * @returns {Array} Videos vistos filtrados
 */
export function filtrarVideosVistosPorVideo(videosVistos, id_video) {
  if (!id_video) return videosVistos;
  return videosVistos.filter(vv => vv.id_video.toString() === id_video);
}

/**
 * Filtra videos_vistos por módulo
 * @param {Array} videosVistos - Lista de videos_vistos
 * @param {string} id_modulo - ID del módulo a filtrar
 * @returns {Array} Videos vistos filtrados
 */
export function filtrarVideosVistosPorModulo(videosVistos, id_modulo) {
  if (!id_modulo) return videosVistos;
  return videosVistos.filter(vv => vv.id_modulo && vv.id_modulo.toString() === id_modulo);
}

/**
 * Filtra videos_vistos por curso
 * @param {Array} videosVistos - Lista de videos_vistos
 * @param {string} id_curso - ID del curso a filtrar
 * @returns {Array} Videos vistos filtrados
 */
export function filtrarVideosVistosPorCurso(videosVistos, id_curso) {
  if (!id_curso) return videosVistos;
  return videosVistos.filter(vv => vv.id_curso && vv.id_curso.toString() === id_curso);
}

/**
 * Ordena videos_vistos por fecha de primera vista (más reciente primero)
 * @param {Array} videosVistos - Lista de videos_vistos
 * @returns {Array} Videos vistos ordenados
 */
export function ordenarVideosVistosPorPrimeraVista(videosVistos) {
  return [...videosVistos].sort((a, b) => new Date(b.fecha_primera_vista) - new Date(a.fecha_primera_vista));
}

/**
 * Ordena videos_vistos por fecha de última vista
 * @param {Array} videosVistos - Lista de videos_vistos
 * @returns {Array} Videos vistos ordenados
 */
export function ordenarVideosVistosPorUltimaVista(videosVistos) {
  return [...videosVistos].sort((a, b) => new Date(b.fecha_ultima_vista) - new Date(a.fecha_ultima_vista));
}

/**
 * Calcula estadísticas de progreso de un usuario en un curso
 * @param {Array} videosVistos - Lista de videos_vistos del usuario
 * @param {number} totalVideosCurso - Total de videos en el curso
 * @returns {Object} Estadísticas de progreso
 */
export function calcularProgresoUsuarioEnCurso(videosVistos, totalVideosCurso) {
  const videosVistosEnCurso = videosVistos.length;
  const porcentajeCompletado = totalVideosCurso > 0 ? Math.round((videosVistosEnCurso / totalVideosCurso) * 100) : 0;

  return {
    videosVistos: videosVistosEnCurso,
    totalVideos: totalVideosCurso,
    porcentajeCompletado,
    completado: porcentajeCompletado === 100
  };
}

/**
 * Formatea la fecha de primera vista
 * @param {string} fechaPrimeraVista - Fecha de primera vista
 * @returns {string} Fecha formateada
 */
export function formatFechaPrimeraVista(fechaPrimeraVista) {
  return new Date(fechaPrimeraVista).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatea la fecha de última vista
 * @param {string} fechaUltimaVista - Fecha de última vista
 * @returns {string} Fecha formateada
 */
export function formatFechaUltimaVista(fechaUltimaVista) {
  return new Date(fechaUltimaVista).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Agrupa videos_vistos por usuario
 * @param {Array} videosVistos - Lista de videos_vistos
 * @returns {Object} Videos vistos agrupados por usuario
 */
export function agruparVideosVistosPorUsuario(videosVistos) {
  return videosVistos.reduce((grupos, vv) => {
    const usuarioId = vv.id_usuario;
    if (!grupos[usuarioId]) {
      grupos[usuarioId] = {
        usuario: {
          id_usuario: vv.id_usuario,
          nombre_completo: vv.nombre_completo,
          email: vv.email
        },
        videosVistos: []
      };
    }
    grupos[usuarioId].videosVistos.push(vv);
    return grupos;
  }, {});
}

/**
 * Agrupa videos_vistos por video
 * @param {Array} videosVistos - Lista de videos_vistos
 * @returns {Object} Videos vistos agrupados por video
 */
export function agruparVideosVistosPorVideo(videosVistos) {
  return videosVistos.reduce((grupos, vv) => {
    const videoId = vv.id_video;
    if (!grupos[videoId]) {
      grupos[videoId] = {
        video: {
          id_video: vv.id_video,
          titulo: vv.video_titulo,
          descripcion: vv.video_descripcion
        },
        usuariosQueLoVieron: []
      };
    }
    grupos[videoId].usuariosQueLoVieron.push({
      id_usuario: vv.id_usuario,
      nombre_completo: vv.nombre_completo,
      email: vv.email,
      fecha_primera_vista: vv.fecha_primera_vista,
      fecha_ultima_vista: vv.fecha_ultima_vista
    });
    return grupos;
  }, {});
}
