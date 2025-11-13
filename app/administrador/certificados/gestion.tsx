'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import CertificadoTable from './components/CertificadoTable'
import CertificadoFormModal from './components/CertificadoFormModal'

interface Certificado {
  id_certificado: number;
  fecha_emision: string;
  codigo_certificado: string;
  nombre_usuario: string;
  titulo_curso: string;
}

interface User {
    id_usuario: number;
    nombre_completo: string;
}

interface Curso {
    id_curso: number;
    titulo: string;
}

const INITIAL_FORM_DATA = {
  id_usuario: '',
  id_curso: '',
};

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true);
    try {
      const [certsRes, usersRes, cursosRes] = await Promise.all([
        fetch('http://localhost:3001/certificados'),
        fetch('http://localhost:3001/usuarios'),
        fetch('http://localhost:3001/cursos')
      ]);

      if (certsRes.ok) setCertificados(await certsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (cursosRes.ok) setCursos(await cursosRes.json());

    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(INITIAL_FORM_DATA);
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_usuario || !formData.id_curso) {
        alert('Por favor, seleccione un usuario y un curso.');
        return;
    }

    try {
      const response = await fetch('http://localhost:3001/certificados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_usuario: parseInt(formData.id_usuario),
            id_curso: parseInt(formData.id_curso),
            codigo_certificado: `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase(),
        }),
      });

      if (response.ok) {
        alert('Certificado generado exitosamente');
        handleCloseModal();
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Error al generar certificado: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      alert('Error de conexión al generar certificado');
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este certificado? Esta acción no se puede deshacer.')) return;

    try {
      const response = await fetch(`http://localhost:3001/certificados/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Certificado eliminado');
        fetchData();
      } else {
        alert('Error al eliminar el certificado');
      }
    } catch (error) {
      alert('Error de conexión al eliminar');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Certificados</h1>
                <p className="mt-2 text-sm text-gray-600">Administra los certificados de los estudiantes</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>Generar Certificado</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
            <p>Cargando certificados...</p>
        ) : (
            <CertificadoTable certificados={certificados} onDelete={handleDelete} />
        )}
      </main>

      <CertificadoFormModal
        isOpen={isModalOpen}
        formData={formData}
        users={users}
        cursos={cursos}
        onClose={handleCloseModal}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}