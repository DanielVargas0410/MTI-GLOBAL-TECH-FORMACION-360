import React from 'react';

interface Curso {
    id_curso: number;
    titulo: string;
}

interface FormData {
  titulo: string;
  descripcion: string;
  id_curso: number | string;
  numero_orden: number | string;
  estado: 'activo' | 'inactivo';
}

interface ModuloFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: FormData;
  cursos: Curso[];
  onClose: () => void;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ModuloFormModal: React.FC<ModuloFormModalProps> = ({
  isOpen,
  isEditing,
  formData,
  cursos,
  onClose,
  onFormChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {isEditing ? 'Editar Módulo' : 'Agregar Módulo'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" name="titulo" value={formData.titulo} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={onFormChange}
              required
              rows={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm whitespace-pre-wrap"
              placeholder="Describe el módulo. Puedes usar espacios, bullet points (- item) o presionar Enter para nuevas líneas."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Curso</label>
              <select name="id_curso" value={formData.id_curso} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="">Seleccione un curso</option>
                {cursos.map(curso => (
                  <option key={curso.id_curso} value={curso.id_curso}>{curso.titulo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Orden</label>
              <input type="number" name="numero_orden" value={formData.numero_orden} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select name="estado" value={formData.estado} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
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

export default ModuloFormModal;
