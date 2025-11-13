import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Inscripcion {
  id_curso_estudiante: number;
  fecha_activacion: string;
  progreso: number;
  estado: string;
  nombre_usuario: string;
  titulo_curso: string;
}

interface InscripcionesTableProps {
  inscripciones: Inscripcion[];
  onDelete: (id: number) => void;
}

const InscripcionesTable: React.FC<InscripcionesTableProps> = ({ inscripciones, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Inscripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progreso</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inscripciones.map((inscripcion) => (
            <tr key={inscripcion.id_curso_estudiante}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inscripcion.nombre_usuario}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inscripcion.titulo_curso}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(inscripcion.fecha_activacion)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <span className="mr-2 text-sm">{inscripcion.progreso}%</span>
                    <Progress value={inscripcion.progreso} className="w-32" />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  inscripcion.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {inscripcion.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(inscripcion.id_curso_estudiante)}
                >
                  Anular Inscripción
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InscripcionesTable;
