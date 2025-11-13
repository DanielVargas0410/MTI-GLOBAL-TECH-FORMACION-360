'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { filtrarModulosPorEstado, ordenarModulosPorOrden } from './lib/modulosUtils'
import ModuloCard from './components/ModuloCard'
import ModuloFormModal from './components/ModuloFormModal'

interface Modulo {
  id_modulo: number;
  titulo: string;
  descripcion: string;
  id_curso: number;
  numero_orden: number;
  estado: 'activo' | 'inactivo';
  curso_titulo: string;
}

interface Curso {
    id_curso: number;
    titulo: string;
}

const INITIAL_FORM_DATA = {
  titulo: '',
  descripcion: '',
  id_curso: '',
  numero_orden: '',
  estado: 'activo' as 'activo' | 'inactivo',
};

export default function ModulosPage() {
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>('activo')
  
  const [editingModulo, setEditingModulo] = useState<Modulo | null>(null)
  const [addingModulo, setAddingModulo] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true);
    try {
      const [modulosRes, cursosRes] = await Promise.all([
        fetch('http://localhost:3001/modulos'),
        fetch('http://localhost:3001/cursos')
      ]);
      
      if (modulosRes.ok) {
        const modulosData = await modulosRes.json();
        setModulos(ordenarModulosPorOrden(modulosData));
      } else {
        alert('Error al cargar módulos');
      }

      if (cursosRes.ok) {
        const cursosData = await cursosRes.json();
        setCursos(cursosData);
      } else {
        alert('Error al cargar cursos');
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (modulo: Modulo) => {
    setEditingModulo(modulo);
    setFormData({
        ...modulo,
        numero_orden: String(modulo.numero_orden),
        id_curso: String(modulo.id_curso),
    });
  }

  const handleAdd = () => {
    setAddingModulo(true);
    setFormData(INITIAL_FORM_DATA);
  }
  
  const handleCloseModal = () => {
    setEditingModulo(null);
    setAddingModulo(false);
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingModulo 
      ? `http://localhost:3001/modulos/${editingModulo.id_modulo}` 
      : 'http://localhost:3001/modulos';
    
    const method = editingModulo ? 'PUT' : 'POST';

    const body = {
        ...formData,
        numero_orden: parseInt(String(formData.numero_orden)),
        id_curso: parseInt(String(formData.id_curso)),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert(editingModulo ? 'Módulo actualizado' : 'Módulo creado');
        handleCloseModal();
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      alert('Error de conexión al guardar');
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este módulo?')) return;

    try {
      const response = await fetch(`http://localhost:3001/modulos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Módulo eliminado');
        fetchData();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      alert('Error de conexión al eliminar');
    }
  }

  const modulosFiltrados = filtrarModulosPorEstado(modulos, filtroEstado);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Módulos</h1>
                <p className="mt-2 text-sm text-gray-600">Administra los módulos de los cursos</p>
            </div>
            <Button onClick={handleAdd}>Agregar Módulo</Button>
          </div>
          <div className="mt-4">
            <label className="mr-2">Filtrar por estado:</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
            <p>Cargando módulos...</p>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modulosFiltrados.map((modulo) => (
                    <ModuloCard key={modulo.id_modulo} modulo={modulo} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
                </div>
                {modulosFiltrados.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                    No hay módulos disponibles con el filtro seleccionado.
                </p>
                )}
            </>
        )}
      </main>

      <ModuloFormModal 
        isOpen={!!editingModulo || addingModulo}
        isEditing={!!editingModulo}
        formData={formData}
        cursos={cursos}
        onClose={handleCloseModal}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}