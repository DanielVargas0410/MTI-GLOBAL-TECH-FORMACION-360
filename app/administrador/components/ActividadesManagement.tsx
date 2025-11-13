
'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import ActividadesCharts from './ActividadesCharts'
import * as actividadesUtils from '../actividades/lib/actividadesUtils'
import { MoreHorizontal, Trash2 } from 'lucide-react'

interface Actividad {
  id_actividad: number
  id_usuario: number
  tipo_actividad: string
  descripcion: string
  id_curso: number | null
  id_video: number | null
  user_agent: string | null
  fecha_actividad: string
  nombre_completo: string
  email: string
  curso_titulo: string | null
  video_titulo: string | null
}

export default function ActividadesManagement() {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('all')
  const [filterFechaDesde, setFilterFechaDesde] = useState('')
  const [filterFechaHasta, setFilterFechaHasta] = useState('')
  const [ordenPor, setOrdenPor] = useState('fecha_desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    loadActividades()
  }, [])

  const loadActividades = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/actividades')
      if (!response.ok) throw new Error('Error al cargar actividades')
      const data = await response.json()
      setActividades(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta actividad?')) return

    try {
      const response = await fetch(`http://localhost:3001/actividades/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Error al eliminar actividad')

      await loadActividades()
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    }
  }

  const filteredAndSortedActividades = useMemo(() => {
    const filtros = {
      searchTerm,
      tipoActividad: filterTipo,
      fechaDesde: filterFechaDesde,
      fechaHasta: filterFechaHasta,
      idUsuario: ''
    }
    const filtradas = actividadesUtils.filtrarActividades(actividades, filtros)
    return actividadesUtils.ordenarActividades(filtradas, ordenPor)
  }, [actividades, searchTerm, filterTipo, filterFechaDesde, filterFechaHasta, ordenPor])

  const totalPages = Math.ceil(filteredAndSortedActividades.length / itemsPerPage)
  const paginatedActividades = filteredAndSortedActividades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const estadisticas = useMemo(() => {
    return actividadesUtils.calcularEstadisticas(actividades)
  }, [actividades])

  if (loading) {
    return <div className="text-center py-8">Cargando actividades...</div>
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Registro de Actividades</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Actividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.usuariosActivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos de Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(estadisticas.porTipo).length}</div>
          </CardContent>
        </Card>
      </div>

      <ActividadesCharts actividades={actividades} />

      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Input
            placeholder="Buscar por usuario, email, descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de actividad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {Object.values(actividadesUtils.TIPOS_ACTIVIDAD).map(tipo => (
                <SelectItem key={tipo} value={tipo}>{actividadesUtils.formatTipoActividad(tipo)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={filterFechaDesde}
            onChange={(e) => setFilterFechaDesde(e.target.value)}
            className="w-[180px]"
          />
          <Input
            type="date"
            value={filterFechaHasta}
            onChange={(e) => setFilterFechaHasta(e.target.value)}
            className="w-[180px]"
          />
          <Select value={ordenPor} onValueChange={setOrdenPor}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fecha_desc">Más recientes primero</SelectItem>
              <SelectItem value="fecha_asc">Más antiguos primero</SelectItem>
              <SelectItem value="usuario_asc">Usuario A-Z</SelectItem>
              <SelectItem value="usuario_desc">Usuario Z-A</SelectItem>
              <SelectItem value="tipo_asc">Tipo A-Z</SelectItem>
              <SelectItem value="tipo_desc">Tipo Z-A</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-destructive">
            <p>{error}</p>
            <Button variant="destructive" size="sm" onClick={() => setError('')} className="mt-2">Cerrar</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Todas las Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedActividades.length > 0 ? (
                paginatedActividades.map((item) => (
                  <TableRow key={item.id_actividad}>
                    <TableCell>
                      <div className="font-medium">{item.nombre_completo}</div>
                      <div className="text-sm text-muted-foreground">{item.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{actividadesUtils.formatTipoActividad(item.tipo_actividad)}</Badge>
                    </TableCell>
                    <TableCell className="max-w-sm truncate">
                      {item.descripcion}
                      {item.curso_titulo && <div className="text-xs text-muted-foreground">Curso: {item.curso_titulo}</div>}
                      {item.video_titulo && <div className="text-xs text-muted-foreground">Video: {item.video_titulo}</div>}
                    </TableCell>
                    <TableCell>{actividadesUtils.formatFechaRelativa(item.fecha_actividad)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDelete(item.id_actividad)} className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No se encontraron actividades.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink href="#" onClick={() => handlePageChange(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
    </div>
  )
}
