'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { getEstadoColor, filtrarVideosPorEstado, filtrarVideosPorModulo } from '../videos/lib/videosUtils'
import styles from '../videos/styles/videos.module.css'
import Image from 'next/image'
import { Expand, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Interfaces
interface Video {
  id_video: number
  titulo: string
  descripcion: string | null
  video_url: string
  thumbnail_url: string | null
  id_modulo: number
  numero_orden: number
  estado: string
  created_at: string
  updated_at: string
  modulo_titulo: string
  id_curso: number | null
  curso_titulo: string | null
}

interface Modulo {
  id_modulo: number
  titulo: string
}

interface Curso {
  id_curso: number
  titulo: string
}

type VideoSourceType = 'url' | 'upload'

// Helper Functions
const getYoutubeEmbedUrl = (url: string): string | null => {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`
    }
    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname === '/watch') {
        return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`
      }
      if (urlObj.pathname.startsWith('/embed/')) {
        return url
      }
    }
  } catch (e) {
    return null
  }
  return null
}

const filtrarVideosPorCurso = (videos: Video[], idCurso: string) => {
  if (!idCurso || idCurso === 'all') return videos
  return videos.filter(video => video.id_curso === parseInt(idCurso, 10))
}

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function VideoManagement() {
  const { toast } = useToast()

  // State
  const [videos, setVideos] = useState<Video[]>([])
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [filtroModulo, setFiltroModulo] = useState('all')
  const [filtroEstado, setFiltroEstado] = useState('all')
  const [filtroCurso, setFiltroCurso] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [videoSourceType, setVideoSourceType] = useState<VideoSourceType>('url')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null)
  const [zoomedThumbnailUrl, setZoomedThumbnailUrl] = useState<string | null>(null)
  const [zoomedVideo, setZoomedVideo] = useState<Video | null>(null)
  const [editForm, setEditForm] = useState({
    titulo: '',
    descripcion: '',
    video_url: '',
    thumbnail_url: '',
    id_modulo: '',
    numero_orden: '',
    estado: 'activo'
  })
  const videoPlayerRef = useRef(null)

  // Effects
  useEffect(() => {
    fetchVideos()
    fetchModulos()
    fetchCursos()
  }, [])

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(editForm.video_url ? getFullFileUrl(editForm.video_url) : null)
  }, [videoFile, editForm.video_url])

  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile)
      setThumbnailPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setThumbnailPreviewUrl(editForm.thumbnail_url ? getFullFileUrl(editForm.thumbnail_url) : null)
  }, [thumbnailFile, editForm.thumbnail_url])

  // Data Fetching
  const getFullFileUrl = (url: string) => {
    return url ? (url.startsWith('http') || url.startsWith('blob:') ? url : `http://localhost:3001${url}`) : ''
  }

  const fetchApi = async (url: string, setter: (data: any) => void, errorMsg: string) => {
    try {
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        try {
          setter(data)
        } catch (e) {
          console.error('Error processing data:', e)
          toast({ title: "Error", description: 'Error al procesar los datos.', variant: "destructive" })
        }
      } else {
        toast({ title: "Error", description: errorMsg, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: 'Error de conexión', variant: "destructive" })
    }
  }

  const fetchVideos = () => fetchApi('http://localhost:3001/videos', setVideos, 'Error al cargar videos')
  const fetchModulos = () => fetchApi('http://localhost:3001/modulos', setModulos, 'Error al cargar módulos')
  const fetchCursos = () => fetchApi('http://localhost:3001/cursos', setCursos, 'Error al cargar cursos')

  // Filtering and Grouping
  const safeVideos = Array.isArray(videos) ? videos : []
  const videosFiltradosPorModulo = Array.isArray(safeVideos) ? filtrarVideosPorModulo(safeVideos, filtroModulo) : []
  const videosFiltradosPorEstado = Array.isArray(videosFiltradosPorModulo) ? filtrarVideosPorEstado(videosFiltradosPorModulo, filtroEstado) : []
  const videosFiltrados = Array.isArray(videosFiltradosPorEstado) ? filtrarVideosPorCurso(videosFiltradosPorEstado, filtroCurso) : []

  const videosAgrupados = Array.isArray(videosFiltrados)
    ? videosFiltrados.reduce((acc, video) => {
        const cursoKey = video.curso_titulo || 'Sin Curso Asignado'
        if (!acc[cursoKey]) acc[cursoKey] = []
        acc[cursoKey].push(video)
        return acc
      }, {} as Record<string, Video[]>)
    : {}

  // Handlers
  const handleEdit = (video: Video) => {
    setEditingVideo(video)
    setEditForm({
      titulo: video.titulo,
      descripcion: video.descripcion || '',
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || '',
      id_modulo: String(video.id_modulo),
      numero_orden: String(video.numero_orden),
      estado: video.estado
    })
    setVideoSourceType(video.video_url.startsWith('http') && !getYoutubeEmbedUrl(video.video_url) ? 'url' : 'upload')
    setVideoFile(null)
    setThumbnailFile(null)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    resetForm()
    setEditingVideo(null)
    setVideoSourceType('url')
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('titulo', editForm.titulo)
    formData.append('descripcion', editForm.descripcion || '')
    formData.append('id_modulo', editForm.id_modulo)
    formData.append('numero_orden', editForm.numero_orden)
    formData.append('estado', editForm.estado)

    if (videoSourceType === 'upload' && videoFile) {
      formData.append('videoFile', videoFile)
    } else {
      formData.append('video_url', editForm.video_url)
    }

    if (thumbnailFile) {
      formData.append('thumbnailFile', thumbnailFile)
    } else {
      formData.append('thumbnail_url', editForm.thumbnail_url)
    }

    try {
      const url = editingVideo ? `http://localhost:3001/videos/${editingVideo.id_video}` : 'http://localhost:3001/videos'
      const method = editingVideo ? 'PUT' : 'POST'
      const response = await fetch(url, { method, body: formData })
      if (response.ok) {
        toast({ title: "Éxito", description: editingVideo ? 'Video actualizado' : 'Video creado' })
        setIsDialogOpen(false)
        fetchVideos()
        resetForm()
      } else {
        const errorData = await response.json()
        toast({ title: "Error", description: errorData.error || 'Error al guardar', variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: 'Error de conexión', variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro?')) return
    try {
      const res = await fetch(`http://localhost:3001/videos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: "Éxito", description: 'Video eliminado' })
        fetchVideos()
      } else {
        toast({ title: "Error", description: 'Error al eliminar', variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: 'Error de conexión', variant: "destructive" })
    }
  }

  const resetForm = () => {
    setEditForm({
      titulo: '',
      descripcion: '',
      video_url: '',
      thumbnail_url: '',
      id_modulo: '',
      numero_orden: '',
      estado: 'activo'
    })
    setEditingVideo(null)
    setVideoFile(null)
    setThumbnailFile(null)
    setPreviewUrl(null)
    setThumbnailPreviewUrl(null)
  }

  // Render
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Videos</h2>
        <div className="flex gap-2">
          <Select onValueChange={setFiltroCurso} value={filtroCurso}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Cursos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Cursos</SelectItem>
              {cursos.map(c => (
                <SelectItem key={c.id_curso} value={c.id_curso.toString()}>
                  {c.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setFiltroModulo} value={filtroModulo}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Módulos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Módulos</SelectItem>
              {modulos.map(m => (
                <SelectItem key={m.id_modulo} value={m.id_modulo.toString()}>
                  {m.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setFiltroEstado} value={filtroEstado}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="procesando">Procesando</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreate}>Agregar Video</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen)
        if (!isOpen) resetForm()
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 flex-shrink-0">
            <DialogTitle className="text-2xl font-semibold">
              {editingVideo ? 'Editar Video' : 'Agregar Video'}
            </DialogTitle>
            <DialogDescription>
              Rellena los campos para gestionar los videos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto px-6 py-2">
            <form id="video-form" onSubmit={handleSubmit} className="space-y-6">
              {previewUrl && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Vista Previa Video</h3>
                  <div className="aspect-video bg-slate-800 rounded-md overflow-hidden flex items-center justify-center">
                    {(() => {
                      const u = getYoutubeEmbedUrl(previewUrl)
                      if (u) {
                        return (
                          <iframe
                            src={u}
                            title="Vista Previa Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        )
                      }
                      return (
                        <video
                          ref={videoPlayerRef}
                          src={previewUrl}
                          controls
                          className="w-full h-full"
                        />
                      )
                    })()}
                  </div>
                </div>
              )}
              {thumbnailPreviewUrl && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Vista Previa Miniatura</h3>
                  <div className="w-48 h-auto bg-slate-800 rounded-md overflow-hidden">
                    <Image
                      src={thumbnailPreviewUrl}
                      alt="Vista previa miniatura"
                      width={192}
                      height={108}
                      layout="responsive"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-lg font-medium border-b pb-2">Contenido</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo Video</label>
                  <Select value={videoSourceType} onValueChange={(v) => setVideoSourceType(v as VideoSourceType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="upload">Subir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {videoSourceType === 'url' ? (
                  <div>
                    <label className="block text-sm font-medium mb-1">URL Video</label>
                    <Input
                      value={editForm.video_url}
                      onChange={(e) => setEditForm({ ...editForm, video_url: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1">Archivo Video</label>
                    <Input
                      type="file"
                      accept="video/mp4,video/x-m4v,video/*"
                      onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Sube un video. Si editas, solo sube para reemplazar.
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Miniatura</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files ? e.target.files[0] : null)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sube una imagen (JPG, PNG, WEBP).
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium border-b pb-2">Detalles</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <Input
                    value={editForm.titulo}
                    onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <ReactQuill
                    value={editForm.descripcion}
                    onChange={(value) => setEditForm({ ...editForm, descripcion: value })}
                    theme="snow"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                      ],
                    }}
                    placeholder="Escribe la descripción del video..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium border-b pb-2">Organización</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Módulo</label>
                  <Select
                    required
                    value={editForm.id_modulo}
                    onValueChange={(value) => setEditForm({ ...editForm, id_modulo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {modulos.map(m => (
                        <SelectItem key={m.id_modulo} value={m.id_modulo.toString()}>
                          {m.titulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {editingVideo && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Nº Orden</label>
                    <Input
                      type="number"
                      value={editForm.numero_orden}
                      onChange={(e) => setEditForm({ ...editForm, numero_orden: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <Select
                    value={editForm.estado}
                    onValueChange={(value) => setEditForm({ ...editForm, estado: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="procesando">Procesando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </div>
          <DialogFooter className="p-6 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="video-form">
              {editingVideo ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedThumbnailUrl} onOpenChange={() => setZoomedThumbnailUrl(null)}>
        <DialogContent className="max-w-3xl p-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          <div className="aspect-video relative">
            <Image
              src={zoomedThumbnailUrl || ''}
              alt="Miniatura ampliada"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedVideo} onOpenChange={() => setZoomedVideo(null)}>
        <DialogContent className="max-w-5xl w-full p-0 border-0 bg-transparent shadow-none aspect-video">
          <DialogClose asChild className="absolute top-0 right-0 z-50 m-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 text-white border-white/20 hover:bg-black/75 hover:text-white"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar</span>
            </Button>
          </DialogClose>
          {zoomedVideo && (
            getYoutubeEmbedUrl(zoomedVideo.video_url) ? (
              <iframe
                src={`${getYoutubeEmbedUrl(zoomedVideo.video_url)}?autoplay=1&rel=0`}
                title={zoomedVideo.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video
                src={getFullFileUrl(zoomedVideo.video_url)}
                controls
                autoPlay
                className="w-full h-full"
              />
            )
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-10">
        {Object.entries(videosAgrupados).map(([cursoTitulo, videosDelCurso]) => (
          <section key={cursoTitulo}>
            <h3 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-900 dark:text-white">{cursoTitulo}</h3>
            <div className={styles.gridVideos}>
              {videosDelCurso.map((video) => {
                const embedUrl = getYoutubeEmbedUrl(video.video_url)
                return (
                  <Card key={video.id_video} className={`${styles.videoCard} bg-white dark:bg-gray-800 border-0 flex flex-col overflow-hidden`}>
                    {/* Media section: Image and Video side-by-side */}
                    <div className="flex flex-row">
                      {/* 1. Image section */}
                      <div className="relative w-1/2 aspect-video group border-b-4 border-gray-200 dark:border-gray-700 border-r-4 border-gray-200 dark:border-gray-700" onClick={() => { if (video.thumbnail_url) { setZoomedThumbnailUrl(getFullFileUrl(video.thumbnail_url)) } }}>
                          <Image
                              src={video.thumbnail_url ? getFullFileUrl(video.thumbnail_url) : '/placeholder.jpg'}
                              alt={video.titulo}
                              layout="fill"
                              objectFit="cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <Expand className="w-10 h-10 text-white"/>
                          </div>
                      </div>

                      {/* 2. Video section */}
                      <div className="w-1/2 aspect-video">
                          {embedUrl ? (
                              <iframe
                                  src={embedUrl}
                                  title={video.titulo}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full"
                              />
                          ) : (
                              <video
                                  src={getFullFileUrl(video.video_url)}
                                  controls
                                  poster={video.thumbnail_url ? getFullFileUrl(video.thumbnail_url) : undefined}
                                  className="w-full h-full object-cover"
                              />
                          )}
                      </div>
                    </div>

                    {/* 3. Information section */}
                    <div className="w-full">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="text-base font-semibold leading-tight">
                                    {video.titulo}
                                </CardTitle>
                                <Badge className={`${getEstadoColor(video.estado)} flex-shrink-0`}>
                                    {video.estado}
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                                {video.modulo_titulo}
                            </p>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {video.descripcion && (
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: video.descripcion }} />
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Orden:</span> {video.numero_orden}
                            </div>
                        </CardContent>
                    </div>

                    {/* 4. Action buttons section */}
                    <CardFooter className="p-4 pt-2 flex justify-end items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(video)}
                            className="w-full"
                        >
                            Editar
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(video.id_video)}
                            className="w-full"
                        >
                            Eliminar
                        </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}