"use client"
import React, { FC, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, ComposedChart, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, BookOpen, Activity, Target, Award, Calendar, BarChart3, Settings, Download, RefreshCw } from "lucide-react"
import * as XLSX from 'xlsx'
import { AdminChartData } from "./types"

type AdminStatsSectionProps = {
  chartData: AdminChartData[]
}

type PieDataItem = {
  name: string
  value: number
  color: string
}

const AdminStatsSection: FC<AdminStatsSectionProps> = ({ chartData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [selectedChartType, setSelectedChartType] = useState('combined')
  const [showGrowth, setShowGrowth] = useState(true)
  const [showAverages, setShowAverages] = useState(true)

  // Debug: Log received data
  console.log('AdminStatsSection - Received chartData:', chartData)
  console.log('AdminStatsSection - chartData length:', chartData?.length || 0)
  console.log('AdminStatsSection - First item:', chartData?.[0])

  // Ensure chartData is an array before processing
  const safeChartData = Array.isArray(chartData) ? chartData : []

  // Filter data based on selected period
  const getFilteredData = () => {
    if (safeChartData.length === 0) {
      return []
    }
    const periods = {
      '3months': 3,
      '6months': 6,
      '12months': 12,
      'all': safeChartData.length
    }
    const limit = periods[selectedPeriod as keyof typeof periods] || 6
    const filtered = safeChartData.slice(-limit)
    console.log('AdminStatsSection - Filtered data:', filtered)
    return filtered
  }

  const filteredData = getFilteredData()

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Cargando Datos...</h2>
          <p className="text-gray-500 dark:text-gray-400">Estamos preparando las estadísticas para usted.</p>
        </div>
      </div>
    )
  }

  // Calculate totals and trends with filtered data
  const totalEstudiantes = filteredData.reduce((sum, item) => sum + Number(item.estudiantes), 0)
  const totalCursos = filteredData.reduce((sum, item) => sum + Number(item.cursos), 0)
  const totalVideosVistos = filteredData.reduce((sum, item) => sum + Number(item.videos_vistos || 0), 0)
  const totalVideos = Math.max(...filteredData.map(item => Number(item.total_videos || 0))) || 0
  const avgEstudiantes = filteredData.length > 0 ? Math.round(totalEstudiantes / filteredData.length) : 0
  const avgCursos = filteredData.length > 0 ? Math.round(totalCursos / filteredData.length) : 0
  const avgVideosVistos = filteredData.length > 0 ? Math.round(totalVideosVistos / filteredData.length) : 0

  // Debug: Log calculations
  console.log('AdminStatsSection - Calculations:', {
    totalEstudiantes,
    totalCursos,
    avgEstudiantes,
    avgCursos,
    filteredDataLength: filteredData.length
  })

  // Calculate growth rates with filtered data - handle division by zero
  const estudiantesGrowth = filteredData.length > 1 && Number(filteredData[0].estudiantes) > 0
    ? ((Number(filteredData[filteredData.length - 1].estudiantes) - Number(filteredData[0].estudiantes)) / Number(filteredData[0].estudiantes) * 100).toFixed(1)
    : '0'
  const cursosGrowth = filteredData.length > 1 && Number(filteredData[0].cursos) > 0
    ? ((Number(filteredData[filteredData.length - 1].cursos) - Number(filteredData[0].cursos)) / Number(filteredData[0].cursos) * 100).toFixed(1)
    : '0'

  console.log('AdminStatsSection - Growth calculations:', {
    estudiantesGrowth,
    cursosGrowth,
    firstEstudiantes: filteredData[0]?.estudiantes,
    lastEstudiantes: filteredData[filteredData.length - 1]?.estudiantes,
    firstCursos: filteredData[0]?.cursos,
    lastCursos: filteredData[filteredData.length - 1]?.cursos
  })

  // Export function
  const handleExport = () => {
    // Prepare data for export with additional summary information
    const exportData = [
      { 'Métrica': 'Total Estudiantes', 'Valor': totalEstudiantes },
      { 'Métrica': 'Total Cursos', 'Valor': totalCursos },
      { 'Métrica': 'Total Videos Vistos', 'Valor': totalVideosVistos },
      { 'Métrica': 'Total Videos', 'Valor': totalVideos },
      { 'Métrica': 'Promedio Estudiantes por Mes', 'Valor': avgEstudiantes },
      { 'Métrica': 'Promedio Cursos por Mes', 'Valor': avgCursos },
      { 'Métrica': 'Crecimiento Estudiantes (%)', 'Valor': estudiantesGrowth },
      { 'Métrica': 'Crecimiento Cursos (%)', 'Valor': cursosGrowth },
      { 'Métrica': 'Periodo Analizado (meses)', 'Valor': filteredData.length },
      {}, // Empty row for separation
      ...filteredData.map(item => ({
        'Mes': item.month,
        'Estudiantes': item.estudiantes,
        'Cursos': item.cursos,
        'Videos Vistos': item.videos_vistos || 0,
        'Videos Totales': item.total_videos || 0
      }))
    ]

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas Formación 360')
    XLSX.writeFile(wb, `estadisticas_formacion360_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Prepare data for different chart types
  const getChartData = (): AdminChartData[] | PieDataItem[] => {
    switch (selectedChartType) {
      case 'bar':
        return filteredData
      case 'area':
        return filteredData
      case 'line':
        return filteredData
      case 'pie':
        return [
          { name: 'Estudiantes', value: totalEstudiantes, color: '#3b82f6' },
          { name: 'Cursos', value: totalCursos, color: '#10b981' }
        ]
      default:
        return filteredData
    }
  }

  const renderChart = () => {
    const data = getChartData()

    switch (selectedChartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data as AdminChartData[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px"
                }}
                formatter={(value, name) => [
                  `${value} ${name === 'estudiantes' ? 'estudiantes' : 'cursos'}`,
                  name === 'estudiantes' ? '👥 Estudiantes' : '📚 Cursos'
                ]}
              />
              <Bar dataKey="estudiantes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cursos" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data as AdminChartData[]}>
              <defs>
                <linearGradient id="estudiantesArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="cursosArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px"
                }}
                formatter={(value, name) => [
                  `${value} ${name === 'estudiantes' ? 'estudiantes' : 'cursos'}`,
                  name === 'estudiantes' ? '👥 Estudiantes' : '📚 Cursos'
                ]}
              />
              <Area type="monotone" dataKey="estudiantes" stroke="#3b82f6" fill="url(#estudiantesArea)" strokeWidth={3} />
              <Area type="monotone" dataKey="cursos" stroke="#10b981" fill="url(#cursosArea)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data as AdminChartData[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px"
                }}
                formatter={(value, name) => [
                  `${value} ${name === 'estudiantes' ? 'estudiantes' : 'cursos'}`,
                  name === 'estudiantes' ? '👥 Estudiantes' : '📚 Cursos'
                ]}
              />
              <Line type="monotone" dataKey="estudiantes" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 4 }} />
              <Line type="monotone" dataKey="cursos" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data as PieDataItem[]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {(data as PieDataItem[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} total`, name]}
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={data as AdminChartData[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px"
                }}
                formatter={(value, name) => [
                  `${value} ${name === 'estudiantes' ? 'estudiantes' : 'cursos'}`,
                  name === 'estudiantes' ? '👥 Estudiantes' : '📚 Cursos'
                ]}
              />
              <Bar dataKey="estudiantes" fill="url(#estudiantesGradient)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cursos" fill="url(#cursosGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="estudiantesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="cursosGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Últimos 3 meses</SelectItem>
                <SelectItem value="6months">Últimos 6 meses</SelectItem>
                <SelectItem value="12months">Últimos 12 meses</SelectItem>
                <SelectItem value="all">Todo el período</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <Select value={selectedChartType} onValueChange={setSelectedChartType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="combined">Barras Combinadas</SelectItem>
                <SelectItem value="bar">Solo Barras</SelectItem>
                <SelectItem value="area">Área Apilada</SelectItem>
                <SelectItem value="line">Líneas</SelectItem>
                <SelectItem value="pie">Circular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={showGrowth ? "default" : "outline"}
            size="sm"
            onClick={() => setShowGrowth(!showGrowth)}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Crecimiento
          </Button>
          <Button
            variant={showAverages ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAverages(!showAverages)}
          >
            <Target className="w-4 h-4 mr-1" />
            Promedios
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Estudiantes</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalEstudiantes || 0}</p>
                {showGrowth && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {Number(estudiantesGrowth) > 0 ? '+' : ''}{estudiantesGrowth}% crecimiento
                  </p>
                )}
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Cursos</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{totalCursos || 0}</p>
                {showGrowth && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {Number(cursosGrowth) > 0 ? '+' : ''}{cursosGrowth}% crecimiento
                  </p>
                )}
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {showAverages && (
          <>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Promedio Estudiantes</p>
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{avgEstudiantes || 0}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">por mes</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Promedio Cursos</p>
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{avgCursos || 0}</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">por mes</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {selectedChartType === 'pie' ? 'Distribución General' : 'Crecimiento Mensual Detallado'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderChart()}
            {selectedChartType !== 'pie' && (
              <div className="flex justify-center gap-6 mt-4">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Estudiantes</span>
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Cursos</span>
              </div>
            )}
            {selectedChartType === 'pie' && (
              <div className="flex justify-center gap-6 mt-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Estudiantes ({totalEstudiantes})</span>
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Cursos ({totalCursos})</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progreso de Cursos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={filteredData}>
                <defs>
                  <linearGradient id="estudiantesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="cursosGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="videosVistosGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="totalVideosGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.75rem",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px"
                  }}
                  formatter={(value, name) => [
                    `${value} ${name === 'estudiantes' ? 'estudiantes' : name === 'cursos' ? 'cursos' : name === 'videos_vistos' ? 'videos vistos' : name === 'total_videos' ? 'videos totales' : ''}`,
                    name === 'estudiantes' ? '👥 Estudiantes' : name === 'cursos' ? '📚 Cursos' : name === 'videos_vistos' ? '🎥 Videos Vistos' : name === 'total_videos' ? '📹 Videos Totales' : ''
                  ]}
                />
                <Bar dataKey="estudiantes" fill="url(#estudiantesGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cursos" fill="url(#cursosGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="videos_vistos" fill="url(#videosVistosGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total_videos" fill="url(#totalVideosGradient)" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Estudiantes ({totalEstudiantes})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Cursos ({totalCursos})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Videos Vistos ({totalVideosVistos})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Videos Totales ({totalVideos})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Periodo Analizado</p>
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{filteredData.length || 0} meses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-rose-500 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Actividad Promedio</p>
                <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                  {filteredData.length > 0 ? Math.round((totalEstudiantes + totalCursos) / filteredData.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Mejor Mes</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {filteredData.length > 0 ? filteredData.reduce((max, item) => Number(item.estudiantes) > Number(max.estudiantes) ? item : max, filteredData[0])?.month || 'N/A' : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminStatsSection
