import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getEstadoModuloColor, formatNumeroOrden } from '../lib/modulosUtils';
import styles from '../styles/modulos.module.css';

interface Modulo {
  id_modulo: number;
  titulo: string;
  descripcion: string;
  id_curso: number;
  numero_orden: number;
  estado: 'activo' | 'inactivo';
  curso_titulo: string;
}

interface ModuloCardProps {
  modulo: Modulo;
  onEdit: (modulo: Modulo) => void;
  onDelete: (id: number) => void;
}

const ModuloCard: React.FC<ModuloCardProps> = ({ modulo, onEdit, onDelete }) => {
  return (
    <Card className={styles.moduloCard}>
      <CardHeader>
        <CardTitle className={styles.tituloModulo}>{modulo.titulo}</CardTitle>
        <div className="flex justify-between items-center">
          <Badge variant="outline">{modulo.curso_titulo}</Badge>
          <span className={`${styles.ordenBadge} text-sm`}>
            Orden: {formatNumeroOrden(modulo.numero_orden)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`${styles.descripcionModulo} mb-4 whitespace-pre-wrap`}>{modulo.descripcion}</p>
        <div className="flex justify-between items-center mb-4">
          <Badge className={styles[getEstadoModuloColor(modulo.estado)]}>
            {modulo.estado}
          </Badge>
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(modulo)}>Editar</Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(modulo.id_modulo)}>Eliminar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuloCard;
