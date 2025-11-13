import React from 'react';

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
}

interface CategoryTableProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categorias, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categorias.map((categoria) => (
            <tr key={categoria.id_categoria}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{categoria.id_categoria}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categoria.nombre}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{categoria.descripcion}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categoria.estado}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(categoria)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(categoria.id_categoria)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
