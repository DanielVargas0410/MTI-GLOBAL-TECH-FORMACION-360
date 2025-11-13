'use client'

import { useState, FormEvent, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'

interface EditProfileProps {
  student: {
    id_usuario: number
    nombre_completo: string
    email: string
    telefono?: string
    ciudad?: string
    pais?: string
    direccion?: string
    foto_perfil_url?: string
  }
  onUpdate: () => void
}

export default function EditProfile({ student, onUpdate }: EditProfileProps) {
  const { toast } = useToast()
  const [name, setName] = useState(student.nombre_completo || '')
  const [email, setEmail] = useState(student.email || '')
  const [phone, setPhone] = useState(student.telefono || '')
  const [city, setCity] = useState(student.ciudad || '')
  const [country, setCountry] = useState(student.pais || '')
  const [address, setAddress] = useState(student.direccion || '')
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(student.foto_perfil_url || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "La imagen no puede ser mayor a 5MB.",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de imagen.",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()

      // Solo agregar campos que han cambiado o no están vacíos
      if (name.trim() !== '') {
        formData.append('nombre_completo', name.trim())
      }
      if (phone.trim() !== '') {
        formData.append('telefono', phone.trim())
      }
      if (address.trim() !== '') {
        formData.append('direccion', address.trim())
      }
      if (city.trim() !== '') {
        formData.append('ciudad', city.trim())
      }
      if (country.trim() !== '') {
        formData.append('pais', country.trim())
      }

      if (selectedFile) {
        formData.append('foto_perfil', selectedFile)
      } else if (profilePhotoUrl.trim() !== '') {
        formData.append('foto_perfil_url', profilePhotoUrl.trim())
      }

      const response = await fetch(`http://localhost:3001/users/profile/${student.id_usuario}`, {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar el perfil')
      }

      const result = await response.json()
      if (result.foto_perfil_url) {
        setProfilePhotoUrl(result.foto_perfil_url)
      }

      onUpdate() // Refresh data
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado exitosamente.",
      })

      // Reset file selection
      setSelectedFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error desconocido',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ciudad</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">País</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="space-y-4">
          <Label className="block text-sm font-medium text-gray-700">Foto de Perfil</Label>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={previewUrl || (profilePhotoUrl ? `http://localhost:3001${profilePhotoUrl}` : undefined)}
                alt="Foto de perfil"
              />
              <AvatarFallback>
                {student.nombre_completo?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Seleccionar Imagen</span>
              </Button>
              {selectedFile && (
                <p className="text-sm text-gray-600">
                  Archivo seleccionado: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">O ingresa una URL de imagen</Label>
            <Input
              type="url"
              value={profilePhotoUrl}
              onChange={(e) => setProfilePhotoUrl(e.target.value)}
              placeholder="URL de la imagen de perfil"
              className="mt-1"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}
