'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Search, PlusCircle, Edit, Trash2, Copy, Package } from 'lucide-react'
import { formatPrecio } from '../cursos/lib/cursosUtils'

interface Modulo {
  id_modulo: number
  titulo: string
  numero_orden: number
  estado: 'activo' | 'inactivo'
  id_curso: number
}

interface Curso {
  id_curso: number
  titulo: string
  descripcion: string
  imagen_url: string
  codigo_acceso: string
  id_categoria: number
  precio: number
  estado: 'borrador' | 'activo' | 'inactivo'
  categoria_nombre: string
}

interface Categoria {
  id_categoria: number
  nombre: string
}

export default function CourseManagement() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [filtroEstado, setFiltroEstado] = useState('all')
  const [filtroCategoria, setFiltroCategoria] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen_url: '',
    codigo_acceso: '',
    id_categoria: '',
    precio: '',
    estado: 'borrador'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCursos()
    fetchModulos()
    fetchCategorias()
  }, [])

  const fetchCursos = async () => {
    try {
      const response = await fetch('http://localhost:3001/cursos')
      if (response.ok) setCursos(await response.json())
    } catch (error) {
      console.error('Error fetching cursos:', error)
    }
  }

  const fetchModulos = async () => {
    try {
      const response = await fetch('http://localhost:3001/modulos')
      if (response.ok) setModulos(await response.json())
    } catch (error) {
      console.error('Error fetching modulos:', error)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3001/categorias')
      if (response.ok) setCategorias(await response.json())
    } catch (error) {
      console.error('Error fetching categorias:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.titulo.trim()) {
      alert('El título del curso es obligatorio.');
      return;
    }
    if (!formData.descripcion.trim()) {
      alert('La descripción del curso es obligatoria.');
      return;
    }
    if (!formData.codigo_acceso.trim()) {
      alert('El código de acceso es obligatorio.');
      return;
    }
    if (!formData.id_categoria) {
      alert('Debe seleccionar una categoría.');
      return;
    }
    if (!formData.precio || isNaN(Number(formData.precio)) || Number(formData.precio) < 0) {
      alert('El precio debe ser un número válido mayor o igual a 0.');
      return;
    }

    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('descripcion', formData.descripcion);
    data.append('codigo_acceso', formData.codigo_acceso);
    data.append('id_categoria', formData.id_categoria);
    data.append('precio', formData.precio);
    data.append('estado', formData.estado);
    if (selectedFile) {
      data.append('imagen', selectedFile);
    } else if (editingCurso) {
      data.append('imagen_url', formData.imagen_url);
    }

    try {
      const url = editingCurso ? `http://localhost:3001/cursos/${editingCurso.id_curso}` : 'http://localhost:3001/cursos';
      const method = editingCurso ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        body: data
      });
      if (response.ok) {
        fetchCursos();
        setIsDialogOpen(false);
        resetForm();
      } else {
        alert('Error al guardar el curso. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error saving curso:', error);
      alert('Error de conexión. Por favor, inténtelo de nuevo.');
    }
  }

  const handleEdit = (curso: Curso) => {
    setEditingCurso(curso)
    setFormData({ titulo: curso.titulo, descripcion: curso.descripcion || '', imagen_url: curso.imagen_url || '', codigo_acceso: curso.codigo_acceso, id_categoria: curso.id_categoria.toString(), precio: curso.precio.toString(), estado: curso.estado })
    setSelectedFile(null);
    setIsDialogOpen(true)
  }

  const handleDelete = async (id_curso: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este curso? Esto también eliminará todos sus módulos y videos asociados.')) {
      try {
        const response = await fetch(`http://localhost:3001/cursos/${id_curso}`, { method: 'DELETE' })
        if (response.ok) fetchCursos()
      } catch (error) {
        console.error('Error deleting curso:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ titulo: '', descripcion: '', imagen_url: '', codigo_acceso: '', id_categoria: '', precio: '', estado: 'borrador' })
    setEditingCurso(null)
    setSelectedFile(null);
  }

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, string> = {
      borrador: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      activo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactivo: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return <Badge className={variants[estado]}>{estado}</Badge>
  }

  const filteredCursos = cursos
    .filter(c => filtroEstado === 'all' || c.estado === filtroEstado)
    .filter(c => filtroCategoria === 'all' || c.id_categoria === parseInt(filtroCategoria))
    .filter(c => c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || c.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))

  const groupedByCategoria = filteredCursos.reduce((acc, curso) => {
    const catNombre = curso.categoria_nombre || 'Sin Categoría'
    if (!acc[catNombre]) acc[catNombre] = []
    acc[catNombre].push(curso)
    return acc
  }, {} as Record<string, Curso[]>)

  return (
    <div className="space-y-8">
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="flex gap-4">
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categorias.map(c => <SelectItem key={c.id_categoria} value={c.id_categoria.toString()}>{c.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Agregar Curso
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900 dark:text-white">{editingCurso ? 'Editar Curso' : 'Agregar Nuevo Curso'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Título del Curso</label>
                    <Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required className="bg-gray-50 dark:bg-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Código de Acceso</label>
                    <Input value={formData.codigo_acceso} onChange={(e) => setFormData({...formData, codigo_acceso: e.target.value})} required className="bg-gray-50 dark:bg-gray-700" placeholder="Ej: ABC123" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Descripción</label>
                <Textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={6}
                  className="bg-gray-50 dark:bg-gray-700 whitespace-pre-wrap"
                  placeholder="Describe el curso. Puedes usar espacios, bullet points (- item) o presionar Enter para nuevas líneas."
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Categoría</label>
                    <Select value={formData.id_categoria} onValueChange={(value) => setFormData({...formData, id_categoria: value})}>
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-700"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                            {categorias.map((cat) => <SelectItem key={cat.id_categoria} value={cat.id_categoria.toString()}>{cat.nombre}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Precio (COP)</label>
                    <Input type="number" step="0.01" value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} className="bg-gray-50 dark:bg-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Estado</label>
                    <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-700"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                            <SelectItem value="borrador">Borrador</SelectItem>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="inactivo">Inactivo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Imagen del Curso</label>
                <Input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="bg-gray-50 dark:bg-gray-700" />
                {editingCurso && formData.imagen_url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Imagen actual:</p>
                    <img src={formData.imagen_url} alt="Imagen actual" className="w-32 h-32 object-cover rounded-md" />
                  </div>
                )}
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancelar</Button>
                <Button type="submit">{editingCurso ? 'Actualizar Curso' : 'Crear Curso'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-12">
        {Object.entries(groupedByCategoria).map(([categoria, cursosEnCategoria]) => (
          <section key={categoria}>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b-2 border-indigo-500 pb-2">{categoria}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cursosEnCategoria.map(curso => {
                const cursoModulos = modulos.filter(m => m.id_curso === curso.id_curso)
                return (
                  <Card key={curso.id_curso} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden flex flex-col">
                    <CardHeader className="p-0 relative">
                      <img src={curso.imagen_url || '/placeholder.jpg'} alt={curso.titulo} className="w-full h-56 object-cover" />
                      <div className="absolute top-4 right-4 flex gap-2">
                          {getEstadoBadge(curso.estado)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white mt-2 mb-3">{curso.titulo}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-12 overflow-hidden whitespace-pre-wrap">{curso.descripcion}</p>

                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="link" className="p-0 h-auto flex items-center gap-2 font-semibold">
                                    <Package className="h-5 w-5" />
                                    {cursoModulos.length} Módulos
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Módulos del Curso</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                                        {cursoModulos.length > 0 ? cursoModulos.map(m => <li key={m.id_modulo}>{m.titulo}</li>) : <li>No hay módulos asignados.</li>}
                                    </ul>
                                </div>
                            </PopoverContent>
                          </Popover>
                          <span className="font-bold text-xl text-green-600 dark:text-green-400">{formatPrecio(curso.precio)}</span>
                      </div>
                    </CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 flex justify-end space-x-3">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(curso)} className="flex items-center gap-2 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"><Edit className="h-4 w-4"/> Editar</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(curso.id_curso)} className="flex items-center gap-2"><Trash2 className="h-4 w-4"/> Eliminar</Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {filteredCursos.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <p className="text-xl text-gray-500 dark:text-gray-400">No se encontraron cursos.</p>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2">Intenta ajustar los filtros de búsqueda.</p>
        </div>
      )}
    </div>
  )
}
