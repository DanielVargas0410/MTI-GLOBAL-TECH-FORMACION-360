'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { departamentos, ciudades } from '@/lib/colombia-data';

interface Course {
    id_curso: number;
    titulo: string;
}

interface User {
    nombre_completo: string;
    email: string;
    pais?: string;
    departamento?: string;
    ciudad?: string;
}

export default function PurchaseInterestForm({ course }: { course: Course }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        pais: 'Colombia',
        departamento: '',
        ciudad: ''
    });
    const [availableCities, setAvailableCities] = useState<{ id: string; nombre: string; }[]>([]);
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
                    pais: parsedUser.pais || 'Colombia',
                    departamento: parsedUser.departamento || '',
                    ciudad: parsedUser.ciudad || ''
                });
                if (parsedUser.departamento) {
                    setAvailableCities(ciudades[parsedUser.departamento] || []);
                }
            } else {
                setUser(null);
                setFormData({ name: '', email: '', pais: 'Colombia', departamento: '', ciudad: '' });
            }
        }
    }, [isDialogOpen]);

    const handlePaisChange = (value: string) => {
        setFormData(prev => ({ ...prev, pais: value, departamento: '', ciudad: '' }));
        setAvailableCities([]);
    };

    const handleDepartmentChange = (value: string) => {
        setFormData(prev => ({ ...prev, departamento: value, ciudad: '' }));
        setAvailableCities(ciudades[value] || []);
    };

    const handleCityChange = (value: string) => {
        setFormData(prev => ({ ...prev, ciudad: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }

    const handleSendWhatsApp = () => {
        const { name, email, pais, departamento, ciudad } = formData;

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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: "Correo electrónico inválido",
                description: "Por favor, ingresa un correo electrónico válido (debe contener @ y un dominio).",
                variant: "destructive",
            });
            return;
        }

        if (!pais) {
            toast({
                title: "Campo requerido",
                description: "Por favor, selecciona tu país.",
                variant: "destructive",
            });
            return;
        }

        if (!departamento) {
            toast({
                title: "Campo requerido",
                description: "Por favor, selecciona tu departamento.",
                variant: "destructive",
            });
            return;
        }

        if (!ciudad) {
            toast({
                title: "Campo requerido",
                description: "Por favor, selecciona tu ciudad.",
                variant: "destructive",
            });
            return;
        }

        const location = pais === 'Colombia' ? `${ciudad}, ${departamento}, ${pais}` : `${ciudad}, ${departamento}, ${pais}`;
        const message = `¡Hola! 👋 Estoy interesado/a en el curso "${course.titulo}". Mi nombre es ${name}, mi correo es ${email} y soy de ${location}. ¡Quisiera más información, por favor!`;
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
                <DialogContent>
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
                        <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="pais">País</Label>
                            <Select onValueChange={handlePaisChange} value={formData.pais} disabled={!!user}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tu país" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Colombia">Colombia</SelectItem>
                                    <SelectItem value="Argentina">Argentina</SelectItem>
                                    <SelectItem value="Chile">Chile</SelectItem>
                                    <SelectItem value="México">México</SelectItem>
                                    <SelectItem value="Perú">Perú</SelectItem>
                                    <SelectItem value="Ecuador">Ecuador</SelectItem>
                                    <SelectItem value="Venezuela">Venezuela</SelectItem>
                                    <SelectItem value="Panamá">Panamá</SelectItem>
                                    <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                                    <SelectItem value="Uruguay">Uruguay</SelectItem>
                                    <SelectItem value="Paraguay">Paraguay</SelectItem>
                                    <SelectItem value="Bolivia">Bolivia</SelectItem>
                                    <SelectItem value="Guatemala">Guatemala</SelectItem>
                                    <SelectItem value="Honduras">Honduras</SelectItem>
                                    <SelectItem value="El Salvador">El Salvador</SelectItem>
                                    <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                                    <SelectItem value="República Dominicana">República Dominicana</SelectItem>
                                    <SelectItem value="Puerto Rico">Puerto Rico</SelectItem>
                                    <SelectItem value="Cuba">Cuba</SelectItem>
                                    <SelectItem value="Otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="departamento">Departamento/Estado</Label>
                            <Select onValueChange={handleDepartmentChange} value={formData.departamento} disabled={!formData.pais || !!user}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tu departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    {formData.pais === 'Colombia' ? (
                                        departamentos.map(dep => (
                                            <SelectItem key={dep.id} value={dep.id}>{dep.nombre}</SelectItem>
                                        ))
                                    ) : (
                                        <>
                                            <SelectItem value="capital">Capital Federal</SelectItem>
                                            <SelectItem value="provincia">Provincia</SelectItem>
                                            <SelectItem value="estado">Estado</SelectItem>
                                            <SelectItem value="region">Región</SelectItem>
                                            <SelectItem value="otro">Otro</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="ciudad">Ciudad</Label>
                            <Select onValueChange={handleCityChange} value={formData.ciudad} disabled={!formData.departamento || !!user}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tu ciudad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {formData.pais === 'Colombia' && formData.departamento ? (
                                        availableCities.map(city => (
                                            <SelectItem key={city.id} value={city.nombre}>{city.nombre}</SelectItem>
                                        ))
                                    ) : (
                                        <>
                                            <SelectItem value="capital">Capital</SelectItem>
                                            <SelectItem value="ciudad_principal">Ciudad Principal</SelectItem>
                                            <SelectItem value="otra_ciudad">Otra Ciudad</SelectItem>
                                        </>
                                    )}
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
