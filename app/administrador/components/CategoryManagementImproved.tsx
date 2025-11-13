'use client'

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { filtrarCategoriasPorEstado, ordenarCategoriasPorNombre } from '../categorias/lib/categoriasUtils'
import CourseDetailModal from './CourseDetailModal'
import { Eye, Edit, Trash2, Plus, Filter, Sparkles, Grid3x3, Package, Calendar, CheckCircle, XCircle } from 'lucide-react'

interface Categoria {
  id_categoria: number
  nombre: string
  descripcion: string | null
  estado: string
  created_at: string
  updated_at: string
}

export default function CategoryManagementImproved() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [filtroEstado, setFiltroEstado] = useState('activo')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState<{id: number, nombre: string} | null>(null)
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
        setCategorias(ordenarCategoriasPorNombre(data))
      }
    } catch (error) {
      console.error('Error fetching categorias:', error)
    }
  }

  const categoriasFiltradas = filtrarCategoriasPorEstado(categorias, filtroEstado)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCategoria
        ? `http://localhost:3001/categorias/${editingCategoria.id_categoria}`
        : 'http://localhost:3001/categorias'
      const method = editingCategoria ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchCategorias()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving categoria:', error)
    }
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      estado: categoria.estado
    })
    setIsDialogOpen(true)
  }

  const handleViewDetails = (categoria: Categoria) => {
    setSelectedCategoria({ id: categoria.id_categoria, nombre: categoria.nombre })
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id_categoria: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        const response = await fetch(`http://localhost:3001/categorias/${id_categoria}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchCategorias()
        }
      } catch (error) {
        console.error('Error deleting categoria:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'activo'
    })
    setEditingCategoria(null)
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Grid3x3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Gestión de Categorías
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
              <Package className="w-4 h-4" />
              {categoriasFiltradas.length} categorías {filtroEstado && `(${filtroEstado}s)`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <Button
            onClick={() => { resetForm(); setIsDialogOpen(true) }}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-500 dark:to-purple-600 dark:hover:from-purple-600 dark:hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Nueva Categoría
          </Button>
        </div>
      </div>

      {/* Modal de Formulario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
          <DialogHeader className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 -mx-6 -mt-6 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-white">
                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </DialogTitle>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                Nombre de la Categoría
              </label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                placeholder="Ej: Programación Web"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                Descripción
              </label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                placeholder="Descripción detallada de la categoría..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                Estado
              </label>
              <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                <SelectTrigger className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                  <SelectItem value="activo" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Activo</SelectItem>
                  <SelectItem value="inactivo" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-500 dark:to-purple-600 dark:hover:from-purple-600 dark:hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                {editingCategoria ? 'Actualizar' : 'Crear Categoría'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Grid de Categorías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoriasFiltradas.map((categoria: Categoria) => {
          return (
            <Card
              key={categoria.id_categoria}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden hover:-translate-y-1"
            >
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-700/20 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>

              <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 flex-1">
                    {categoria.nombre}
                  </CardTitle>
                  <Badge
                    className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm ${
                      categoria.estado === 'activo'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {categoria.estado === 'activo' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {categoria.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed min-h-[60px]">
                  {categoria.descripcion || 'Sin descripción disponible para esta categoría.'}
                </p>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Creada: {new Date(categoria.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleViewDetails(categoria)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-500 dark:to-purple-600 dark:hover:from-purple-600 dark:hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Cursos
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(categoria)}
                        className="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(categoria.id_categoria)}
                        className="flex-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {categoriasFiltradas.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay categorías disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comienza creando tu primera categoría para organizar tus cursos
          </p>
          <Button
            onClick={() => { resetForm(); setIsDialogOpen(true) }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-500 dark:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium mx-auto"
          >
            <Plus className="w-5 h-5" />
            Crear Primera Categoría
          </Button>
        </div>
      )}

      {selectedCategoria && (
        <CourseDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          categoriaId={selectedCategoria.id}
          categoriaNombre={selectedCategoria.nombre}
        />
      )}
    </div>
  )
}