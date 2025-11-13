// Utilidades para gestionar actividades de auditoría

// Tipos de actividad disponibles
export const TIPOS_ACTIVIDAD = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CURSO_ACTIVADO: 'curso_activado',
  VIDEO_VISTO: 'video_visto',
  CURSO_COMPLETADO: 'curso_completado',
  CERTIFICADO_GENERADO: 'certificado_generado'
};

// Formatear tipo de actividad para mostrar
export const formatTipoActividad = (tipo) => {
  const formatos = {
    [TIPOS_ACTIVIDAD.LOGIN]: 'Inicio de Sesión',
    [TIPOS_ACTIVIDAD.LOGOUT]: 'Cierre de Sesión',
    [TIPOS_ACTIVIDAD.CURSO_ACTIVADO]: 'Curso Activado',
    [TIPOS_ACTIVIDAD.VIDEO_VISTO]: 'Video Visto',
    [TIPOS_ACTIVIDAD.CURSO_COMPLETADO]: 'Curso Completado',
    [TIPOS_ACTIVIDAD.CERTIFICADO_GENERADO]: 'Certificado Generado'
  };
  return formatos[tipo] || tipo;
};

// Formatear fecha de actividad
export const formatFechaActividad = (fecha) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Formatear fecha relativa
export const formatFechaRelativa = (fecha) => {
  if (!fecha) return 'N/A';
  const ahora = new Date();
  const fechaActividad = new Date(fecha);
  const diferencia = ahora - fechaActividad;

  const minutos = Math.floor(diferencia / (1000 * 60));
  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

  if (minutos < 1) return 'Ahora mismo';
  if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
  if (dias < 7) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;

  return formatFechaActividad(fecha);
};

// Filtrar actividades por criterios
export const filtrarActividades = (actividades, filtros) => {
  return actividades.filter(actividad => {
    const { searchTerm, tipoActividad, fechaDesde, fechaHasta, idUsuario } = filtros;

    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        actividad.nombre_completo?.toLowerCase().includes(term) ||
        actividad.email?.toLowerCase().includes(term) ||
        actividad.descripcion?.toLowerCase().includes(term) ||
        actividad.curso_titulo?.toLowerCase().includes(term) ||
        actividad.video_titulo?.toLowerCase().includes(term);

      if (!matchesSearch) return false;
    }

    // Filtro por tipo de actividad
    if (tipoActividad && actividad.tipo_actividad !== tipoActividad) {
      return false;
    }

    // Filtro por ID de usuario
    if (idUsuario && actividad.id_usuario !== parseInt(idUsuario)) {
      return false;
    }

    // Filtro por rango de fechas
    if (fechaDesde || fechaHasta) {
      const fechaActividad = new Date(actividad.fecha_actividad);

      if (fechaDesde) {
        const desde = new Date(fechaDesde);
        if (fechaActividad < desde) return false;
      }

      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        hasta.setHours(23, 59, 59, 999); // Fin del día
        if (fechaActividad > hasta) return false;
      }
    }

    return true;
  });
};

// Ordenar actividades
export const ordenarActividades = (actividades, ordenPor = 'fecha_desc') => {
  return [...actividades].sort((a, b) => {
    switch (ordenPor) {
      case 'fecha_desc':
        return new Date(b.fecha_actividad) - new Date(a.fecha_actividad);
      case 'fecha_asc':
        return new Date(a.fecha_actividad) - new Date(b.fecha_actividad);
      case 'usuario_asc':
        return (a.nombre_completo || '').localeCompare(b.nombre_completo || '');
      case 'usuario_desc':
        return (b.nombre_completo || '').localeCompare(a.nombre_completo || '');
      case 'tipo_asc':
        return formatTipoActividad(a.tipo_actividad).localeCompare(formatTipoActividad(b.tipo_actividad));
      case 'tipo_desc':
        return formatTipoActividad(b.tipo_actividad).localeCompare(formatTipoActividad(a.tipo_actividad));
      default:
        return 0;
    }
  });
};

