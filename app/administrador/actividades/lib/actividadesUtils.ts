
interface Actividad {
  id_actividad: number
  id_usuario: number
  tipo_actividad: string
  descripcion: string
  id_curso: number | null
  id_video: number | null
  user_agent: string | null
  fecha_actividad: string
  nombre_completo: string
  email: string
  curso_titulo: string | null
  video_titulo: string | null
}

interface Filtros {
  searchTerm: string
  tipoActividad: string
  fechaDesde: string
  fechaHasta: string
  idUsuario: string
}

export const TIPOS_ACTIVIDAD = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CURSO_ACTIVADO: 'CURSO_ACTIVADO',
  VIDEO_VISTO: 'VIDEO_VISTO',
  CURSO_COMPLETADO: 'CURSO_COMPLETADO',
  CERTIFICADO_GENERADO: 'CERTIFICADO_GENERADO'
}

export const filtrarActividades = (actividades: Actividad[], filtros: Filtros): Actividad[] => {
  console.log('Filtering with:', filtros);
  return actividades.filter(actividad => {
    const searchTermMatch = !filtros.searchTerm ||
      actividad.nombre_completo.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
      actividad.email.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
      actividad.descripcion.toLowerCase().includes(filtros.searchTerm.toLowerCase())

    const tipoActividadMatch = !filtros.tipoActividad || filtros.tipoActividad === 'all' || actividad.tipo_actividad === filtros.tipoActividad
    const fechaDesdeMatch = !filtros.fechaDesde || new Date(actividad.fecha_actividad) >= new Date(filtros.fechaDesde)
    const fechaHastaMatch = !filtros.fechaHasta || new Date(actividad.fecha_actividad) <= new Date(filtros.fechaHasta)
    const idUsuarioMatch = !filtros.idUsuario || actividad.id_usuario === parseInt(filtros.idUsuario, 10)

    return searchTermMatch && tipoActividadMatch && fechaDesdeMatch && fechaHastaMatch && idUsuarioMatch
  })
}

export const ordenarActividades = (actividades: Actividad[], ordenPor: string): Actividad[] => {
  return [...actividades].sort((a, b) => {
    switch (ordenPor) {
      case 'fecha_asc':
        return new Date(a.fecha_actividad).getTime() - new Date(b.fecha_actividad).getTime()
      case 'fecha_desc':
        return new Date(b.fecha_actividad).getTime() - new Date(a.fecha_actividad).getTime()
      case 'usuario_asc':
        return a.nombre_completo.localeCompare(b.nombre_completo)
      case 'usuario_desc':
        return b.nombre_completo.localeCompare(a.nombre_completo)
      case 'tipo_asc':
        return a.tipo_actividad.localeCompare(b.tipo_actividad)
      case 'tipo_desc':
        return b.tipo_actividad.localeCompare(a.tipo_actividad)
      default:
        return 0
    }
  })
}

export const validarActividad = (formData: any) => {
  const errores: string[] = []
  if (!formData.id_usuario) {
    errores.push('El ID de usuario es obligatorio.')
  }
  if (!formData.tipo_actividad) {
    errores.push('El tipo de actividad es obligatorio.')
  }
  return {
    esValido: errores.length === 0,
    errores
  }
}

export const generarDescripcionAutomatica = (tipoActividad: string, usuario: { nombre_completo: string }): string => {
  switch (tipoActividad) {
    case TIPOS_ACTIVIDAD.LOGIN:
      return `El usuario ${usuario.nombre_completo} ha iniciado sesión.`
    case TIPOS_ACTIVIDAD.LOGOUT:
      return `El usuario ${usuario.nombre_completo} ha cerrado sesión.`
    case TIPOS_ACTIVIDAD.CURSO_ACTIVADO:
      return `El usuario ${usuario.nombre_completo} ha activado un curso.`
    case TIPOS_ACTIVIDAD.VIDEO_VISTO:
      return `El usuario ${usuario.nombre_completo} ha visto un video.`
    case TIPOS_ACTIVIDAD.CURSO_COMPLETADO:
      return `El usuario ${usuario.nombre_completo} ha completado un curso.`
    case TIPOS_ACTIVIDAD.CERTIFICADO_GENERADO:
      return `El usuario ${usuario.nombre_completo} ha generado un certificado.`
    default:
      return ''
  }
}

export const calcularEstadisticas = (actividades: Actividad[]) => {
  const total = actividades.length
  const usuariosActivos = new Set(actividades.map(a => a.id_usuario)).size
  const porTipo = actividades.reduce((acc, actividad) => {
    acc[actividad.tipo_actividad] = (acc[actividad.tipo_actividad] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return { total, usuariosActivos, porTipo }
}

export const formatTipoActividad = (tipo: string): string => {
  return tipo.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export const formatFechaRelativa = (fecha: string): string => {
  const now = new Date()
  const activityDate = new Date(fecha)
  const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000)

  if (diffInSeconds < 60) return `hace ${diffInSeconds} segundos`
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `hace ${diffInMinutes} minutos`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `hace ${diffInHours} horas`
  const diffInDays = Math.floor(diffInHours / 24)
  return `hace ${diffInDays} días`
}
