'use client'

import ModuloManagement from '../components/ModuloManagement'
import Link from 'next/link'

export default function ModulosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Módulos</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Administrar módulos de cursos</p>
        </div>
        <Link href="/administrador" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
          Volver al Panel
        </Link>
      </div>

      <ModuloManagement />
    </div>
  )
}
