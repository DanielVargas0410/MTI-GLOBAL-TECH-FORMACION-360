'use client'

import VideoManagement from '../components/VideoManagement'
import Link from 'next/link'

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Videos</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Administrar videos disponibles</p>
            </div>
            <Link href="/administrador" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Volver al Panel
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <VideoManagement />
      </main>
    </div>
  )
}
