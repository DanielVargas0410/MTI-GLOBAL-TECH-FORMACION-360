'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CategoryTable from './components/CategoryTable'
import CategoryFormModal from './components/CategoryFormModal'

interface Categoria {
  id_categoria: number
  nombre: string
  descripcion: string | null
  estado: string
  created_at: string
  updated_at: string
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [addingCategoria, setAddingCategoria] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activo'
  })

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3001/categorias')
      if (response.ok) {
        const data = await response.json()
        setCategorias(data)
      } else {
        alert('Error al cargar categorías')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      estado: categoria.estado
    })
  }

  const handleAdd = () => {
    setAddingCategoria(true)
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'activo'
    })
  }

  const handleCloseModal = () => {
    setEditingCategoria(null)
    setAddingCategoria(false)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let response
      if (editingCategoria) {
        response = await fetch(`http://localhost:3001/categorias/${editingCategoria.id_categoria}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } else {
        response = await fetch('http://localhost:3001/categorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }

      if (response.ok) {
        alert(editingCategoria ? 'Categoría actualizada' : 'Categoría creada')
        handleCloseModal()
        fetchCategorias()
      } else {
        alert('Error al guardar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const response = await fetch(`http://localhost:3001/categorias/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Categoría eliminada')
        fetchCategorias()
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías - Formación 360</h1>
          <p className="mt-2 text-sm text-gray-600">Administrar categorías de cursos</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Categorías</h2>
            <div>
              <button
                onClick={handleAdd}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4"
              >
                Agregar Categoría
              </button>
              <Link href="/administrador" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Volver al Panel Admin
              </Link>
            </div>
          </div>

          <CategoryTable categorias={categorias} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </main>

      <CategoryFormModal
        isOpen={!!editingCategoria || addingCategoria}
        isEditing={!!editingCategoria}
        formData={formData}
        onClose={handleCloseModal}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}