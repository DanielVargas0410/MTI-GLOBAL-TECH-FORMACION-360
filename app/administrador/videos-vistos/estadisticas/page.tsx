'use client'

import React from 'react';
import { ArrowLeft, BarChart3, Sparkles } from 'lucide-react';
import Link from 'next/link';

import VideoStatsManagement from '../components/VideoStatsManagement';

const EstadisticasVideosVistosPage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Premium con Glassmorphism */}
      <header className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5"></div>

        <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Título y descripción */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-gray-100 dark:via-blue-200 dark:to-gray-100 bg-clip-text text-transparent">
                    Estadísticas de Videos Vistos
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-md">
                    <Sparkles className="w-3 h-3" />
                    Live
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-2xl">
                  Análisis detallado del progreso y compromiso de los estudiantes con el contenido educativo
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Actualizado en tiempo real</span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date().toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de volver mejorado */}
            <Link href="/administrador/videos-vistos">
              <button className="group relative px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-medium">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 rounded-xl transition-all"></div>
                <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                <span className="relative">Volver</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Decoración inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
      </header>

      {/* Contenido principal con mejor espaciado */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Contenedor del componente con animación de entrada */}
        <div className="relative animate-fadeIn">
          <VideoStatsManagement />
        </div>
      </main>

      {/* Footer decorativo opcional */}
      <footer className="relative max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Panel de Administración</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Datos actualizados automáticamente</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-600 font-medium">v2.0</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EstadisticasVideosVistosPage;