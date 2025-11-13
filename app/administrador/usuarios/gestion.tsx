'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UserTable from './components/UserTable'
import UserFormModal from './components/UserFormModal'
import UserDetailModal from './components/UserDetailModal'

interface User {
  id_usuario: number;
  nombre_completo: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  rol: 'administrador' | 'estudiante';
  estado: 'activo' | 'inactivo' | 'suspendido';
  fecha_registro: string;
  fecha_ultimo_acceso?: string;
}

const INITIAL_FORM_DATA = {
  nombre_completo: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  pais: 'Colombia',
  password: '',
  rol: 'estudiante' as 'administrador' | 'estudiante',
  estado: 'activo' as 'activo' | 'inactivo' | 'suspendido',
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [addingUser, setAddingUser] = useState(false)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [userCourses, setUserCourses] = useState<any[]>([])
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        alert('Error al cargar usuarios')
      }
    } catch (error) {
      alert('Error de conexión al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      nombre_completo: user.nombre_completo,
      email: user.email,
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      ciudad: user.ciudad || '',
      pais: user.pais || 'Colombia',
      password: '', // Password should not be pre-filled
      rol: user.rol,
      estado: user.estado,
    })
  }

  const handleAdd = () => {
    setAddingUser(true)
    setFormData(INITIAL_FORM_DATA)
  }

  const handleCloseModal = () => {
    setEditingUser(null)
    setAddingUser(false)
  }

  const handleCloseDetailModal = () => {
    setViewingUser(null)
    setUserCourses([])
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingUser
      ? `http://localhost:3001/users/${editingUser.id_usuario}`
      : 'http://localhost:3001/auth/register';

    const method = editingUser ? 'PUT' : 'POST';

    // For PUT, if password is empty, don't send it
    const body = { ...formData };
    if (editingUser && !body.password) {
      delete (body as any).password;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        alert(editingUser ? 'Usuario actualizado' : 'Usuario creado')
        handleCloseModal()
        fetchUsers()
      } else {
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.message || 'Error desconocido'}`)
      }
    } catch (error) {
      alert('Error de conexión al guardar')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Usuario eliminado')
        fetchUsers()
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      alert('Error de conexión al eliminar')
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="mt-2 text-sm text-gray-600">Administrar usuarios del sistema</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Agregar Usuario
            </button>
          </div>

          <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
        </div>
      </main>

      <UserFormModal
        isOpen={!!editingUser || addingUser}
        isEditing={!!editingUser}
        formData={formData}
        onClose={handleCloseModal}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
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
