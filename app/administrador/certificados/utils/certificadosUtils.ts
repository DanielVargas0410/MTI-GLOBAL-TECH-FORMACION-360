interface CertificadoFormData {
  id_usuario: string;
  id_curso: string;
  codigo_certificado: string;
  nombre_certificado: string;
  estado: string;
}

interface ValidationResult {
  esValido: boolean;
  errores: string[];
}

export const validarCertificado = (formData: CertificadoFormData): ValidationResult => {
  const errores: string[] = [];

  if (!formData.id_usuario || formData.id_usuario.trim() === '') {
    errores.push('El ID de usuario es requerido');
  }

  if (!formData.id_curso || formData.id_curso.trim() === '') {
    errores.push('El ID del curso es requerido');
  }

  if (!formData.nombre_certificado || formData.nombre_certificado.trim() === '') {
    errores.push('El nombre del certificado es requerido');
  }

  if (!formData.codigo_certificado || formData.codigo_certificado.trim() === '') {
    errores.push('El código del certificado es requerido');
  } else if (formData.codigo_certificado.length < 5) {
    errores.push('El código del certificado debe tener al menos 5 caracteres');
  }

  if (!['activo', 'revocado'].includes(formData.estado)) {
    errores.push('El estado debe ser "activo" o "revocado"');
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};

export const generarCodigoCertificado = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${random}`.toUpperCase();
};

export const formatEstadoCertificado = (estado: string): string => {
  return estado === 'activo' ? 'Activo' : 'Revocado';
};

export const formatFechaEmision = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generarCertificadoPDF = async (
  nombreUsuario: string,
  tituloCurso: string,
  codigoCertificado: string,
  fechaEmision: string
): Promise<void> => {
  // Esta función se implementará con jsPDF o similar
  // Por ahora, solo muestra un alert
  alert(`Generando certificado PDF para ${nombreUsuario} - ${tituloCurso}`);
};

export const descargarCertificado = async (
  nombreUsuario: string,
  tituloCurso: string,
  codigoCertificado: string,
  fechaEmision: string,
  nombreCertificado?: string
): Promise<void> => {
  try {
    // Importar jsPDF dinámicamente
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    // Crear un elemento HTML temporal para el certificado
    const certificadoDiv = document.createElement('div');
    certificadoDiv.style.width = '1200px';
    certificadoDiv.style.height = '800px';
    certificadoDiv.style.position = 'absolute';
    certificadoDiv.style.left = '-9999px';
    certificadoDiv.style.top = '-9999px';
    certificadoDiv.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
    certificadoDiv.style.border = '8px solid #ffd700';
    certificadoDiv.style.borderRadius = '20px';
    certificadoDiv.style.padding = '40px';
    certificadoDiv.style.boxSizing = 'border-box';
    certificadoDiv.style.fontFamily = 'Georgia, serif';
    certificadoDiv.style.display = 'flex';
    certificadoDiv.style.flexDirection = 'column';
    certificadoDiv.style.justifyContent = 'space-between';
    certificadoDiv.style.alignItems = 'center';
    certificadoDiv.style.textAlign = 'center';

    // Contenido del certificado
    certificadoDiv.innerHTML = `
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div style="font-size: 48px; font-weight: bold; color: #1a365d; margin-bottom: 20px;">
          🏆 FORMACIÓN 360
        </div>

        <div style="font-size: 32px; font-style: italic; color: #2d3748; margin-bottom: 40px;">
          Certificado de Excelencia Académica
        </div>

        <div style="font-size: 24px; color: #4a5568; margin-bottom: 30px;">
          La Dirección Académica certifica que
        </div>

        <div style="font-size: 42px; font-weight: bold; color: #1a202c; margin-bottom: 30px; text-transform: uppercase;">
          ${nombreCertificado || nombreUsuario}
        </div>

        <div style="font-size: 24px; color: #4a5568; margin-bottom: 30px;">
          ha completado satisfactoriamente el curso de
        </div>

        <div style="font-size: 36px; font-weight: bold; color: #2b6cb0; margin-bottom: 40px;">
          "${tituloCurso}"
        </div>

        <div style="font-size: 20px; color: #718096; margin-bottom: 10px;">
          Código de Verificación: ${codigoCertificado}
        </div>

        <div style="font-size: 20px; color: #718096; margin-bottom: 40px;">
          Fecha de Emisión: ${formatFechaEmision(fechaEmision)}
        </div>

        <div style="font-size: 22px; font-style: italic; color: #38a169;">
          ¡Felicitaciones por tu dedicación y esfuerzo!
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 40px;">
        <div style="text-align: center;">
          <div style="border-top: 2px solid #2d3748; width: 250px; margin: 0 auto 10px;"></div>
          <div style="font-size: 20px; color: #2d3748;">Director Académico</div>
        </div>

        <div style="text-align: center;">
          <div style="border-top: 2px solid #2d3748; width: 250px; margin: 0 auto 10px;"></div>
          <div style="font-size: 20px; color: #2d3748;">Sello Institucional</div>
        </div>
      </div>
    `;

    // Agregar al DOM temporalmente
    document.body.appendChild(certificadoDiv);

    // Convertir a canvas usando html2canvas
    const canvas = await html2canvas(certificadoDiv, {
      width: 1200,
      height: 800,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Remover el elemento temporal
    document.body.removeChild(certificadoDiv);

    // Crear PDF horizontal (landscape)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1200, 800]
    });

    // Agregar la imagen al PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, 1200, 800);

    // Descargar el PDF
    pdf.save(`certificado-${codigoCertificado}.pdf`);

  } catch (error) {
    console.error('Error al generar el certificado PDF:', error);
    alert('Error al generar el certificado. Por favor, inténtalo de nuevo.');
  }
};

export default {
  validarCertificado,
  generarCodigoCertificado,
  formatEstadoCertificado,
  formatFechaEmision,
  generarCertificadoPDF,
  descargarCertificado
};
