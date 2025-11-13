'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface Course {
    id_curso: number;
    titulo: string;
}

interface User {
    nombre_completo: string;
    email: string;
    region?: string;
}

export default function PurchaseInterestForm({ course }: { course: Course }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        region: ''
    });
    const { toast } = useToast();

    useEffect(() => {
        if (isDialogOpen && typeof window !== 'undefined') {
            const loggedInUser = localStorage.getItem('user');
            if (loggedInUser) {
                const parsedUser = JSON.parse(loggedInUser);
                setUser(parsedUser);
                setFormData({
                    name: parsedUser.nombre_completo || '',
                    email: parsedUser.email || '',
                    region: parsedUser.region || ''
                });
            } else {
                setUser(null);
                setFormData({ name: '', email: '', region: '' });
            }
        }
    }, [isDialogOpen]);

    const handleRegionChange = (value: string) => {
        setFormData(prev => ({ ...prev, region: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }

    const handleSendWhatsApp = () => {
        const { name, email, region } = formData;

        if (!name.trim()) {
            toast({
                title: "Campo requerido",
                description: "Por favor, ingresa tu nombre.",
                variant: "destructive",
            });
            return;
        }

        if (!email.trim()) {
            toast({
                title: "Campo requerido",
                description: "Por favor, ingresa tu correo electrónico.",
                variant: "destructive",
            });
            return;
        }

        if (!region) {
            toast({
                title: "Campo requerido",
                description: "Por favor, selecciona tu región.",
                variant: "destructive",
            });
            return;
        }

        const message = `¡Hola! 👋 Estoy interesado/a en el curso "${course.titulo}". Mi nombre es ${name}, mi correo es ${email} y soy de la región ${region}. ¡Quisiera más información, por favor!`;
        const whatsappUrl = `https://wa.me/573127085169?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
        setIsDialogOpen(false);
    };

    return (
        <>
            <Button className="w-full" size="lg" onClick={() => setIsDialogOpen(true)}>
                ¡Me Interesa!
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-card">
                    <DialogHeader>
                        <DialogTitle>Interés en el curso: {course.titulo}</DialogTitle>
                        <DialogDescription>
                            Estás a un paso de empezar. Confirma tus datos para que podamos contactarte.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="course">Curso Seleccionado</Label>
                            <Input id="course" value={course.titulo} disabled />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="name">Tu Nombre</Label>
                            <Input id="name" value={formData.name} onChange={handleInputChange} disabled={!!user} />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="email">Tu Correo Electrónico</Label>
                            <Input id="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!!user} />
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="region">Región</Label>
                            <Select onValueChange={handleRegionChange} value={formData.region} disabled={!!user}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tu región" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bogotá y Cundinamarca">Bogotá y Cundinamarca</SelectItem>
                                    <SelectItem value="Antioquia">Antioquia</SelectItem>
                                    <SelectItem value="Valle del Cauca">Valle del Cauca</SelectItem>
                                    <SelectItem value="Atlántico">Atlántico</SelectItem>
                                    <SelectItem value="Santander">Santander</SelectItem>
                                    <SelectItem value="Norte de Santander">Norte de Santander</SelectItem>
                                    <SelectItem value="Bolívar">Bolívar</SelectItem>
                                    <SelectItem value="Córdoba">Córdoba</SelectItem>
                                    <SelectItem value="Sucre">Sucre</SelectItem>
                                    <SelectItem value="Magdalena">Magdalena</SelectItem>
                                    <SelectItem value="Cesar">Cesar</SelectItem>
                                    <SelectItem value="La Guajira">La Guajira</SelectItem>
                                    <SelectItem value="Tolima">Tolima</SelectItem>
                                    <SelectItem value="Huila">Huila</SelectItem>
                                    <SelectItem value="Caquetá">Caquetá</SelectItem>
                                    <SelectItem value="Nariño">Nariño</SelectItem>
                                    <SelectItem value="Putumayo">Putumayo</SelectItem>
                                    <SelectItem value="Chocó">Chocó</SelectItem>
                                    <SelectItem value="Risaralda">Risaralda</SelectItem>
                                    <SelectItem value="Quindío">Quindío</SelectItem>
                                    <SelectItem value="Cauca">Cauca</SelectItem>
                                    <SelectItem value="Meta">Meta</SelectItem>
                                    <SelectItem value="Arauca">Arauca</SelectItem>
                                    <SelectItem value="Casanare">Casanare</SelectItem>
                                    <SelectItem value="Vichada">Vichada</SelectItem>
                                    <SelectItem value="Guainía">Guainía</SelectItem>
                                    <SelectItem value="Guaviare">Guaviare</SelectItem>
                                    <SelectItem value="Vaupés">Vaupés</SelectItem>
                                    <SelectItem value="Amazonas">Amazonas</SelectItem>
                                    <SelectItem value="San Andrés y Providencia">San Andrés y Providencia</SelectItem>
                                    <SelectItem value="Otra">Otra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSendWhatsApp}>Continuar por WhatsApp</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}