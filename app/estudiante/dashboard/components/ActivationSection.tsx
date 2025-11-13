'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from 'lucide-react';

export default function ActivationSection() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleActivate = async () => {
        if (!code.trim()) {
            setMessage({ type: 'error', text: 'Por favor, introduce un código.' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user || !user.id_usuario) {
            setMessage({ type: 'error', text: 'No se pudo encontrar el usuario. Por favor, inicia sesión de nuevo.' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/cursos/activar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: user.id_usuario, codigo_acceso: code }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocurrió un error desconocido.');
            }

            setMessage({ type: 'success', text: data.message || '¡Curso activado con éxito!' });
            setCode('');

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Activar un Curso</h2>
                <p className="text-muted-foreground">Introduce el código de acceso que has recibido para añadir un nuevo curso a tu cuenta.</p>
            </div>
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="w-6 h-6 text-primary" />
                        <span>Código de Activación</span>
                    </CardTitle>
                    <CardDescription>Introduce tu código para desbloquear el acceso a tu curso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input 
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="XXXX-XXXX-XXXX"
                            className="text-center text-lg tracking-widest"
                        />
                    </div>
                    <Button onClick={handleActivate} disabled={isLoading} className="w-full">
                        {isLoading ? 'Activando...' : 'Activar Curso'}
                    </Button>
                    {message.text && (
                        <div className={`text-sm text-center p-2 rounded-md ${message.type === 'error' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                            {message.text}
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
