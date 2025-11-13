import React from 'react';

interface Categoria {
    id_categoria: number;
    nombre: string;
}

interface FormData {
  titulo: string;
  descripcion: string;
  imagen_url: string;
  id_categoria: number | string;
  precio: number | string;
  estado: 'borrador' | 'activo' | 'inactivo';
}

interface CursoFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: FormData;
  categorias: Categoria[];
  onClose: () => void;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CursoFormModal: React.FC<CursoFormModalProps> = ({
  isOpen,
  isEditing,
  formData,
  categorias,
  onClose,
  onFormChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {isEditing ? 'Editar Curso' : 'Agregar Curso'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" name="titulo" value={formData.titulo} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={onFormChange} required rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
            <input type="text" name="imagen_url" value={formData.imagen_url} onChange={onFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select name="id_categoria" value={formData.id_categoria} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="">Seleccione una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input type="number" name="precio" value={formData.precio} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select name="estado" value={formData.estado} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="borrador">Borrador</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CursoFormModal;
