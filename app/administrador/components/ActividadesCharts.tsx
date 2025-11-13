
'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import * as actividadesUtils from '../actividades/lib/actividadesUtils'

interface Actividad {
  id_actividad: number
  id_usuario: number
  tipo_actividad: string
  descripcion: string
  id_curso: number | null
  id_video: number | null
  user_agent: string | null
  fecha_actividad: string
  nombre_completo: string
  email: string
  curso_titulo: string | null
  video_titulo: string | null
}

interface Props {
  actividades: Actividad[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ActividadesCharts({ actividades }: Props) {
  const [chartType, setChartType] = useState('bar')
  const [dataOption, setDataOption] = useState('tipo')

  const chartData = useMemo(() => {
    if (dataOption === 'tipo') {
      return Object.entries(actividadesUtils.calcularEstadisticas(actividades).porTipo).map(([name, value]) => ({ name: actividadesUtils.formatTipoActividad(name), value }))
    } else if (dataOption === 'usuario') {
      const porUsuario = actividades.reduce((acc, actividad) => {
        acc[actividad.nombre_completo] = (acc[actividad.nombre_completo] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      return Object.entries(porUsuario).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
    }
    return []
  }, [actividades, dataOption])

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        )
      case 'line':
        return (
          <LineChart width={500} height={300} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
          </LineChart>
        )
      case 'pie':
        return (
          <PieChart width={500} height={300}>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Visualización de Actividades</CardTitle>
          <CardDescription>Seleccione un tipo de gráfico y datos para visualizar.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={dataOption} onValueChange={setDataOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Datos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tipo">Actividades por Tipo</SelectItem>
              <SelectItem value="usuario">Top 10 Usuarios Activos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Gráfico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Barras</SelectItem>
              <SelectItem value="line">Líneas</SelectItem>
              <SelectItem value="pie">Circular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  )
}
