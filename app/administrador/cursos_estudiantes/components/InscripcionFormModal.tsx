import React from 'react';

interface User {
    id_usuario: number;
    nombre_completo: string;
}

interface Curso {
    id_curso: number;
    titulo: string;
}

interface FormData {
  id_usuario: number | string;
  id_curso: number | string;
}

interface InscripcionFormModalProps {
  isOpen: boolean;
  formData: FormData;
  users: User[];
  cursos: Curso[];
  onClose: () => void;
  onFormChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const InscripcionFormModal: React.FC<InscripcionFormModalProps> = ({
  isOpen,
  formData,
  users,
  cursos,
  onClose,
  onFormChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Inscribir Estudiante a un Curso
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Estudiante</label>
            <select name="id_usuario" value={formData.id_usuario} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione un estudiante</option>
              {users.map(user => (
                <option key={user.id_usuario} value={user.id_usuario}>{user.nombre_completo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Curso</label>
            <select name="id_curso" value={formData.id_curso} onChange={onFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Seleccione un curso</option>
              {cursos.map(curso => (
                <option key={curso.id_curso} value={curso.id_curso}>{curso.titulo}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Inscribir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InscripcionFormModal;