// Validar datos de actividad
export const validarActividad = (datos) => {
  const errores = [];

  if (!datos.id_usuario) {
    errores.push('El ID de usuario es requerido');
  }

  if (!datos.tipo_actividad) {
    errores.push('El tipo de actividad es requerido');
  } else if (!Object.values(TIPOS_ACTIVIDAD).includes(datos.tipo_actividad)) {
    errores.push('El tipo de actividad no es válido');
  }

  if (datos.descripcion && datos.descripcion.length > 500) {
    errores.push('La descripción no puede exceder 500 caracteres');
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};

// Generar descripción automática basada en el tipo de actividad
export const generarDescripcionAutomatica = (tipo, datosAdicionales = {}) => {
  const { curso_titulo, video_titulo, nombre_completo } = datosAdicionales;

  switch (tipo) {
    case TIPOS_ACTIVIDAD.LOGIN:
      return `El usuario ${nombre_completo || 'desconocido'} inició sesión en el sistema`;
    case TIPOS_ACTIVIDAD.LOGOUT:
      return `El usuario ${nombre_completo || 'desconocido'} cerró sesión en el sistema`;
    case TIPOS_ACTIVIDAD.CURSO_ACTIVADO:
      return `El usuario ${nombre_completo || 'desconocido'} activó el curso "${curso_titulo || 'desconocido'}"`;
    case TIPOS_ACTIVIDAD.VIDEO_VISTO:
      return `El usuario ${nombre_completo || 'desconocido'} vio el video "${video_titulo || 'desconocido'}" del curso "${curso_titulo || 'desconocido'}"`;
    case TIPOS_ACTIVIDAD.CURSO_COMPLETADO:
      return `El usuario ${nombre_completo || 'desconocido'} completó el curso "${curso_titulo || 'desconocido'}"`;
    case TIPOS_ACTIVIDAD.CERTIFICADO_GENERADO:
      return `Se generó un certificado para el usuario ${nombre_completo || 'desconocido'} por completar el curso "${curso_titulo || 'desconocido'}"`;
    default:
      return `Actividad registrada: ${tipo}`;
  }
};

// Obtener estadísticas de actividades
export const calcularEstadisticas = (actividades) => {
  const estadisticas = {
    total: actividades.length,
    porTipo: {},
    porDia: {},
    usuariosActivos: new Set(),
    cursosPopulares: {},
    videosPopulares: {}
  };

  actividades.forEach(actividad => {
    // Conteo por tipo
    estadisticas.porTipo[actividad.tipo_actividad] =
      (estadisticas.porTipo[actividad.tipo_actividad] || 0) + 1;

    // Usuarios activos
    estadisticas.usuariosActivos.add(actividad.id_usuario);

    // Actividades por día
    const fecha = new Date(actividad.fecha_actividad).toDateString();
    estadisticas.porDia[fecha] = (estadisticas.porDia[fecha] || 0) + 1;

    // Cursos populares (para actividades relacionadas con cursos)
    if (actividad.id_curso) {
      estadisticas.cursosPopulares[actividad.curso_titulo] =
        (estadisticas.cursosPopulares[actividad.curso_titulo] || 0) + 1;
    }

    // Videos populares (para actividades de video visto)
    if (actividad.id_video && actividad.tipo_actividad === TIPOS_ACTIVIDAD.VIDEO_VISTO) {
      estadisticas.videosPopulares[actividad.video_titulo] =
        (estadisticas.videosPopulares[actividad.video_titulo] || 0) + 1;
    }
  });

  estadisticas.usuariosActivos = estadisticas.usuariosActivos.size;

  return estadisticas;
};

// Exportar funciones
export default {
  TIPOS_ACTIVIDAD,
  formatTipoActividad,
  formatFechaActividad,
  formatFechaRelativa,
  filtrarActividades,
  ordenarActividades,
  validarActividad,
  generarDescripcionAutomatica,
  calcularEstadisticas
};
