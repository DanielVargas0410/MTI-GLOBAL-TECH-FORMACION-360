'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import VideosVistosTable from './components/VideosVistosTable'

interface VideoVisto {
  id_video_visto: number;
  fecha_visualizacion: string;
  fecha_ultima_visualizacion: string;
  progreso_segundos: number;
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  telefono_usuario: string | null;
  ciudad_usuario: string | null;
  pais_usuario: string;
  rol_usuario: string;
  estado_usuario: string;
  fecha_registro_usuario: string;
  fecha_ultimo_acceso_usuario: string | null;
  id_video: number;
  titulo_video: string;
  descripcion_video: string | null;
  video_url: string;
  thumbnail_url: string | null;
  orden_video: number;
  estado_video: string;
  id_modulo: number;
  titulo_modulo: string;
  descripcion_modulo: string | null;
  orden_modulo: number;
  estado_modulo: string;
  id_curso: number;
  titulo_curso: string;
  descripcion_curso: string | null;
  imagen_curso: string | null;
  codigo_acceso: string;
  precio_curso: number;
  estado_curso: string;
  fecha_creacion_curso: string;
  fecha_publicacion_curso: string | null;
  estado_inscripcion_curso: string | null;
  fecha_activacion_curso: string | null;
  videos_vistos_curso: number | null;
  fecha_ultimo_acceso_curso: string | null;
}

export default function RegistroVideosVistosPage() {
  const [videosVistos, setVideosVistos] = useState<VideoVisto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideosVistos()
  }, [])

  const fetchVideosVistos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/videos-vistos')
      if (response.ok) {
        const data = await response.json();
        setVideosVistos(data);
      } else {
        alert('Error al cargar videos vistos');
      }
    } catch (error) {
      console.error('Error fetching videos vistos:', error)
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registro de Videos Vistos</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Historial de visualización de videos por estudiantes.</p>
            </div>
            <Link href="/administrador/videos-vistos">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Volver
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
            <p>Cargando historial de videos vistos...</p>
        ) : (
            <VideosVistosTable videosVistos={videosVistos} />
        )}
        {videosVistos.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-8">
            No se encontraron registros de videos vistos.
          </p>
        )}
      </main>
    </div>
  )
}
