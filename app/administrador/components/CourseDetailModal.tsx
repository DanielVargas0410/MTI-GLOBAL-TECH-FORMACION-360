'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, FileText, BookOpen } from 'lucide-react'

interface Video {
  id_video: number
  titulo: string
  descripcion: string | null
  video_url: string
  thumbnail_url: string | null
  numero_orden: number
  estado: string
}

interface Modulo {
  id_modulo: number
  titulo: string
  descripcion: string
  numero_orden: number
  estado: string
  videos: Video[]
}

interface Curso {
  id_curso: number
  titulo: string
  descripcion: string
  imagen_url: string | null
  precio: number
  estado: string
  modulos: Modulo[]
}

interface CourseDetailModalProps {
  isOpen: boolean
  onClose: () => void
  categoriaId: number
  categoriaNombre: string
}

export default function CourseDetailModal({ isOpen, onClose, categoriaId, categoriaNombre }: CourseDetailModalProps) {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && categoriaId) {
      fetchCursosByCategoria()
    }
  }, [isOpen, categoriaId])

  const fetchCursosByCategoria = async () => {
    setLoading(true)
    try {
      // First get all courses
      const cursosResponse = await fetch('http://localhost:3001/cursos')
      const allCursos = await cursosResponse.json()

      // Filter courses by categoria
      const cursosCategoria = allCursos.filter((curso: any) => curso.id_categoria === categoriaId)

      // For each course, get detailed info with modules and videos
      const cursosDetallados = await Promise.all(
        cursosCategoria.map(async (curso: any) => {
          const detailResponse = await fetch(`http://localhost:3001/cursos/${curso.id_curso}/detail`)
          return await detailResponse.json()
        })
      )

      setCursos(cursosDetallados)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactivo': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'borrador': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Cursos de la categoría: {categoriaNombre}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600 dark:text-gray-400">Cargando cursos...</div>
          </div>
        ) : cursos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No hay cursos en esta categoría.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cursos.map((curso) => (
              <Card key={curso.id_curso} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {curso.titulo}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{curso.descripcion}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getEstadoColor(curso.estado)}>
                        {curso.estado}
                      </Badge>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ${curso.precio}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {curso.modulos.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic">Este curso no tiene módulos aún.</p>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Módulos ({curso.modulos.length})
                      </h4>

                      {curso.modulos.map((modulo) => (
                        <Card key={modulo.id_modulo} className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-gray-900 dark:text-white">
                              Módulo {modulo.numero_orden}: {modulo.titulo}
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{modulo.descripcion}</p>
                            <Badge className={`${getEstadoColor(modulo.estado)} w-fit`}>
                              {modulo.estado}
                            </Badge>
                          </CardHeader>

                          <CardContent>
                            {modulo.videos.length === 0 ? (
                              <p className="text-gray-500 dark:text-gray-400 italic">Este módulo no tiene videos aún.</p>
                            ) : (
                              <div className="space-y-2">
                                <h5 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                  <Play className="w-4 h-4" />
                                  Videos ({modulo.videos.length})
                                </h5>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {modulo.videos.map((video) => (
                                    <Card key={video.id_video} className="bg-gray-50 dark:bg-gray-500 border border-gray-200 dark:border-gray-400">
                                      <CardContent className="p-3">
                                        <div className="flex items-start gap-3">
                                          <div className="w-16 h-12 bg-gray-300 dark:bg-gray-400 rounded flex items-center justify-center flex-shrink-0">
                                            <Play className="w-6 h-6 text-gray-600 dark:text-gray-200" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h6 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                              {video.titulo}
                                            </h6>
                                            {video.descripcion && (
                                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                                {video.descripcion}
                                              </p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                              <Badge className={`${getEstadoColor(video.estado)} text-xs`}>
                                                {video.estado}
                                              </Badge>
                                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Orden: {video.numero_orden}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onClose} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
