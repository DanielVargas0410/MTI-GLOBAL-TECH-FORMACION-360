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

interface Categoria {
  id_categoria: number
  nombre: string
  descripcion: string | null
  estado: string
  created_at: string
  updated_at: string
}

export default function CategoryManagement() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [filtroEstado, setFiltroEstado] = useState('activo')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Categorías</h2>
        <div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>Agregar Categoría</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">{editingCategoria ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-200">Nombre</label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-200">Descripción</label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-200">Estado</label>
              <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="activo" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Activo</SelectItem>
                  <SelectItem value="inactivo" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">{editingCategoria ? 'Actualizar' : 'Crear'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoriasFiltradas.map((categoria: Categoria) => {
          return (
            <Card key={categoria.id_categoria} className="transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">{categoria.nombre}</CardTitle>
                <Badge
                  className={`${
                    categoria.estado === 'activo'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {categoria.estado}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{categoria.descripcion}</p>
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(categoria)} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(categoria.id_categoria)} className="bg-red-600 hover:bg-red-700 text-white">Eliminar</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}