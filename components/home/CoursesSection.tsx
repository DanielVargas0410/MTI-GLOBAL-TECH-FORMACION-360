import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Course {
  id_curso: number;
  titulo: string;
  descripcion: string | null;
  imagen_url: string | null;
  precio: number;
  estado: 'borrador' | 'activo' | 'inactivo';
  categoria_nombre?: string;
}

async function fetchCourses() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    const response = await fetch(`${backendUrl}/cursos`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error("Error al cargar cursos");
    }
    const data = await response.json();

    // Parse price to number and remove unnecessary fields
    return data.map(({ codigo_acceso, precio, ...rest }: any) => ({
      ...rest,
      precio: typeof precio === 'string' ? parseFloat(precio) : precio,
    }));

  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function CoursesSection() {
  const courses: Course[] = await fetchCourses();

  return (
    <section id="courses" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-300">Cursos Destacados</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nuestros Cursos Populares</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Explora nuestra selección de cursos diseñados para impulsar tu carrera con contenido actualizado y práctico.
          </p>
        </div>

        <div className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl">
          {courses.filter(c => c.estado === 'activo').slice(0, 3).map((course) => (
            <Card key={course.id_curso} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-0">
                    <Link href={`/cursos/${course.id_curso}`} passHref>
                        <div className="aspect-video relative block">
                            <img
                            alt={course.titulo}
                            className="aspect-video w-full object-cover"
                            src={course.imagen_url || "/placeholder.svg"}
                            />
                        </div>
                    </Link>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{course.categoria_nombre || 'General'}</Badge>
                            {course.precio > 0 && <div className="font-bold text-lg text-primary">${course.precio.toFixed(2)}</div>}
                        </div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.titulo}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{course.descripcion}</p>
                        <Button asChild className="w-full">
                            <Link href={`/cursos/${course.id_curso}`}>
                                Ver Curso
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
            <Button asChild size="lg">
                <Link href="/cursos">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explorar Todos los Cursos
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
