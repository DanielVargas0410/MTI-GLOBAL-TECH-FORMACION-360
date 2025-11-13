import CourseDetailClient from './CourseDetailClient';

// Types
interface CourseData { id_curso: number; titulo: string; descripcion: string; imagen_url: string; modulos: any[]; }

async function getCourseDetail(id: string): Promise<CourseData | null> {
  try {
    const res = await fetch(`http://localhost:3001/cursos/${id}/detail`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Error fetching course ${id}:`, res.statusText);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch course detail:", error);
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourseDetail(params.id);

  if (!course) {
    return <div className="container text-center py-20"><h2>Curso no encontrado</h2><p>No pudimos cargar los detalles del curso. Por favor, intenta de nuevo más tarde.</p></div>;
  }

  return <CourseDetailClient course={course} />;
}
