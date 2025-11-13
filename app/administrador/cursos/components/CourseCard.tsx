import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrecio, getEstadoColor } from '../lib/cursosUtils';
import styles from '../styles/cursos.module.css';

interface Curso {
  id_curso: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  codigo_acceso: string;
  id_categoria: number;
  precio: number;
  estado: 'borrador' | 'activo' | 'inactivo';
  categoria_nombre: string;
}

interface CourseCardProps {
  curso: Curso;
  onEdit: (curso: Curso) => void;
  onDelete: (id: number) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ curso, onEdit, onDelete }) => {
  return (
    <Card className={styles.cursoCard}>
      <CardHeader>
        <CardTitle className="text-lg">{curso.titulo}</CardTitle>
        <div className="flex justify-between items-center">
          <Badge variant="outline">{curso.categoria_nombre}</Badge>
          <span className={`${styles.precioBadge} text-sm`}>
            {formatPrecio(curso.precio)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden">{curso.descripcion}</p>
        <div className="flex justify-between items-center mb-4">
          <Badge className={styles[getEstadoColor(curso.estado)]}>
            {curso.estado}
          </Badge>
          <span className="text-sm text-gray-500">Código: {curso.codigo_acceso}</span>
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(curso)}>Editar</Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(curso.id_curso)}>Eliminar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
