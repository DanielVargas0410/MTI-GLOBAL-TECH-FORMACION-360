'use client'
import React, { useState } from 'react'
import { Course } from '@/components/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ArrowRight, KeyRound, Loader2 } from 'lucide-react'
import Swal from 'sweetalert2'

type NewCoursesSectionProps = {
  courses: Course[]
  onCourseSelect: (courseId: number) => void
  onCourseActivated: () => void; // Callback to refresh data
}

export default function NewCoursesSection({ courses, onCourseSelect, onCourseActivated }: NewCoursesSectionProps) {
  const [activationCodes, setActivationCodes] = useState<{ [key: number]: string }>({});
  const [loadingActivation, setLoadingActivation] = useState<number | null>(null);
  const [errorActivation, setErrorActivation] = useState<{ [key: number]: string | null }>({});

  const handleActivationCodeChange = (courseId: number, code: string) => {
    setActivationCodes(prev => ({ ...prev, [courseId]: code.toUpperCase() }));
  };

  const handleActivateCourse = async (courseId: number) => {
    const code = activationCodes[courseId];
    if (!code) {
      setErrorActivation(prev => ({ ...prev, [courseId]: 'El código no puede estar vacío.' }));
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.id_usuario) {
      Swal.fire('Error', 'No se pudo verificar la sesión de usuario.', 'error');
      return;
    }

    setLoadingActivation(courseId);
    setErrorActivation(prev => ({ ...prev, [courseId]: null }));

    try {
      const response = await fetch('http://localhost:3001/cursos-estudiante/activar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: user.id_usuario, codigo_activacion: code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al activar el curso.');
      }

      Swal.fire('¡Éxito!', 'Curso activado correctamente.', 'success');
      onCourseActivated(); // Refresh data in parent component

    } catch (err: any) {
      const errorMessage = err.message || 'Ocurrió un error inesperado.';
      setErrorActivation(prev => ({ ...prev, [courseId]: errorMessage }));
      Swal.fire('Error de Activación', errorMessage, 'error');
    } finally {
      setLoadingActivation(null);
    }
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Mis Cursos</h2>
        <p className="text-muted-foreground">Continúa donde lo dejaste y sigue aprendiendo.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => {
          const imageUrl = course.imagen_url ? course.imagen_url : '/placeholder.jpg';

          if (course.estado === 'pendiente') {
            return (
              <Card key={course.id_curso} className="flex flex-row overflow-hidden transition-shadow hover:shadow-md bg-primary/5 border-primary/20">
                <div className="w-1/3 flex-shrink-0 relative">
                  <img src={imageUrl} alt={course.titulo} className="w-full h-full object-cover filter grayscale" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                     <KeyRound className="w-8 h-8 text-white/70" />
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                        <Badge variant={'destructive'}>Pendiente de Activación</Badge>
                        <CardTitle className="text-md font-semibold mt-2">{course.titulo}</CardTitle>
                    </div>
                    <div className="space-y-2 mt-4">
                        <Input
                          type="text"
                          placeholder="CÓDIGO DE ACTIVACIÓN"
                          value={activationCodes[course.id_curso] || ''}
                          onChange={(e) => handleActivationCodeChange(course.id_curso, e.target.value)}
                          className="text-center tracking-widest font-mono h-9"
                        />
                        <Button
                          className="w-full h-9"
                          onClick={() => handleActivateCourse(course.id_curso)}
                          disabled={loadingActivation === course.id_curso}
                        >
                          {loadingActivation === course.id_curso ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Activando...</>
                          ) : 'Activar'}
                        </Button>
                        {errorActivation[course.id_curso] && (
                            <p className="text-red-500 text-xs text-center">{errorActivation[course.id_curso]}</p>
                        )}
                    </div>
                </div>
              </Card>
            );
          }

          return (
            <Card key={course.id_curso} className="flex flex-row overflow-hidden transition-shadow hover:shadow-md">
                <div className="w-1/3 flex-shrink-0 bg-slate-100">
                    <img src={imageUrl} alt={course.titulo} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-md font-semibold line-clamp-2">{course.titulo}</CardTitle>
                            <Badge variant={course.estado === 'completado' ? 'default' : 'secondary'}>
                                {course.estado.charAt(0).toUpperCase() + course.estado.slice(1)}
                            </Badge>
                        </div>
                        <CardDescription className="text-xs line-clamp-2 mt-1">{course.descripcion}</CardDescription>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-muted-foreground">PROGRESO</span>
                            <span className="text-xs font-bold text-primary">{Math.round(course.progreso || 0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progreso || 0}%` }}></div>
                        </div>
                        <Button
                          className="w-full mt-4 h-9"
                          onClick={() => onCourseSelect(course.id_curso)}
                        >
                          Continuar Curso <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
          );
        })}
      </div>
    </section>
  )
}