'use client'
import React, { useState, useEffect } from 'react'
import { Course } from '@/components/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type NewRecommendationsSectionProps = {}

export default function NewRecommendationsSection({}: NewRecommendationsSectionProps) {
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/cursos');
        if (response.ok) {
          const data = await response.json();
          const activeCourses = data.filter((course: Course) => course.estado === 'activo');
          setAllCourses(activeCourses);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchAllCourses();
  }, []);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Cursos Disponibles</h2>
        <p className="text-muted-foreground">Explora todos nuestros cursos y encuentra tu proximo desafio.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCourses.map((course) => (
          <Card key={course.id_curso} className="flex flex-col bg-gradient-to-br from-card to-muted/40 hover:to-muted/60 transition-all">
            <CardHeader>
                <div className="relative w-full h-40 mb-4">
                    <Image
                        src={course.imagen_url || '/placeholder.jpg'}
                        alt={course.titulo}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{course.titulo}</CardTitle>
                    <Badge variant="secondary">Disponible</Badge>
                </div>
                <CardDescription className="text-sm line-clamp-2">{course.descripcion}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <Button asChild variant="outline" className="w-full mt-4 bg-transparent border-primary/50 hover:bg-primary/10">
                    <Link href={`/estudiante/cursos/${course.id_curso}`}>
                        Ver Curso <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
