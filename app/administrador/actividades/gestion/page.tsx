import Link from 'next/link'
import ActividadesManagement from '../../components/ActividadesManagement'

export default function GestionActividadesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Actividades</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Auditoría y seguimiento de actividades del sistema</p>
        </div>
        <Link
          href="/administrador/actividades"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Volver
        </Link>
      </div>

      <ActividadesManagement />
    </div>
  )
}
