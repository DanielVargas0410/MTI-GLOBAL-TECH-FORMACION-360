'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import UserTable from '../usuarios/components/UserTable'
import UserFormModal, { UserFormData } from '../usuarios/components/UserFormModal'
import UserDetailModal from '../usuarios/components/UserDetailModal'
import { filtrarUsuariosPorRol, filtrarUsuariosPorEstado, ordenarUsuariosPorNombre } from '../usuarios/lib/usuariosUtils'
import styles from '../usuarios/styles/usuarios.module.css'

/* ===========================================
   Interfaces principales
   =========================================== */
interface User {
  id_usuario: number
  email: string
  nombre_completo: string
  telefono?: string
  ciudad?: string
  pais?: string
  rol: 'estudiante' | 'administrador'
  estado: 'activo' | 'inactivo' | 'suspendido'
  fecha_registro: string
  fecha_ultimo_acceso?: string
}

// Versión completa de usuario con todos los campos obligatorios
type UserFull = User & {
  telefono: string | null
  ciudad: string | null
  pais: string
  fecha_registro: string
  fecha_ultimo_acceso: string | null
}

/* ===========================================
   Componente principal
   =========================================== */
export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filtroRol, setFiltroRol] = useState('all')
  const [filtroEstado, setFiltroEstado] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [userCourses, setUserCourses] = useState<any[]>([])
  const { toast } = useToast()

  type FormData = {
    email: string
    nombre_completo: string
    telefono: string
    ciudad: string
    pais: string
    rol: 'estudiante' | 'administrador'
    estado: 'activo' | 'inactivo' | 'suspendido'
  }

  const [formData, setFormData] = useState<FormData>({
    email: '',
    nombre_completo: '',
    telefono: '',
    ciudad: '',
    pais: '',
    rol: 'estudiante',
    estado: 'activo'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(ordenarUsuariosPorNombre(data))
      } else {
        toast({ title: "Error", description: "Error al cargar usuarios", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error de Conexión", description: "No se pudo conectar con el servidor", variant: "destructive" })
    }
  }

  /* ===========================================
     Handlers
     =========================================== */
  const usuariosFiltrados = filtrarUsuariosPorEstado(
    filtrarUsuariosPorRol(users, filtroRol),
    filtroEstado
  )

  const handleEdit = (user: User) => {
    const fullUser = user as UserFull
    setEditingUser(user)
    setFormData({
      email: fullUser.email,
      nombre_completo: fullUser.nombre_completo,
      telefono: fullUser.telefono || '',
      ciudad: fullUser.ciudad || '',
      pais: fullUser.pais || '',
      rol: fullUser.rol,
      estado: fullUser.estado
    })
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({
      email: '',
      nombre_completo: '',
      telefono: '',
      ciudad: '',
      pais: '',
      rol: 'estudiante',
      estado: 'activo'
    })
    setIsModalOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (submitData: UserFormData) => {
    console.log('Datos a enviar al backend:', submitData);
    if (editingUser) {
      try {
        const response = await fetch(`http://localhost:3001/users/${editingUser.id_usuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        })
        console.log('Respuesta del backend (PUT):', response.status, response.statusText);
        if (response.ok) {
          toast({ title: "Éxito", description: "Usuario actualizado correctamente." })
          setIsModalOpen(false)
          fetchUsers()
        } else {
          const errorData = await response.json();
          console.log('Error del backend (PUT):', errorData);
          toast({ title: "Error", description: errorData.error || "No se pudo actualizar el usuario.", variant: "destructive" })
        }
      } catch (error) {
        console.log('Error de conexión (PUT):', error);
        toast({ title: "Error de Conexión", description: "No se pudo conectar con el servidor", variant: "destructive" })
      }
    } else {
      try {
        const response = await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        })
        console.log('Respuesta del backend (POST):', response.status, response.statusText);
        if (response.ok) {
          toast({ title: "Éxito", description: "Usuario agregado correctamente." })
          setIsModalOpen(false)
          fetchUsers()
        } else {
          const errorData = await response.json();
          console.log('Error del backend (POST):', errorData);
          toast({ title: "Error", description: errorData.error || "No se pudo agregar el usuario.", variant: "destructive" })
        }
      } catch (error) {
        console.log('Error de conexión (POST):', error);
        toast({ title: "Error de Conexión", description: "No se pudo conectar con el servidor", variant: "destructive" })
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return
    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: "Éxito", description: "Usuario eliminado correctamente." })
        fetchUsers()
      } else {
        toast({ title: "Error", description: "No se pudo eliminar el usuario.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error de Conexión", description: "No se pudo conectar con el servidor", variant: "destructive" })
    }
  }

  const handleView = async (user: User) => {
    setViewingUser(user)
    try {
      const response = await fetch(`http://localhost:3001/users/${user.id_usuario}/courses`)
      if (response.ok) {
        const courses = await response.json()
        setUserCourses(courses)
      } else {
        setUserCourses([])
      }
    } catch (error) {
      setUserCourses([])
    }
  }

  const handleCloseDetailModal = () => {
    setViewingUser(null)
    setUserCourses([])
  }

  /* ===========================================
     Render
     =========================================== */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h2>
        <div className="flex gap-4">
          <Select value={filtroRol} onValueChange={setFiltroRol}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200">
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="estudiante">Estudiante</SelectItem>
              <SelectItem value="administrador">Administrador</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="suspendido">Suspendido</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd}>Agregar Usuario</Button>
        </div>
      </div>

      <UserTable users={usuariosFiltrados} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />

      <UserFormModal
        isOpen={isModalOpen}
        isEditing={!!editingUser}
        formData={formData}
        onClose={() => setIsModalOpen(false)}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit as any}
      />

      <UserDetailModal
        isOpen={!!viewingUser}
        user={viewingUser}
        courses={userCourses}
        onClose={handleCloseDetailModal}
      />
    </div>
  )
}
