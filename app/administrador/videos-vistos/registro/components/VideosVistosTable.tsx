import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, X } from 'lucide-react';

interface VideoVisto {
  id_video_visto: number;
  fecha_visualizacion: string;
  fecha_ultima_visualizacion: string;
  progreso_segundos: number;
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  telefono_usuario: string | null;
  ciudad_usuario: string | null;
  pais_usuario: string;
  rol_usuario: string;
  estado_usuario: string;
  fecha_registro_usuario: string;
  fecha_ultimo_acceso_usuario: string | null;
  id_video: number;
  titulo_video: string;
  descripcion_video: string | null;
  video_url: string;
  thumbnail_url: string | null;
  orden_video: number;
  estado_video: string;
  id_modulo: number;
  titulo_modulo: string;
  descripcion_modulo: string | null;
  orden_modulo: number;
  estado_modulo: string;
  id_curso: number;
  titulo_curso: string;
  descripcion_curso: string | null;
  imagen_curso: string | null;
  codigo_acceso: string;
  precio_curso: number;
  estado_curso: string;
  fecha_creacion_curso: string;
  fecha_publicacion_curso: string | null;
  estado_inscripcion_curso: string | null;
  fecha_activacion_curso: string | null;
  videos_vistos_curso: number | null;
  fecha_ultimo_acceso_curso: string | null;
}

interface VideosVistosTableProps {
  videosVistos: VideoVisto[];
}

