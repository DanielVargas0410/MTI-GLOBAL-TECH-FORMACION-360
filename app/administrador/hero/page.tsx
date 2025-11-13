'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload, Image as ImageIcon, Eye, Trash2, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface HeroImage {
  id: number
  image_url: string
  titulo: string | null
  descripcion: string | null
  estado: 'activo' | 'inactivo'
  created_at: string
  updated_at: string
}

export default function HeroManagementPage() {
  const { toast } = useToast()
  const [images, setImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:3001/hero')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Error fetching hero images:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: "Error", description: 'Por favor selecciona una imagen', variant: "destructive" })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('image', selectedFile)
    if (titulo.trim()) formData.append('titulo', titulo.trim())
    if (descripcion.trim()) formData.append('descripcion', descripcion.trim())

    try {
      const response = await fetch('http://localhost:3001/hero', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        toast({ title: "Éxito", description: 'Imagen subida exitosamente' })
        setSelectedFile(null)
        setPreviewUrl(null)
        setTitulo('')
        setDescripcion('')
        fetchImages()
      } else {
        toast({ title: "Error", description: 'Error al subir la imagen', variant: "destructive" })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({ title: "Error", description: 'Error al subir la imagen', variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleActivate = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/hero/${id}/activate`, {
        method: 'PUT'
      })

      if (response.ok) {
        toast({ title: "Éxito", description: 'Imagen activada exitosamente' })
        fetchImages()
      } else {
        toast({ title: "Error", description: 'Error al activar la imagen', variant: "destructive" })
      }
    } catch (error) {
      console.error('Error activating image:', error)
      toast({ title: "Error", description: 'Error al activar la imagen', variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/hero/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({ title: "Éxito", description: 'Imagen eliminada exitosamente' })
        fetchImages()
      } else {
        toast({ title: "Error", description: 'Error al eliminar la imagen', variant: "destructive" })
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast({ title: "Error", description: 'Error al eliminar la imagen', variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/administrador">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              Gestión de Imagen del Hero
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Administra la imagen principal de la página de inicio
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Subir Nueva Imagen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image">Seleccionar Imagen (JPG, PNG)</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="mt-1"
              />
              {previewUrl && (
                <div className="mt-4">
                  <Label>Previsualización</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden aspect-video">
                    <img
                      src={previewUrl}
                      alt="Previsualización"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="titulo">Título (opcional)</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de la imagen"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción (opcional)</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción de la imagen"
                className="mt-1"
                rows={3}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full"
            >
              {uploading ? 'Subiendo...' : 'Subir Imagen'}
            </Button>
          </CardContent>
        </Card>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={image.image_url}
                  alt={image.titulo || 'Imagen del hero'}
                  className="w-full h-full object-cover"
                />
                {image.estado === 'activo' && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Activa
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                {image.titulo && (
                  <h3 className="font-semibold text-lg mb-2">{image.titulo}</h3>
                )}
                {image.descripcion && (
                  <p className="text-sm text-muted-foreground mb-4">{image.descripcion}</p>
                )}

                <div className="flex gap-2">
                  {image.estado !== 'activo' && (
                    <Button
                      onClick={() => handleActivate(image.id)}
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Activar
                    </Button>
                  )}

                  <Button
                    onClick={() => handleDelete(image.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {images.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay imágenes</h3>
              <p className="text-muted-foreground">
                Sube tu primera imagen del hero para personalizar la página de inicio
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
