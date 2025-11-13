'use client'

import { descargarCertificado } from '../../../administrador/certificados/utils/certificadosUtils'

interface CertificateDownloadProps {
  certificate: {
    id_certificado: number;
    fecha_emision: string;
    codigo_certificado: string;
    nombre_certificado?: string;
    curso_titulo: string;
    curso_descripcion?: string;
  };
  studentName: string;
}

export default function CertificateDownload({ certificate, studentName }: CertificateDownloadProps) {
  const handleDownload = async () => {
    await descargarCertificado(
      studentName,
      certificate.curso_titulo,
      certificate.codigo_certificado,
      certificate.fecha_emision,
      certificate.nombre_certificado
    );
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Descargar Certificado
    </button>
  );
}
