'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminHomeSection from '@/components/AdminHomeSection'
import AdminStatsSection from '@/components/AdminStatsSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  BookOpen,
  FolderOpen,
  Video,
  FileText,
  Award,
  Activity,
  Eye,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Zap,
  Target,
  BarChart3,
  Image
} from 'lucide-react'
import { AdminMetric, AdminActivity, AdminPieData, AdminChartData } from '@/components/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalCategories: 0,
    totalModules: 0,
    totalVideos: 0,
    activeStudents: 0
  })

  const [loading, setLoading] = useState(true)

  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [pieData, setPieData] = useState<AdminPieData[]>([])
  const [chartData, setChartData] = useState<AdminChartData[]>([])

  useEffect(() => {
    fetchStats()
    fetchActivities()
    fetchActivityStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [usersRes, coursesRes, categoriesRes, modulesRes, videosRes] = await Promise.all([
        fetch('http://localhost:3001/users'),
        fetch('http://localhost:3001/cursos'),
        fetch('http://localhost:3001/categorias'),
        fetch('http://localhost:3001/modulos'),
        fetch('http://localhost:3001/videos')
      ])

      const users = usersRes.ok ? await usersRes.json() : []
      const courses = coursesRes.ok ? await coursesRes.json() : []
      const categories = categoriesRes.ok ? await categoriesRes.json() : []
      const modules = modulesRes.ok ? await modulesRes.json() : []
      const videos = videosRes.ok ? await videosRes.json() : []

      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalCategories: categories.length,
        totalModules: modules.length,
        totalVideos: videos.length,
        activeStudents: users.filter((u: any) => u.estado === 'activo').length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      const res = await fetch('http://localhost:3001/actividades')
      if (!res.ok) throw new Error('Error fetching activities')
      const data = await res.json()
      // Map to AdminActivity type
      const mapped = data.slice(0, 10).map((item: any) => ({
        user: item.nombre_completo || 'Usuario',
        action: item.descripcion || 'Actividad',
        course: item.curso_titulo || '',
        time: new Date(item.fecha_actividad).toLocaleString('es-ES')
      }))
      setActivities(mapped)
    } catch (error) {
      console.error('Error fetching activities, using fallback data:', error)
      // Fallback: Create mock activities based on current stats
      const mockActivities: AdminActivity[] = [
        {
          user: 'Estudiante Alejo',
          action: 'Se matriculó en curso',
          course: 'ChatGPT en Procesos Judiciales',
          time: new Date().toLocaleString('es-ES')
        },
        {
          user: 'Estudiante Alejo',
          action: 'Completó módulo',
          course: 'IA para la Gestión de Contratos',
          time: new Date(Date.now() - 3600000).toLocaleString('es-ES')
        }
      ]
      setActivities(mockActivities)
    }
  }

  const fetchActivityStats = async () => {
    try {
      const res = await fetch('http://localhost:3001/actividades/estadisticas/mensuales')
      if (!res.ok) throw new Error('Error fetching activity stats')
      const data = await res.json()

      // Transform the data to match AdminChartData format
      const chartDataArr: AdminChartData[] = data.map((item: any) => ({
        month: item.month,
        estudiantes: item.estudiantes,
        cursos: item.cursos,
        videos_vistos: item.videos_vistos,
        total_videos: item.total_videos
      }))

      // Create pie data from the total counts
      const totalEstudiantes = data.reduce((sum: number, item: any) => sum + item.estudiantes, 0)
      const totalCursos = data.reduce((sum: number, item: any) => sum + item.cursos, 0)

      const pieDataArr: AdminPieData[] = [
        {
          name: 'Estudiantes',
          value: totalEstudiantes,
          color: '#8b5cf6'
        },
        {
          name: 'Cursos',
          value: totalCursos,
          color: '#06b6d4'
        }
      ]

      setPieData(pieDataArr)
      setChartData(chartDataArr)
    } catch (error) {
      console.error('Error fetching activity stats, using fallback data:', error)

      // Fallback: Create mock data based on current stats
      const currentMonth = new Date().toLocaleString('es-ES', { month: 'short', year: 'numeric' })
      const mockChartData: AdminChartData[] = [
        {
          month: currentMonth,
          estudiantes: stats.activeStudents,
          cursos: stats.totalCourses
        }
      ]

      const mockPieData: AdminPieData[] = [
        {
          name: 'Estudiantes',
          value: stats.activeStudents,
          color: '#8b5cf6'
        },
        {
          name: 'Cursos',
          value: stats.totalCourses,
          color: '#06b6d4'
        }
      ]

      setPieData(mockPieData)
      setChartData(mockChartData)
    }
  }

  const managementModules = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios registrados',
      href: '/administrador/usuarios',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      stats: `${stats.totalUsers} usuarios`
    },
    {
      title: 'Gestión de Categorías',
      description: 'Administrar categorías de cursos',
      href: '/administrador/categorias',
      icon: FolderOpen,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      stats: `${stats.totalCategories} categorías`
    },
    {
      title: 'Gestión de Cursos',
      description: 'Administrar cursos disponibles',
      href: '/administrador/cursos',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      stats: `${stats.totalCourses} cursos`
    },
    {
      title: 'Gestión de Módulos',
      description: 'Administrar módulos de cursos',
      href: '/administrador/modulos',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      stats: `${stats.totalModules} modulos`
    },
    {
      title: 'Gestión de Videos',
      description: 'Administrar videos de módulos',
      href: '/administrador/videos',
      icon: Video,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      stats: `${stats.totalVideos} videos`
    },
    {
      title: 'Cursos Estudiante',
      description: 'Administrar cursos asignados',
      href: '/administrador/cursos_estudiantes',
      icon: Target,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      stats: '28 asignaciones'
    },
    {
      title: 'Videos Vistos',
      description: 'Seguimiento de progreso',
      href: '/administrador/videos-vistos',
      icon: Eye,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      stats: '156 visualizaciones'
    },
    {
      title: 'Certificados',
      description: 'Gestión de certificaciones',
      href: '/administrador/certificados',
      icon: Award,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      stats: '23 certificados'
    },
    {
      title: 'Actividades',
      description: 'Auditoría del sistema',
      href: '/administrador/actividades',
      icon: Activity,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400',
      stats: '89 actividades'
    },
    {
      title: 'Imagen Hero',
      description: 'Cambiar imagen principal',
      href: '/administrador/hero',
      icon: Image,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      textColor: 'text-teal-600 dark:text-teal-400',
      stats: 'Imagen activa'
    }
  ]

  // Define metrics based on real stats
  const metrics: AdminMetric[] = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsers.toString(),
      icon: Users,
      change: '+12% este mes'
    },
    {
      title: 'Cursos Activos',
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      change: '+8% este mes'
    },
    {
      title: 'Categorías',
      value: stats.totalCategories.toString(),
      icon: FolderOpen,
      change: '+3 nuevas'
    },
    {
      title: 'Estudiantes Activos',
      value: stats.activeStudents.toString(),
      icon: TrendingUp,
      change: '+15% este mes'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-gray-300 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-8 h-8 text-blue" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
                    Panel de Administración
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    Formación 360 - Gestión del Sistema
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white dark:border-slate-700 shadow-lg">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Administrador</h3>
                <p className="text-slate-600 dark:text-slate-400">admin@mtiglobaltech.com</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Sistema Activo</span>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Management Modules Grid */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Módulos de Gestión</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementModules.map((module, index) => (
              <Link
                key={module.title}
                href={module.href}
                className="group relative overflow-hidden bg-white dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-slate-200 dark:border-slate-600"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${module.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <module.icon className={`w-6 h-6 ${module.textColor}`} />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                        {module.stats}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {module.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {module.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 border-2 border-slate-600 dark:border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>


        {/* Statistics Section */}
        {metrics.length > 0 && activities.length > 0 && pieData.length > 0 && (
          <AdminHomeSection metrics={metrics} activities={activities} pieData={pieData} />
        )}



        {/* Charts Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Estadísticas y Tendencias</h2>
          </div>
          <AdminStatsSection chartData={chartData} />
        </div>


{/* Admin Dashboard Footer */}
<div className="bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 rounded-2xl shadow-lg p-8 border border-gray-300 dark:border-slate-600">
  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Panel de Administración</h3>
      <p className="text-slate-600 dark:text-slate-400">
        Accesos rápidos a las herramientas de gestión del sistema
      </p>
    </div>

    {/* Quick Access Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <a
        href="/administrador/usuarios"
        className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-slate-600 hover:shadow-lg hover:border-blue-300 transition-all group"
      >
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👥</div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Usuarios</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestión de usuarios</p>
      </a>

      <a
        href="/administrador/cursos"
        className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-slate-600 hover:shadow-lg hover:border-blue-300 transition-all group"
      >
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Cursos</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestión de cursos</p>
      </a>

      <a
        href="/administrador/categorias"
        className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-slate-600 hover:shadow-lg hover:border-blue-300 transition-all group"
      >
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏷️</div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Categorías</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Organización de contenido</p>
      </a>

      <a
        href="/administrador/modulos"
        className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-slate-600 hover:shadow-lg hover:border-blue-300 transition-all group"
      >
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📦</div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Módulos</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Contenido de cursos</p>
      </a>

      <a
        href="/administrador/certificados"
        className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-slate-600 hover:shadow-lg hover:border-blue-300 transition-all group"
      >
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎓</div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Certificados</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Emisión y validación</p>
      </a>

      <a
        href="/administrador/actividades"
        className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-slate-600 hover:shadow-lg hover:border-blue-300 transition-all group"
      >
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✍️</div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Actividades</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tareas y evaluaciones</p>
      </a>

      <a
        href="/administrador/videos-vistos"
        className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-slate-600 hover:shadow-lg hover:border-blue-300 transition-all group"
      >
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Progreso</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Videos vistos</p>
      </a>

      <a
        href="/administrador/cursos_estudiantes"
        className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-slate-600 hover:shadow-lg hover:border-blue-300 transition-all group"
      >
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Inscripciones</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cursos de estudiantes</p>
      </a>
    </div>

    {/* Support Section */}
    <div className="border-t border-gray-300 dark:border-slate-600 pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">¿Necesitas asistencia técnica?</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Contacta al equipo de soporte para resolver dudas</p>
        </div>
        <a
          href="https://wa.me/573127085169"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>Soporte WhatsApp</span>
        </a>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  )
}
