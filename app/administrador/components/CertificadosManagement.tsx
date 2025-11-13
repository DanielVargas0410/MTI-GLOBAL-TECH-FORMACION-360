'use client'

import { useState, useEffect } from 'react'
import styles from '../certificados/styles/certificados.module.css'
import * as certificadosUtils from '../certificados/utils/certificadosUtils'

interface Certificado {
  id_certificado: number
  id_usuario: number
  id_curso: number
  codigo_certificado: string
  nombre_certificado?: string
  fecha_emision: string
  estado: string
  nombre_completo: string
  email: string
  curso_titulo: string
  curso_descripcion: string
}

interface User {
  id_usuario: number
  nombre_completo: string
  email: string
}

interface Curso {
  id_curso: number
  titulo: string
  descripcion: string
}

export default function CertificadosManagement() {
  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterUsuario, setFilterUsuario] = useState('')
  const [filterCurso, setFilterCurso] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Certificado | null>(null)
  const [codeGenerated, setCodeGenerated] = useState(false)

  const [formData, setFormData] = useState({
    id_usuario: '',
    id_curso: '',
    codigo_certificado: '',
    nombre_certificado: '',
    estado: 'activo'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [certsRes, usersRes, cursosRes] = await Promise.all([
        fetch('http://localhost:3001/certificados'),
        fetch('http://localhost:3001/users'),
        fetch('http://localhost:3001/cursos')
      ])

      if (certsRes.ok) setCertificados(await certsRes.json())
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        console.log('Usuarios cargados:', usersData)
        setUsers(usersData)
      }
      if (cursosRes.ok) {
        const cursosData = await cursosRes.json()
        console.log('Cursos cargados:', cursosData)
        setCursos(cursosData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const loadCertificados = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/certificados')
      if (!response.ok) throw new Error('Error al cargar certificados')
      const data = await response.json()
      setCertificados(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const filteredCertificados = certificados.filter(item => {
    const matchesSearch = item.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.curso_titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo_certificado?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = !filterEstado || item.estado === filterEstado
    const matchesUsuario = !filterUsuario || item.id_usuario.toString() === filterUsuario
    const matchesCurso = !filterCurso || item.id_curso.toString() === filterCurso

    return matchesSearch && matchesEstado && matchesUsuario && matchesCurso
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = certificadosUtils.validarCertificado(formData)
    if (!validation.esValido) {
      setError(validation.errores.join(', '))
      return
    }

    try {
      const url = editingItem
        ? `http://localhost:3001/certificados/${editingItem.id_certificado}`
        : 'http://localhost:3001/certificados'

      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Error al guardar certificado')

      await loadCertificados()
      setShowForm(false)
      setEditingItem(null)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  const handleEdit = (item: Certificado) => {
    setEditingItem(item)
    setFormData({
      id_usuario: item.id_usuario.toString(),
      id_curso: item.id_curso.toString(),
      codigo_certificado: item.codigo_certificado,
      nombre_certificado: item.nombre_certificado || '',
      estado: item.estado
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este certificado?')) return

    try {
      const response = await fetch(`http://localhost:3001/certificados/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Error al eliminar certificado')

      await loadCertificados()
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    }
  }

  const resetForm = () => {
    setFormData({
      id_usuario: '',
      id_curso: '',
      codigo_certificado: '',
      nombre_certificado: '',
      estado: 'activo'
    })
    setCodeGenerated(false)
  }

  const generateCode = () => {
    const code = certificadosUtils.generarCodigoCertificado()
    setFormData({...formData, codigo_certificado: code})
    setCodeGenerated(true)
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.header} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
        <div className={styles.filtersSection}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Buscar por usuario, curso, email o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${styles.searchInput} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
            />
          </div>
          <div className={styles.filtersRow}>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className={`${styles.filterSelect} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="revocado">Revocado</option>
            </select>
            <select
              value={filterUsuario}
              onChange={(e) => setFilterUsuario(e.target.value)}
              className={`${styles.filterSelect} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
            >
              <option value="">Todos los usuarios</option>
              {users.map(user => (
                <option key={user.id_usuario} value={user.id_usuario}>
                  {user.nombre_completo}
                </option>
              ))}
            </select>
            <select
              value={filterCurso}
              onChange={(e) => setFilterCurso(e.target.value)}
              className={`${styles.filterSelect} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
            >
              <option value="">Todos los cursos</option>
              {cursos.map(curso => (
                <option key={curso.id_curso} value={curso.id_curso}>
                  {curso.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.actionsSection}>
          <button
            onClick={() => {
              setShowForm(!showForm)
              if (!showForm) {
                setEditingItem(null)
                resetForm()
              }
            }}
            className={styles.addButton}
          >
            {showForm ? 'Cancelar' : 'Agregar Nuevo'}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError('')} className={styles.errorClose}>×</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.formTitle}>
            {editingItem ? 'Editar Certificado' : 'Nuevo Certificado'}
          </h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Usuario *</label>
              <select
                value={formData.id_usuario}
                onChange={(e) => setFormData({...formData, id_usuario: e.target.value})}
                className={styles.select}
                required
              >
                <option value="">Seleccionar usuario</option>
                {users.map(user => (
                  <option key={user.id_usuario} value={user.id_usuario}>
                    {user.nombre_completo} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Curso *</label>
              <select
                value={formData.id_curso}
                onChange={(e) => setFormData({...formData, id_curso: e.target.value})}
                className={styles.select}
                required
              >
                <option value="">Seleccionar curso</option>
                {cursos.map(curso => (
                  <option key={curso.id_curso} value={curso.id_curso}>
                    {curso.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre del Certificado *</label>
              <input
                type="text"
                value={formData.nombre_certificado}
                onChange={(e) => setFormData({...formData, nombre_certificado: e.target.value})}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Código del Certificado *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={formData.codigo_certificado}
                  onChange={(e) => setFormData({...formData, codigo_certificado: e.target.value})}
                  className={styles.input}
                  required
                  style={{ flex: 1 }}
                  disabled={codeGenerated}
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className={styles.submitButton}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                >
                  Generar
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                className={styles.select}
              >
                <option value="activo">Activo</option>
                <option value="revocado">Revocado</option>
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {editingItem ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingItem(null)
                resetForm()
              }}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.grid}>
        {filteredCertificados.map((item) => (
          <div key={item.id_certificado} className={`${styles.card} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
            <div className={`${styles.cardHeader} bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600`}>
              <h3 className={`${styles.cardTitle} text-gray-900 dark:text-white`}>
                {item.nombre_completo}
              </h3>
              <span className={`${styles.badge} ${item.estado === 'activo' ? styles.badgeActivo : styles.badgeRevocado}`}>
                {certificadosUtils.formatEstadoCertificado(item.estado)}
              </span>
            </div>

            <div className={styles.cardContent}>
              <p className={`${styles.cardText} text-gray-600 dark:text-gray-300`}>
                <strong className="text-gray-900 dark:text-gray-100">Email:</strong> {item.email}
              </p>
              <p className={`${styles.cardText} text-gray-600 dark:text-gray-300`}>
                <strong className="text-gray-900 dark:text-gray-100">Curso:</strong> {item.curso_titulo}
              </p>
              <p className={`${styles.cardText} text-gray-600 dark:text-gray-300`}>
                <strong className="text-gray-900 dark:text-gray-100">Código:</strong> {item.codigo_certificado}
              </p>
              <p className={`${styles.cardText} text-gray-600 dark:text-gray-300`}>
                <strong className="text-gray-900 dark:text-gray-100">Fecha de emisión:</strong> {certificadosUtils.formatFechaEmision(item.fecha_emision)}
              </p>
            </div>

            <div className={`${styles.cardActions} bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600`}>
              <button
                onClick={() => certificadosUtils.descargarCertificado(
                  item.nombre_completo,
                  item.curso_titulo,
                  item.codigo_certificado,
                  item.fecha_emision,
                  item.nombre_certificado
                )}
                className={`${styles.editButton} bg-blue-600 hover:bg-blue-700 text-white`}
              >
                Descargar
              </button>
              <button
                onClick={() => handleEdit(item)}
                className={`${styles.editButton} bg-gray-600 hover:bg-gray-700 text-white`}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item.id_certificado)}
                className={`${styles.deleteButton} bg-red-600 hover:bg-red-700 text-white`}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCertificados.length === 0 && (
        <div className={styles.empty}>
          No se encontraron certificados
        </div>
      )}
    </div>
  )
}
