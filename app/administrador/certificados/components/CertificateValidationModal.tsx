"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function CertificateValidationModal() {
  const [certificateCode, setCertificateCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleValidation = async () => {
    if (!certificateCode) {
      toast.error("Por favor, ingresa el código del certificado.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/certificados/codigo/${certificateCode}`);
      const data = await response.json();

      if (response.ok && data) {
        toast.success("Certificado válido.", {
          description: `El certificado a nombre de ${data.nombre_completo} es válido.`,
        });
      } else {
        toast.error("Certificado no válido.", {
          description: "El código de certificado no se encontró en la base de datos.",
        });
      }
    } catch (error) {
      toast.error("Error de validación.", {
        description: "Ocurrió un error al validar el certificado. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Validar Certificado</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Validar Certificado</DialogTitle>
          <DialogDescription>
            Ingresa el código del certificado para validarlo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="certificate-code" className="text-right">
              Código
            </Label>
            <Input
              id="certificate-code"
              className="col-span-3"
              value={certificateCode}
              onChange={(e) => setCertificateCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleValidation} disabled={loading}>
            {loading ? "Validando..." : "Validar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}