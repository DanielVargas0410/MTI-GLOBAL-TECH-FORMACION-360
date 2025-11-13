'use client'

import { useState, useEffect } from 'react'
import * as videosVistosUtils from '../../videosVistos/lib/videosVistosUtils'
import styles from '../../videosVistos/styles/videosVistos.module.css'

interface VideoVisto {
  id_visto: number
  id_usuario: number
  id_video: number
  fecha_primera_vista: string
  fecha_ultima_vista: string
  nombre_completo: string
  email: string
  video_titulo: string
  video_descripcion: string
  modulo_titulo: string
  curso_titulo: string
}

export default function VideoVistosManagement() {
  const [videosVistos, setVideosVistos] = useState<VideoVisto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterUsuario, setFilterUsuario] = useState('')
  const [filterVideo, setFilterVideo] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<VideoVisto | null>(null)

  const [formData, setFormData] = useState({
    id_usuario: '',
    id_video: ''
  })

  useEffect(() => {
    loadVideosVistos()
  }, [])

  const loadVideosVistos = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/videos-vistos')
      if (!response.ok) throw new Error('Error al cargar videos vistos')
      const data = await response.json()
      setVideosVistos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const filteredVideosVistos = videosVistos.filter(item => {
    const matchesSearch = item.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.video_titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUsuario = !filterUsuario || item.id_usuario.toString() === filterUsuario
    const matchesVideo = !filterVideo || item.id_video.toString() === filterVideo

    return matchesSearch && matchesUsuario && matchesVideo
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.id_usuario || !formData.id_video) {
      setError('Por favor complete todos los campos requeridos')
      return
    }

    try {
      const url = editingItem
        ? `http://localhost:3001/videos-vistos/${editingItem.id_visto}`
        : 'http://localhost:3001/videos-vistos'

      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Error al guardar')

      await loadVideosVistos()
      setShowForm(false)
      setEditingItem(null)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  const handleEdit = (item: VideoVisto) => {
    setEditingItem(item)
    setFormData({
      id_usuario: item.id_usuario.toString(),
      id_video: item.id_video.toString()
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return

    try {
      const response = await fetch(`http://localhost:3001/videos-vistos/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Error al eliminar')

      await loadVideosVistos()
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    }
  }

  const resetForm = () => {
    setFormData({
      id_usuario: '',
      id_video: ''
    })
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por usuario, email o video..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <input
            type="text"
            placeholder="Filtrar por ID usuario"
            value={filterUsuario}
            onChange={(e) => setFilterUsuario(e.target.value)}
            className={styles.searchInput}
          />
          <input
            type="text"
            placeholder="Filtrar por ID video"
            value={filterVideo}
            onChange={(e) => setFilterVideo(e.target.value)}
            className={styles.searchInput}
          />
        </div>
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

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError('')} className={styles.errorClose}>×</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.formTitle}>
            {editingItem ? 'Editar Registro' : 'Nuevo Registro'}
          </h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>ID Usuario *</label>
              <input
                type="number"
                value={formData.id_usuario}
                onChange={(e) => setFormData({...formData, id_usuario: e.target.value})}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>ID Video *</label>
              <input
                type="number"
                value={formData.id_video}
                onChange={(e) => setFormData({...formData, id_video: e.target.value})}
                className={styles.input}
                required
              />
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
        {filteredVideosVistos.map((item) => (
          <div key={item.id_visto} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                {item.nombre_completo}
              </h3>
              <span className={`${styles.badge} ${styles.badgeVisto}`}>
                Visto
              </span>
            </div>

            <div className={styles.cardContent}>
              <p className={styles.cardText}>
                <strong>Email:</strong> {item.email}
              </p>
              <p className={styles.cardText}>
                <strong>Video:</strong> {item.video_titulo}
              </p>
              <p className={styles.cardText}>
                <strong>Módulo:</strong> {item.modulo_titulo}
              </p>
              <p className={styles.cardText}>
                <strong>Curso:</strong> {item.curso_titulo}
              </p>
              <p className={styles.cardText}>
                <strong>Primera vista:</strong> {videosVistosUtils.formatFechaPrimeraVista(item.fecha_primera_vista)}
              </p>
              <p className={styles.cardText}>
                <strong>Última vista:</strong> {videosVistosUtils.formatFechaUltimaVista(item.fecha_ultima_vista)}
              </p>
            </div>

            <div className={styles.cardActions}>
              <button
                onClick={() => handleEdit(item)}
                className={styles.editButton}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item.id_visto)}
                className={styles.deleteButton}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVideosVistos.length === 0 && (
        <div className={styles.empty}>
          No se encontraron registros de videos vistos
        </div>
      )}
    </div>
  )
}
