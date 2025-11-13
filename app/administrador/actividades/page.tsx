import Link from 'next/link'

export default function ActividadesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Actividades</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Auditoría y seguimiento de actividades del sistema</p>
        </div>
        <Link
          href="/administrador"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Volver al Panel
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/administrador/actividades/registro"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Registro de Actividades</h2>
          <p className="text-gray-600 dark:text-gray-300">Ver el registro completo de actividades del sistema</p>
        </Link>

        <Link
          href="/administrador/actividades/gestion"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gestión de Actividades</h2>
          <p className="text-gray-600 dark:text-gray-300">Administrar y gestionar actividades del sistema</p>
        </Link>
      </div>
    </div>
  )
}
