'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronsUpDown, Search } from 'lucide-react'
import { formatNumeroOrden, validarModuloData } from '../modulos/lib/modulosUtils'

interface Modulo {
  id_modulo: number
  titulo: string
  descripcion: string
  id_curso: number
  numero_orden: number
  estado: 'activo' | 'inactivo'
  curso_titulo: string
}

interface Curso {
  id_curso: number
  titulo: string
  imagen_url: string
}

export default function ModuloManagement() {
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [filtroEstado, setFiltroEstado] = useState('all')
  const [filtroCurso, setFiltroCurso] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingModulo, setEditingModulo] = useState<Modulo | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    id_curso: '',
    numero_orden: '',
    estado: 'activo'
  })
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    fetchModulos()
    fetchCursos()
  }, [])

  const fetchModulos = async () => {
    try {
      const response = await fetch('http://localhost:3001/modulos')
      if (response.ok) {
        const data = await response.json()
        setModulos(data)
      }
    } catch (error) {
      console.error('Error fetching módulos:', error)
    }
  }

  const fetchCursos = async () => {
    try {
      const response = await fetch('http://localhost:3001/cursos')
      if (response.ok) {
        const data = await response.json()
        setCursos(data)
      }
    } catch (error) {
      console.error('Error fetching cursos:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validarModuloData({ ...formData, id_curso: parseInt(formData.id_curso), numero_orden: parseInt(formData.numero_orden) }) as { isValid: boolean; errors: string[] }
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    setErrors([])
    try {
      const url = editingModulo ? `http://localhost:3001/modulos/${editingModulo.id_modulo}` : 'http://localhost:3001/modulos'
      const method = editingModulo ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id_curso: parseInt(formData.id_curso), numero_orden: parseInt(formData.numero_orden) })
      })
      if (response.ok) {
        fetchModulos()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const errorData = await response.json()
        setErrors([errorData.error || 'Error al guardar el módulo'])
      }
    } catch (error) {
      console.error('Error saving módulo:', error)
      setErrors(['Error de conexión'])
    }
  }

  const handleEdit = (modulo: Modulo) => {
    setEditingModulo(modulo)
    setFormData({ titulo: modulo.titulo, descripcion: modulo.descripcion || '', id_curso: modulo.id_curso.toString(), numero_orden: modulo.numero_orden.toString(), estado: modulo.estado })
    setIsDialogOpen(true)
    setErrors([])
  }

  const handleDelete = async (id_modulo: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este módulo?')) {
      try {
        const response = await fetch(`http://localhost:3001/modulos/${id_modulo}`, { method: 'DELETE' })
        if (response.ok) fetchModulos()
      } catch (error) {
        console.error('Error deleting módulo:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ titulo: '', descripcion: '', id_curso: '', numero_orden: '', estado: 'activo' })
    setEditingModulo(null)
    setErrors([])
  }

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, string> = {
      activo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactivo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
    return <Badge className={variants[estado]}>{estado}</Badge>
  }

  const filteredModulos = modulos
    .filter(m => filtroEstado === 'all' || m.estado === filtroEstado)
    .filter(m => filtroCurso === 'all' || m.id_curso === parseInt(filtroCurso))
    .filter(m => m.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || m.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))

  const groupedByCourse = filteredModulos.reduce((acc, modulo) => {
    const courseTitle = modulo.curso_titulo
    if (!acc[courseTitle]) acc[courseTitle] = []
    acc[courseTitle].push(modulo)
    acc[courseTitle].sort((a, b) => a.numero_orden - b.numero_orden)
    return acc
  }, {} as Record<string, Modulo[]>)

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar módulos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-700"
              />
            </div>
            <Select value={filtroCurso} onValueChange={setFiltroCurso}>
              <SelectTrigger className="bg-white dark:bg-gray-700">
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="all">Todos los cursos</SelectItem>
                {cursos.map(c => <SelectItem key={c.id_curso} value={c.id_curso.toString()}>{c.titulo}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="bg-white dark:bg-gray-700">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>Agregar Módulo</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">{editingModulo ? 'Editar Módulo' : 'Agregar Nuevo Módulo'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.length > 0 && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <ul className="mt-2 list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Título</label>
                  <Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required className="bg-white dark:bg-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Descripción</label>
                  <Textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows={3} className="bg-white dark:bg-gray-700" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Curso</label>
                    <Select value={formData.id_curso} onValueChange={(value) => setFormData({...formData, id_curso: value})}>
                      <SelectTrigger className="bg-white dark:bg-gray-700">
                        <SelectValue placeholder="Seleccionar curso" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        {cursos.map((curso) => <SelectItem key={curso.id_curso} value={curso.id_curso.toString()}>{curso.titulo}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Número de Orden</label>
                    <Input type="number" min="1" value={formData.numero_orden} onChange={(e) => setFormData({...formData, numero_orden: e.target.value})} required className="bg-white dark:bg-gray-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Estado</label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                    <SelectTrigger className="bg-white dark:bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancelar</Button>
                  <Button type="submit">{editingModulo ? 'Actualizar' : 'Crear'}</Button>
                </div>
              </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(groupedByCourse).map(([courseTitle, modules]) => {
          const course = cursos.find(c => c.titulo === courseTitle)
          return (
            <Collapsible key={courseTitle} defaultOpen>
              <Card className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-4">
                      <img src={course?.imagen_url || '/placeholder.jpg'} alt={courseTitle} className="w-24 h-16 object-cover rounded-md" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{courseTitle}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{modules.length} módulos</p>
                      </div>
                    </div>
                    <ChevronsUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-700">
                          <TableHead className="w-16">Orden</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {modules.map(modulo => (
                          <TableRow key={modulo.id_modulo} className="dark:border-gray-700">
                            <TableCell className="font-medium text-gray-800 dark:text-gray-200">{formatNumeroOrden(modulo.numero_orden)}</TableCell>
                            <TableCell>
                              <div className="font-medium text-gray-800 dark:text-gray-200">{modulo.titulo}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{modulo.descripcion}</div>
                            </TableCell>
                            <TableCell>{getEstadoBadge(modulo.estado)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(modulo)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Editar</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(modulo.id_modulo)}>Eliminar</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )
        })}
      </div>
      {filteredModulos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">No se encontraron módulos.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Intenta ajustar los filtros de búsqueda.</p>
        </div>
      )}
    </div>
  )
}
