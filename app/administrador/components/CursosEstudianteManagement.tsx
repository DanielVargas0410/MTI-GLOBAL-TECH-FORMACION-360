'use client'

import { useState, useEffect } from 'react'
import styles from '../cursos_estudiantes/styles/cursosEstudiante.module.css'
import Swal from 'sweetalert2'

interface Usuario {
  id_usuario: number
  nombre_completo: string
  email: string
}

interface Modulo {
  id_modulo: number
  titulo: string
  descripcion: string
  numero_orden: number
  estado: string
}

interface Curso {
  id_curso: number
  titulo: string
  descripcion?: string
  codigo_acceso: string
  precio?: number
  estado?: string
  categoria_nombre?: string
  modulos?: Modulo[]
}

interface CursosEstudiante {
  id_curso_estudiante: number
  id_usuario: number
  id_curso: number
  codigo_activacion: string;
  fecha_activacion: string
  estado: 'pendiente' | 'activo' | 'completado' | 'pausado'
  videos_vistos: number
  fecha_ultimo_acceso: string | null
  comentario_curso: string | null
  created_at: string
  updated_at: string
  usuario?: {
    nombre_completo: string
    email: string
  }
  curso?: {
    titulo: string
    codigo_acceso: string
  }
}

import React from 'react'

export default function CursosEstudianteManagement(): React.ReactElement {
  const [cursosEstudiante, setCursosEstudiante] = useState<CursosEstudiante[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [editingItem, setEditingItem] = useState<CursosEstudiante | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        loadCursosEstudiante(),
        loadUsuarios(),
        loadCursos()
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const loadCursosEstudiante = async () => {
    const response = await fetch('http://localhost:3001/cursos-estudiante')
    if (!response.ok) throw new Error('Error al cargar cursos estudiante')
    const data = await response.json()
    setCursosEstudiante(data)
  }

  const loadUsuarios = async () => {
    const response = await fetch('http://localhost:3001/users')
    if (!response.ok) throw new Error('Error al cargar usuarios')
    const data = await response.json()
    setUsuarios(data)
  }

  const loadCursos = async () => {
    const response = await fetch('http://localhost:3001/cursos')
    if (!response.ok) throw new Error('Error al cargar cursos')
    const data = await response.json()
    setCursos(data)
  }

  const loadModulosByCurso = async (id_curso: number) => {
    try {
      const response = await fetch(`http://localhost:3001/modulos/curso/${id_curso}`)
      if (!response.ok) throw new Error('Error al cargar módulos del curso')
      const modulos = await response.json()
      return modulos
    } catch (error) {
      console.error('Error loading modules:', error)
      return []
    }
  }

  const filteredCursosEstudiante = cursosEstudiante
    .filter(item => !filterEstado || item.estado === filterEstado)
    .filter(item =>
      item.usuario?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.curso?.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const filteredUsuarios = usuarios.filter(user =>
    user.nombre_completo.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  )

  const handleAssignUser = async () => {
    if (!selectedCurso || !selectedUsuario) {
      setError('Por favor seleccione un curso y un usuario');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/cursos-estudiante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: selectedUsuario.id_usuario,
          id_curso: selectedCurso.id_curso,
          comentario_curso: ''
        })
      });

      const newAssignment = await response.json();

      if (!response.ok) {
        throw new Error(newAssignment.error || 'Error al asignar usuario al curso');
      }

      await loadCursosEstudiante(); // Reload the list
      setShowAssignForm(false);
      resetAssignForm();
      setError('');

      Swal.fire({
        title: '¡Éxito!',
        html: `
          Usuario asignado al curso exitosamente.<br/><br/>
          El código de activación es:
          <div style="background: #eee; padding: 10px; border-radius: 5px; margin-top: 10px; font-family: monospace; font-size: 1.2rem;">
            ${newAssignment.codigo_activacion}
          </div>
        `,
        icon: 'success'
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      Swal.fire('Error', 'Error al asignar usuario al curso: ' + (err instanceof Error ? err.message : 'Error desconocido'), 'error');
    }
  }

  const handleEdit = (item: CursosEstudiante) => {
    setEditingItem(item)
    // Find the corresponding curso and usuario
    const curso = cursos.find(c => c.id_curso === item.id_curso)
    const usuario = usuarios.find(u => u.id_usuario === item.id_usuario)
    setSelectedCurso(curso || null)
    setSelectedUsuario(usuario || null)
    setShowAssignForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return

    try {
      const response = await fetch(`http://localhost:3001/cursos-estudiante/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Error al eliminar')

      await loadCursosEstudiante()
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    }
  }

  const resetAssignForm = () => {
    setSelectedCurso(null)
    setSelectedUsuario(null)
    setUserSearchTerm('')
    setEditingItem(null)
  }

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'activo': return styles.badgeActive
      case 'completado': return styles.badgeCompleted
      case 'pausado': return styles.badgePaused
      case 'pendiente': return styles.badgePending
      default: return styles.badgeDefault
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
      <div className={`${styles.container} bg-gray-100 dark:bg-gray-900 min-h-screen`}>
      <div className={`${styles.header} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por usuario o curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${styles.searchInput} bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600`}
          />
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className={`${styles.filterSelect} bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600`}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="activo">Activo</option>
            <option value="completado">Completado</option>
            <option value="pausado">Pausado</option>
          </select>
        </div>
        <button
          onClick={() => {
            setShowAssignForm(!showAssignForm)
            if (!showAssignForm) {
              resetAssignForm()
            }
          }}
          className={`${styles.addButton} bg-green-600 hover:bg-green-700 text-white`}
        >
          {showAssignForm ? 'Cancelar' : 'Asignar Usuario a Curso'}
        </button>
      </div>

      {error && (
        <div className={`${styles.error} bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-700 dark:text-red-200`}>
          {error}
          <button onClick={() => setError('')} className={`${styles.errorClose} text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800`}>×</button>
        </div>
      )}

      {showAssignForm && (
        <div className={`${styles.form} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg`}>
          <h3 className={`${styles.formTitle} text-gray-900 dark:text-white`}>
            {editingItem ? 'Editar Asignación' : 'Asignar Usuario a Curso'}
          </h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={`${styles.label} text-gray-700 dark:text-gray-300`}>Seleccionar Curso *</label>
              <select
                value={selectedCurso?.id_curso || ''}
                onChange={async (e) => {
                  const cursoId = parseInt(e.target.value)
                  const curso = cursos.find(c => c.id_curso === cursoId) || null
                  if (curso) {
                    // Load modules for the selected course
                    const modulos = await loadModulosByCurso(cursoId)
                    setSelectedCurso({...curso, modulos})
                  } else {
                    setSelectedCurso(null)
                  }
                }}
                className={`${styles.select} bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600`}
                required
              >
                <option value="">Seleccione un curso</option>
                {cursos.map(curso => (
                  <option key={curso.id_curso} value={curso.id_curso}>
                    {curso.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.label} text-gray-700 dark:text-gray-300`}>Usuario *</label>
              {selectedUsuario ? (
            <div className={`${styles.selectedUserChip} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700`}>
              <span>{selectedUsuario.nombre_completo}</span>
              <button onClick={() => setSelectedUsuario(null)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Cambiar</button>
            </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className={`${styles.input} bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600`}
                  />
                  {userSearchTerm && (
                  <div className={`${styles.userSearchResults} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600`}>
                    {filteredUsuarios.length > 0 ? (
                      filteredUsuarios.map(user => (
                        <div
                          key={user.id_usuario}
                          className={`${styles.userSearchResultItem} hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white`}
                          onClick={() => {
                            setSelectedUsuario(user);
                            setUserSearchTerm('');
                          }}
                        >
                          {user.nombre_completo} - {user.email}
                        </div>
                      ))
                    ) : (
                      <div className={`${styles.userSearchNoResults} text-gray-500 dark:text-gray-400`}>No se encontraron usuarios.</div>
                    )}
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedCurso && (
            <div className={`${styles.courseInfo} bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600`}>
              <h4 className="text-gray-900 dark:text-white">Información del Curso Seleccionado:</h4>
              <div className={styles.courseDetails}>
                <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Título:</strong> {selectedCurso.titulo}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Código de Acceso:</strong> {selectedCurso.codigo_acceso}</p>
                {selectedCurso.descripcion && (
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Descripción:</strong> {selectedCurso.descripcion}</p>
                )}
                {selectedCurso.precio && (
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Precio:</strong> ${selectedCurso.precio.toLocaleString()}</p>
                )}
                {selectedCurso.categoria_nombre && (
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Categoría:</strong> {selectedCurso.categoria_nombre}</p>
                )}
                {selectedCurso.estado && (
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Estado:</strong> {selectedCurso.estado}</p>
                )}
              </div>

              {selectedCurso.modulos && selectedCurso.modulos.length > 0 && (
                <div className={styles.modulesSection}>
                  <h5 className="text-gray-900 dark:text-white">Módulos del Curso:</h5>
                  <div className={styles.modulesList}>
                    {selectedCurso.modulos
                      .sort((a, b) => a.numero_orden - b.numero_orden)
                      .map((modulo) => (
                        <div key={modulo.id_modulo} className={`${styles.moduleItem} bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500`}>
                          <div className={styles.moduleHeader}>
                            <span className={styles.moduleOrder}>{modulo.numero_orden}</span>
                            <h6 className={`${styles.moduleTitle} text-gray-900 dark:text-white`}>{modulo.titulo}</h6>
                            <span className={`${styles.moduleBadge} ${modulo.estado === 'activo' ? styles.badgeActive : styles.badgeInactive}`}>
                              {modulo.estado}
                            </span>
                          </div>
                          {modulo.descripcion && (
                            <p className={`${styles.moduleDescription} text-gray-700 dark:text-gray-300`}>{modulo.descripcion}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {selectedCurso.modulos && selectedCurso.modulos.length === 0 && (
                <p className={`${styles.noModules} text-gray-600 dark:text-gray-400`}>Este curso no tiene módulos asignados aún.</p>
              )}
            </div>
          )}

          <div className={styles.formActions}>
            <button
              onClick={() => {
                console.log('Botón Asignar presionado');
                console.log('Curso Seleccionado:', selectedCurso);
                console.log('Usuario Seleccionado:', selectedUsuario);
                handleAssignUser();
              }}
              className={`${styles.submitButton} bg-blue-600 hover:bg-blue-700 text-white`}
              disabled={!selectedCurso || !selectedUsuario}
            >
              {editingItem ? 'Actualizar' : 'Asignar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAssignForm(false)
                resetAssignForm()
              }}
              className={`${styles.cancelButton} bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500`}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {filteredCursosEstudiante.map((item) => (
          <div key={item.id_curso_estudiante} className={`${styles.card} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
            <div className={`${styles.cardHeader} bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600`}>
              <h3 className={`${styles.cardTitle} text-gray-900 dark:text-white`}>
                {item.usuario?.nombre_completo || `Usuario ${item.id_usuario}`}
              </h3>
              <span className={`${styles.badge} ${getEstadoBadgeClass(item.estado)}`}>
                {item.estado}
              </span>
            </div>

            <div className={styles.cardContent}>
              <p className={`${styles.cardText} text-gray-700 dark:text-gray-300`}>
                <strong className="text-gray-900 dark:text-white">Curso:</strong> {item.curso?.titulo || `Curso ${item.id_curso}`}
              </p>
              <p className={`${styles.cardText} text-gray-700 dark:text-gray-300`}>
                <strong className="text-gray-900 dark:text-white">Código de Activación:</strong> {item.codigo_activacion}
                <button onClick={() => navigator.clipboard.writeText(item.codigo_activacion)} className={`${styles.copyButton} bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500`}>Copiar</button>
              </p>
              <p className={`${styles.cardText} text-gray-700 dark:text-gray-300`}>
                <strong className="text-gray-900 dark:text-white">Videos vistos:</strong> {item.videos_vistos}
              </p>
              {item.fecha_activacion && (
                <p className={`${styles.cardText} text-gray-700 dark:text-gray-300`}>
                  <strong className="text-gray-900 dark:text-white">Activación:</strong> {new Date(item.fecha_activacion).toLocaleDateString()}
                </p>
              )}
              {item.fecha_ultimo_acceso && (
                <p className={`${styles.cardText} text-gray-700 dark:text-gray-300`}>
                  <strong className="text-gray-900 dark:text-white">Último acceso:</strong> {new Date(item.fecha_ultimo_acceso).toLocaleDateString()}
                </p>
              )}
              {item.comentario_curso && (
                <p className={`${styles.cardText} text-gray-700 dark:text-gray-300`}>
                  <strong className="text-gray-900 dark:text-white">Comentario:</strong> {item.comentario_curso}
                </p>
              )}
            </div>

            <div className={`${styles.cardActions} bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600`}>
              <button
                onClick={() => handleEdit(item)}
                className={`${styles.editButton} bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500`}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item.id_curso_estudiante)}
                className={styles.deleteButton}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCursosEstudiante.length === 0 && (
        <div className={`${styles.empty} text-gray-600 dark:text-gray-400`}>
          No se encontraron registros de cursos estudiante
        </div>
      )}
    </div>
  )
}
