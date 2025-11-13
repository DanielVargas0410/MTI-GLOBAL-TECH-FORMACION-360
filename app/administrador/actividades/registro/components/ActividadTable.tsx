import React from 'react';
import { formatTipoActividad, formatFechaRelativa } from '../lib/actividadesUtils';

interface Actividad {
  id_actividad: number;
  fecha_actividad: string;
  tipo_actividad: string;
  descripcion: string;
  nombre_usuario: string;
  email_usuario: string;
}

interface ActividadTableProps {
  actividades: Actividad[];
}

const ActividadTable: React.FC<ActividadTableProps> = ({ actividades }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {actividades.map((actividad) => (
            <tr key={actividad.id_actividad}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{actividad.nombre_usuario}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{actividad.email_usuario}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {formatTipoActividad(actividad.tipo_actividad)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{actividad.descripcion}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" title={new Date(actividad.fecha_actividad).toLocaleString()}>
                {formatFechaRelativa(actividad.fecha_actividad)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActividadTable;
