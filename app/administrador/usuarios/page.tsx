'use client'

import Link from 'next/link'
import UserManagement from '../components/UserManagement'

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Administrar usuarios registrados</p>
        </div>
        <Link href="/administrador" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
          Volver al Panel
        </Link>
      </div>

      <UserManagement />
    </div>
  )
}
