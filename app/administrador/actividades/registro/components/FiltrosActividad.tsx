import React from 'react';
import { TIPOS_ACTIVIDAD, formatTipoActividad } from '../lib/actividadesUtils';

interface Filtros {
  searchTerm: string;
  tipoActividad: string;
  fechaDesde: string;
  fechaHasta: string;
}

interface FiltrosActividadProps {
  filtros: Filtros;
  onFiltroChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onResetFiltros: () => void;
}

const FiltrosActividad: React.FC<FiltrosActividadProps> = ({ filtros, onFiltroChange, onResetFiltros }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="searchTerm"
          placeholder="Buscar por usuario, curso..."
          value={filtros.searchTerm}
          onChange={onFiltroChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <select
          name="tipoActividad"
          value={filtros.tipoActividad}
          onChange={onFiltroChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Todos los tipos</option>
          {Object.values(TIPOS_ACTIVIDAD).map(tipo => (
            <option key={tipo} value={tipo}>{formatTipoActividad(tipo)}</option>
          ))}
        </select>
        <input
          type="date"
          name="fechaDesde"
          value={filtros.fechaDesde}
          onChange={onFiltroChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          type="date"
          name="fechaHasta"
          value={filtros.fechaHasta}
          onChange={onFiltroChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={onResetFiltros} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default FiltrosActividad;
