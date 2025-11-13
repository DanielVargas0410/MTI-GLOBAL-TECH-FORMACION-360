'use client'

import React, { useState } from 'react'
import { StudentData, ActivityItem, Course } from '@/components/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Phone, MapPin, CalendarDays, LogIn, BookOpen, Video, CheckCircle } from 'lucide-react'
import EditProfile from '@/app/estudiante/perfil/EditProfile'

type NewProfileSectionProps = {
  student: StudentData
  activity: ActivityItem[] // This will be ignored
  courses: Course[]
  videos: any[]
  onProfileUpdate: () => void
}

export default function NewProfileSection({ student, courses, videos, onProfileUpdate }: NewProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  // Updated statistics logic based on progress
  const coursesInProgress = courses.filter(course => parseFloat(course.progreso as any) > 0 && parseFloat(course.progreso as any) < 100).length;
  const coursesCompleted = courses.filter(course => parseFloat(course.progreso as any) === 100).length;

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <Card className="bg-card text-card-foreground shadow-lg">
        <CardHeader className="text-center p-6">
          <Avatar className="w-28 h-28 mx-auto ring-4 ring-primary/20 shadow-md">
            <AvatarImage src={student.avatar ? `http://localhost:3001${student.avatar}` : undefined} />
            <AvatarFallback className="text-4xl bg-primary/10 text-primary">
              {student.nombre_completo.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-3xl font-bold">{student.nombre_completo}</CardTitle>
          <p className="text-muted-foreground text-lg">{student.email}</p>
        </CardHeader>
        <CardContent className="p-6">
          {!isEditing ? (
            <>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsEditing(true)}
                  className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Editar Perfil
                </button>
              </div>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-md">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Teléfono:</span> {student.telefono || 'No especificado'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Ciudad:</span> {student.ciudad || 'No especificado'}, {student.pais}
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:col-span-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Dirección:</span> {student.direccion || 'No especificado'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Miembro desde:</span> {formatDate(student.fecha_registro)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LogIn className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Último acceso:</span> {formatDate(student.fecha_ultimo_acceso)}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <EditProfile student={student} onUpdate={() => { onProfileUpdate(); setIsEditing(false); }} />
              <button
                onClick={() => setIsEditing(false)}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md"
              >
                Cancelar
              </button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Mis Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md font-medium">Cursos en Progreso</CardTitle>
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{coursesInProgress}</div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md font-medium">Cursos Completados</CardTitle>
                    <CheckCircle className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{coursesCompleted}</div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md font-medium">Total de Videos</CardTitle>
                    <Video className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{videos.length}</div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
