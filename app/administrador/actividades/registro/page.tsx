'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FiltrosActividad from './components/FiltrosActividad'
import ActividadTable from './components/ActividadTable'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { filtrarActividades, ordenarActividades } from './lib/actividadesUtils'

interface Actividad {
  id_actividad: number;
  fecha_actividad: string;
  tipo_actividad: string;
  descripcion: string;
  nombre_usuario: string;
  email_usuario: string;
}

const INITIAL_FILTROS = {
  searchTerm: '',
  tipoActividad: '',
  fechaDesde: '',
  fechaHasta: '',
};

export default function ActividadesPage() {
  const router = useRouter()
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState(INITIAL_FILTROS)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchActividades()
  }, [])

  const fetchActividades = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/actividades')
      if (response.ok) {
        const data = await response.json();
        // The utils file has a sorter, let's use it by default
        setActividades(ordenarActividades(data, 'fecha_desc'));
      } else {
        alert('Error al cargar actividades');
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  }

  const handleResetFiltros = () => {
    setFiltros(INITIAL_FILTROS);
    setCurrentPage(1);
  }

  const actividadesFiltradas = filtrarActividades(actividades, filtros);

  // Pagination logic
  const totalPages = Math.ceil(actividadesFiltradas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const actividadesPaginadas = actividadesFiltradas.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registro de Actividad</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Monitoriza los eventos importantes del sistema.</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <FiltrosActividad
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onResetFiltros={handleResetFiltros}
        />
        {loading ? (
            <p className="text-gray-900 dark:text-white">Cargando actividades...</p>
        ) : (
            <>
              <ActividadTable actividades={actividadesPaginadas} />
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
        )}
         {actividadesFiltradas.length === 0 && !loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No se encontraron actividades con los filtros seleccionados.
          </p>
        )}
      </main>
    </div>
  )
}