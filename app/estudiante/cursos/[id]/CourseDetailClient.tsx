'use client';

import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Video, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PurchaseInterestForm from '@/app/estudiante/components/PurchaseInterestForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Types
interface VideoData { id_video: number; titulo: string; }
interface ModuleData { id_modulo: number; titulo: string; descripcion: string; videos: VideoData[]; }
interface CourseData { id_curso: number; titulo: string; descripcion: string; imagen_url: string; modulos: ModuleData[]; }

export default function CourseDetailClient({ course }: { course: CourseData }) {
  const router = useRouter();

  if (!course) {
    return <div className="container text-center py-20">Curso no encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Botón Atrás */}
      <div className="mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.back()} // También puedes usar: router.push('/estudiante/cursos')
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Columna Izquierda: Contenido del curso */}
        <div className="lg:col-span-3">
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">{course.titulo}</h1>
            <p className="text-xl leading-8 text-muted-foreground whitespace-pre-wrap">{course.descripcion}</p>

            <h2 className="mt-12 text-3xl font-bold">Temario del Curso</h2>
            <Accordion type="single" collapsible className="w-full mt-6" defaultValue="item-0">
              {course.modulos.map((module, index) => (
                <AccordionItem value={`item-${index}`} key={module.id_modulo}>
                  <AccordionTrigger className="text-xl font-semibold">
                    <div className="flex items-center gap-3">
                      <Badge>{`Módulo ${index + 1}`}</Badge>
                      <span>{module.titulo}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p className="text-base text-muted-foreground mb-4 whitespace-pre-wrap">{module.descripcion}</p>
                    <ul className="space-y-2">
                      {module.videos.map((video) => (
                        <li key={video.id_video} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                          <Video className="w-5 h-5 text-primary" />
                          <span className="font-medium">{video.titulo}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Columna Derecha: Imagen y Acción */}
        <div className="lg:col-span-2 lg:sticky top-24 h-fit">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video relative rounded-t-lg overflow-hidden">
                <Image
                  src={course.imagen_url || '/placeholder.jpg'}
                  alt={course.titulo}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">¿Interesado en este curso?</h3>
                <PurchaseInterestForm course={course} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
