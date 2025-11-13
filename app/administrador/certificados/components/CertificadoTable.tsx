import React from 'react';
import { Button } from '@/components/ui/button';

interface Certificado {
  id_certificado: number;
  fecha_emision: string;
  codigo_certificado: string;
  nombre_usuario: string; // Assuming the backend joins this
  titulo_curso: string;   // Assuming the backend joins this
}

interface CertificadoTableProps {
  certificados: Certificado[];
  onDelete: (id: number) => void;
}

const CertificadoTable: React.FC<CertificadoTableProps> = ({ certificados, onDelete }) => {
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Emisión</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {certificados.map((certificado) => (
            <tr key={certificado.id_certificado}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{certificado.nombre_usuario}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificado.titulo_curso}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(certificado.fecha_emision)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{certificado.codigo_certificado}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                  // Importar certificadosUtils dinámicamente o usar una función global
                  import('../utils/certificadosUtils').then(utils => {
                    utils.descargarCertificado(
                      certificado.nombre_usuario,
                      certificado.titulo_curso,
                      certificado.codigo_certificado,
                      certificado.fecha_emision
                    );
                  });
                }}>
                  Descargar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(certificado.id_certificado)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificadoTable;
