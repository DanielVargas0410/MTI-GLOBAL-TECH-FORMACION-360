import React from 'react'
import { X, User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Clock } from 'lucide-react'

interface Course {
  id_curso: number
  titulo: string
  descripcion: string
  fecha_inscripcion: string
  progreso: number
  estado: 'activo' | 'completado' | 'suspendido'
}

interface User {
  id_usuario: number
  nombre_completo: string
  email: string
  telefono?: string
  direccion?: string
  ciudad?: string
  pais?: string
  rol: 'administrador' | 'estudiante'
  estado: 'activo' | 'inactivo' | 'suspendido'
  fecha_registro: string
  fecha_ultimo_acceso?: string
}

interface UserDetailModalProps {
  isOpen: boolean
  user: User | null
  courses: Course[]
  onClose: () => void
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  user,
  courses,
  onClose,
}) => {
  if (!isOpen || !user) return null

  const getEstadoBadge = (estado: string) => {
    const configs = {
      activo: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: <Award className="w-3.5 h-3.5" />
      },
      inactivo: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        icon: <X className="w-3.5 h-3.5" />
      },
      suspendido: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800',
        icon: <Clock className="w-3.5 h-3.5" />
      }
    };

    const config = configs[estado as keyof typeof configs] || configs.activo;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        {config.icon}
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  const getCourseStatusBadge = (estado: string) => {
    const configs = {
      activo: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
      },
      completado: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800'
      },
      suspendido: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800'
      }
    };

    const config = configs[estado as keyof typeof configs] || configs.activo;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Detalles del Usuario
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Información completa de {user.nombre_completo}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Información Personal */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Información Personal
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre Completo</label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{user.nombre_completo}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Correo Electrónico</label>
                    <p className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono</label>
                    <p className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      {user.telefono || 'No especificado'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Dirección</label>
                    <p className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      {user.direccion ? `${user.direccion}, ${user.ciudad}, ${user.pais}` : 'No especificada'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Rol</label>
                    <p className="text-gray-900 dark:text-gray-100">{user.rol === 'administrador' ? 'Administrador' : 'Estudiante'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</label>
                    <div className="mt-1">
                      {getEstadoBadge(user.estado)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de Registro
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">{new Date(user.fecha_registro).toLocaleDateString('es-ES')}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Último Acceso
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {user.fecha_ultimo_acceso ? new Date(user.fecha_ultimo_acceso).toLocaleDateString('es-ES') : 'Nunca'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cursos Inscritos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Cursos Inscritos ({courses.length})
              </h4>

              {courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No hay cursos inscritos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id_curso} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{course.titulo}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{course.descripcion}</p>

                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Fecha de inscripción: {new Date(course.fecha_inscripcion).toLocaleDateString('es-ES')}</span>
                            <span>Progreso: {course.progreso}%</span>
                          </div>
                        </div>

                        <div className="ml-4">
                          {getCourseStatusBadge(course.estado)}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progreso del curso</span>
                          <span>{course.progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progreso}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailModal
