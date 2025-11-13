'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award } from 'lucide-react'
import CertificateDownload from './CertificateDownload'

type NewCertificatesSectionProps = {
  certificates: any[]
  studentName?: string
}

export default function NewCertificatesSection({ certificates, studentName = '' }: NewCertificatesSectionProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Mis Certificados</h2>
        <p className="text-muted-foreground">Aquí puedes ver y descargar todos los certificados que has obtenido.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          {certificates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Sin Certificados</h3>
              <p className="mt-1 text-sm text-muted-foreground">Completa cursos para obtener tus certificados.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {certificates.map((cert) => (
                <li key={cert.id_certificado} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-4">
                    <Award className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{cert.curso_titulo}</p>
                      <p className="text-sm text-muted-foreground">Emitido: {new Date(cert.fecha_emision).toLocaleDateString('es-ES')}</p>
                      <p className="text-xs text-muted-foreground">Código: {cert.codigo_certificado}</p>
                    </div>
                  </div>
                  <CertificateDownload
                    certificate={cert}
                    studentName={studentName}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
