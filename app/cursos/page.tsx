"use client";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React from 'react';

interface Curso {
  id_curso: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
}

async function getCursos(): Promise<Curso[]> {
  try {
    const res = await fetch('http://localhost:3001/cursos', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch cursos');
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching courses for catalog:", error);
    return []; // Return empty array on error
  }
}

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = React.useState<Curso[]>([]);

  React.useEffect(() => {
    getCursos().then(setCursos);
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <div className="text-center flex-grow">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Catálogo de Cursos</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            Explora nuestra oferta educativa y encuentra el curso perfecto para ti.
          </p>
        </div>
        <Button onClick={handleBack}>Volver Atrás</Button>
      </div>

      {cursos.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursos.map((curso) => (
            <Link key={curso.id_curso} href={`/cursos/${curso.id_curso}`} passHref>
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-video relative">
                    <Image
                      src={curso.imagen_url || '/placeholder.jpg'}
                      alt={curso.titulo}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <CardTitle className="text-xl font-bold mb-2">{curso.titulo}</CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-3 flex-grow whitespace-pre-wrap">
                    {curso.descripcion}
                  </CardDescription>
                  <div className="mt-4 text-primary font-semibold">
                    Ver detalles &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No hay cursos disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
}
