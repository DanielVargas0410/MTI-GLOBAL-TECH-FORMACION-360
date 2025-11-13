import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Play, Clock, Award, Activity, BarChart3, Eye, User } from 'lucide-react';

interface VideoStats {
  id_video: number
  video_titulo: string
  modulo_titulo: string
  curso_titulo: string
  total_vistas: number
  usuarios_unicos: number
}

interface UserStats {
  id_usuario: number
  nombre_completo: string
  email: string
  videos_vistos: number
  cursos_activos: number
  ultima_actividad: string
}

interface GeneralStats {
  total_usuarios_activos: number
  total_videos_vistos: number
  total_visualizaciones: number
  tiempo_promedio_sesion: number | null
}

const VideoStatsManagement = () => {
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null)
  const [topVideos, setTopVideos] = useState<VideoStats[]>([])
  const [topUsers, setTopUsers] = useState<UserStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/videos-vistos/stats')
      if (!response.ok) throw new Error('Error al cargar estadísticas')
      const data = await response.json()
      setGeneralStats(data.general)
      setTopVideos(data.topVideos)
      setTopUsers(data.topUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg shadow-md flex items-center gap-3">
          <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-bold">!</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Estadísticas Generales - Diseño Premium */}
      {generalStats && (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Estadísticas Generales</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Resumen de actividad de la plataforma</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Usuarios Activos */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {generalStats.total_usuarios_activos.toLocaleString()}
                </div>
                <div className="text-blue-100 text-sm font-medium">Usuarios Activos</div>
              </div>
            </div>

            {/* Videos Vistos */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {generalStats.total_videos_vistos.toLocaleString()}
                </div>
                <div className="text-green-100 text-sm font-medium">Videos Vistos</div>
              </div>
            </div>

            {/* Total Visualizaciones */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {generalStats.total_visualizaciones.toLocaleString()}
                </div>
                <div className="text-purple-100 text-sm font-medium">Total Visualizaciones</div>
              </div>
            </div>

            {/* Tiempo Promedio */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {generalStats.tiempo_promedio_sesion ? Math.round(generalStats.tiempo_promedio_sesion) : 0}
                </div>
                <div className="text-orange-100 text-sm font-medium">Minutos Promedio</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Videos Más Vistos */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Videos Más Vistos</h2>
              <p className="text-blue-100 text-sm">Top de contenido más popular</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs">#</span>
                    Video
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Módulo / Curso
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    Total Vistas
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    Usuarios Únicos
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-600">
              {topVideos.map((video, index) => (
                <tr key={video.id_video} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                        index === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                        index === 2 ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                        'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{video.video_titulo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{video.modulo_titulo}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">{video.curso_titulo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {video.total_vistas.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      {video.usuarios_unicos.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {topVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No hay datos de videos vistos</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Los datos aparecerán cuando los usuarios vean videos</p>
          </div>
        )}
      </div>

      {/* Usuarios Más Activos */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Usuarios Más Activos</h2>
              <p className="text-green-100 text-sm">Estudiantes con mayor compromiso</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    Usuario
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Videos Vistos
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Cursos Activos
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Última Actividad
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-600">
              {topUsers.map((user, index) => (
                <tr key={user.id_usuario} className="hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                        'bg-gradient-to-br from-green-100 to-green-200 text-green-700 dark:from-green-900 dark:to-green-800 dark:text-green-300'
                      }`}>
                        {user.nombre_completo.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.nombre_completo}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">ID: {user.id_usuario}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      <Play className="w-3 h-3" />
                      {user.videos_vistos}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {user.cursos_activos}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      {new Date(user.ultima_actividad).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {topUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No hay datos de usuarios activos</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Los datos aparecerán cuando los usuarios interactúen con la plataforma</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoStatsManagement;