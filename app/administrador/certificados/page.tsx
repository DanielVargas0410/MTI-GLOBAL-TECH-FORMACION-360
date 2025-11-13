import Link from 'next/link'
import CertificadosManagement from '../components/CertificadosManagement';
import { CertificateValidationModal } from './components/CertificateValidationModal';

export default function CertificadosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Certificados</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Administrar certificados de cursos</p>
        </div>
        <div className="flex items-center space-x-4">
          <CertificateValidationModal />
          <Link
            href="/administrador"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Volver al Panel
          </Link>
        </div>
      </div>

      <CertificadosManagement />
    </div>
  )
}