const VideosVistosTable: React.FC<VideosVistosTableProps> = ({ videosVistos }) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurso, setFilterCurso] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatProgress = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      'activo': 'bg-green-100 text-green-800',
      'inactivo': 'bg-gray-100 text-gray-800',
      'publicado': 'bg-blue-100 text-blue-800',
      'borrador': 'bg-yellow-100 text-yellow-800',
    };
    return colors[estado.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const cursos = [...new Set(videosVistos.map(v => v.titulo_curso))];

  const filteredVideos = videosVistos.filter(video => {
    const matchesSearch =
      video.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.email_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.titulo_video.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.titulo_curso.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCurso = !filterCurso || video.titulo_curso === filterCurso;

    return matchesSearch && matchesCurso;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Filtros y búsqueda */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por usuario, email, video o curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <select
              value={filterCurso}
              onChange={(e) => setFilterCurso(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Todos los cursos</option>
              {cursos.map(curso => (
                <option key={curso} value={curso}>{curso}</option>
              ))}
            </select>
          </div>
          {(searchTerm || filterCurso) && (
            <button
              onClick={() => { setSearchTerm(''); setFilterCurso(''); }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Mostrando {filteredVideos.length} de {videosVistos.length} registros
        </div>
      </div>

      {/* Tabla compacta */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Usuario</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Video</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Curso</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Progreso</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Última Vista</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Detalles</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {filteredVideos.map((video) => (
              <React.Fragment key={video.id_video_visto}>
                <tr className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{video.nombre_usuario}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{video.email_usuario}</span>
                      {video.pais_usuario && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">📍 {video.pais_usuario}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{video.titulo_video}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Módulo: {video.titulo_modulo}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{video.titulo_curso}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full inline-block w-fit mt-1 ${getEstadoBadge(video.estado_curso)}`}>
                        {video.estado_curso}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (video.progreso_segundos / 600) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{formatProgress(video.progreso_segundos)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(video.fecha_ultima_visualizacion)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setExpandedRow(expandedRow === video.id_video_visto ? null : video.id_video_visto)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                      {expandedRow === video.id_video_visto ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>

                {expandedRow === video.id_video_visto && (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 bg-gradient-to-r from-gray-50 to-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Información del Usuario */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm border-b pb-2">👤 Datos del Usuario</h4>
                          <div className="space-y-2 text-xs">
                            <div><span className="text-gray-500">Teléfono:</span> <span className="text-gray-900">{video.telefono_usuario || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Ciudad:</span> <span className="text-gray-900">{video.ciudad_usuario || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Rol:</span> <span className={`px-2 py-0.5 rounded ${getEstadoBadge(video.rol_usuario)}`}>{video.rol_usuario}</span></div>
                            <div><span className="text-gray-500">Estado:</span> <span className={`px-2 py-0.5 rounded ${getEstadoBadge(video.estado_usuario)}`}>{video.estado_usuario}</span></div>
                            <div><span className="text-gray-500">Registro:</span> <span className="text-gray-900">{formatDate(video.fecha_registro_usuario)}</span></div>
                            <div><span className="text-gray-500">Último acceso:</span> <span className="text-gray-900">{video.fecha_ultimo_acceso_usuario ? formatDate(video.fecha_ultimo_acceso_usuario) : 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* Información del Video y Módulo */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm border-b pb-2">🎥 Video y Módulo</h4>
                          <div className="space-y-2 text-xs">
                            <div><span className="text-gray-500">Descripción:</span> <span className="text-gray-900">{video.descripcion_video || 'Sin descripción'}</span></div>
                            <div><span className="text-gray-500">Estado Video:</span> <span className={`px-2 py-0.5 rounded ${getEstadoBadge(video.estado_video)}`}>{video.estado_video}</span></div>
                            <div><span className="text-gray-500">Orden Video:</span> <span className="text-gray-900">#{video.orden_video}</span></div>
                            <div className="pt-2 border-t">
                              <div><span className="text-gray-500">Descripción Módulo:</span> <span className="text-gray-900">{video.descripcion_modulo || 'Sin descripción'}</span></div>
                              <div><span className="text-gray-500">Estado Módulo:</span> <span className={`px-2 py-0.5 rounded ${getEstadoBadge(video.estado_modulo)}`}>{video.estado_modulo}</span></div>
                              <div><span className="text-gray-500">Orden Módulo:</span> <span className="text-gray-900">#{video.orden_modulo}</span></div>
                            </div>
                          </div>
                        </div>

                        {/* Información del Curso */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm border-b pb-2">📚 Curso e Inscripción</h4>
                          <div className="space-y-2 text-xs">
                            <div><span className="text-gray-500">Descripción:</span> <span className="text-gray-900">{video.descripcion_curso || 'Sin descripción'}</span></div>
                            <div><span className="text-gray-500">Código acceso:</span> <span className="text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded">{video.codigo_acceso}</span></div>
                            <div><span className="text-gray-500">Precio:</span> <span className="text-gray-900 font-semibold">${video.precio_curso}</span></div>
                            <div><span className="text-gray-500">Fecha creación:</span> <span className="text-gray-900">{formatDate(video.fecha_creacion_curso)}</span></div>
                            <div className="pt-2 border-t">
                              <div><span className="text-gray-500">Estado inscripción:</span> <span className={`px-2 py-0.5 rounded ${getEstadoBadge(video.estado_inscripcion_curso || 'N/A')}`}>{video.estado_inscripcion_curso || 'N/A'}</span></div>
                              <div><span className="text-gray-500">Videos vistos:</span> <span className="text-gray-900 font-semibold">{video.videos_vistos_curso || 0}</span></div>
                              <div><span className="text-gray-500">Último acceso curso:</span> <span className="text-gray-900">{video.fecha_ultimo_acceso_curso ? formatDate(video.fecha_ultimo_acceso_curso) : 'N/A'}</span></div>
                            </div>
                          </div>
                        </div>

                        {/* Información de Visualización */}
                        <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2 lg:col-span-3">
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm border-b pb-2">⏱️ Historial de Visualización</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="text-gray-500">Primera visualización:</span>
                              <div className="text-gray-900 font-medium mt-1">{formatDate(video.fecha_visualizacion)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Última visualización:</span>
                              <div className="text-gray-900 font-medium mt-1">{formatDate(video.fecha_ultima_visualizacion)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Tiempo total visto:</span>
                              <div className="text-gray-900 font-medium mt-1">{formatProgress(video.progreso_segundos)} minutos</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No se encontraron registros con los filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default VideosVistosTable;