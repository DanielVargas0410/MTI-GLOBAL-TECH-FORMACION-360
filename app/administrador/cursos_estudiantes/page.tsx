import CursosEstudianteManagement from '../components/CursosEstudianteManagement'
import Link from 'next/link'

export default function CursosEstudiantePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Cursos Estudiante</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Administrar cursos asignados a estudiantes</p>
            </div>
            <Link href="/administrador" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
              Volver al Panel
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <CursosEstudianteManagement />
      </main>
    </div>
  )
}
