import React, { useState } from 'react'
import { X, User, Mail, Lock, Shield, Activity, Upload, MapPin, Phone, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'


export interface UserFormData {
  nombre_completo: string
  email: string
  telefono?: string
  direccion?: string
  ciudad?: string
  pais?: string
  password?: string
  foto_perfil_url?: string
  rol: 'estudiante' | 'administrador'
  estado: 'activo' | 'inactivo' | 'suspendido'
}

interface UserFormModalProps {
  isOpen: boolean
  isEditing: boolean
  formData: UserFormData
  onClose: () => void
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: (data: UserFormData) => void
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onFormChange,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [availableCities, setAvailableCities] = useState<{ id: string; nombre: string; }[]>([])
  const { toast } = useToast()

  // Lista de ciudades por país
  const citiesByCountry: { [key: string]: { id: string; nombre: string; }[] } = {
    Colombia: [
      { id: 'bogota', nombre: 'Bogotá' },
      { id: 'medellin', nombre: 'Medellín' },
      { id: 'cali', nombre: 'Cali' },
      { id: 'barranquilla', nombre: 'Barranquilla' },
      { id: 'cartagena', nombre: 'Cartagena' },
      { id: 'pereira', nombre: 'Pereira' },
      { id: 'manizales', nombre: 'Manizales' },
      { id: 'armenia', nombre: 'Armenia' },
      { id: 'ibague', nombre: 'Ibagué' },
      { id: 'bucaramanga', nombre: 'Bucaramanga' },
      { id: 'cucuta', nombre: 'Cúcuta' },
      { id: 'pasto', nombre: 'Pasto' },
      { id: 'popayan', nombre: 'Popayán' },
      { id: 'neiva', nombre: 'Neiva' },
      { id: 'villavicencio', nombre: 'Villavicencio' },
      { id: 'santa_marta', nombre: 'Santa Marta' },
      { id: 'valledupar', nombre: 'Valledupar' },
      { id: 'monteria', nombre: 'Montería' },
      { id: 'sincelejo', nombre: 'Sincelejo' },
      { id: 'rioacha', nombre: 'Rioacha' },
      { id: 'yopal', nombre: 'Yopal' },
      { id: 'mocoa', nombre: 'Mocoa' },
      { id: 'san_andres', nombre: 'San Andrés' },
      { id: 'florencia', nombre: 'Florencia' },
      { id: 'mitu', nombre: 'Mitú' },
      { id: 'puerto_carreno', nombre: 'Puerto Carreño' },
      { id: 'inirida', nombre: 'Inírida' },
      { id: 'san_jose_del_guaviare', nombre: 'San José del Guaviare' },
      { id: 'arauca', nombre: 'Arauca' },
      { id: 'tunja', nombre: 'Tunja' },
      { id: 'manizales', nombre: 'Manizales' },
      { id: 'floridablanca', nombre: 'Floridablanca' },
      { id: 'palmira', nombre: 'Palmira' },
      { id: 'buenaventura', nombre: 'Buenaventura' },
      { id: 'tulua', nombre: 'Tuluá' },
      { id: 'jamundi', nombre: 'Jamundí' },
      { id: 'yumbo', nombre: 'Yumbo' },
      { id: 'cartago', nombre: 'Cartago' },
      { id: 'buga', nombre: 'Buga' },
      { id: 'girardot', nombre: 'Girardot' },
      { id: 'zipaquira', nombre: 'Zipaquirá' },
      { id: 'chia', nombre: 'Chía' },
      { id: 'soacha', nombre: 'Soacha' },
      { id: 'facatativa', nombre: 'Facatativá' },
      { id: 'madrid', nombre: 'Madrid' },
      { id: 'cajica', nombre: 'Cajicá' },
      { id: 'mosquera', nombre: 'Mosquera' },
      { id: 'funza', nombre: 'Funza' },
      { id: 'cota', nombre: 'Cota' },
      { id: 'tenjo', nombre: 'Tenjo' },
      { id: 'tabio', nombre: 'Tabio' },
      { id: 'la_calera', nombre: 'La Calera' },
      { id: 'tocancipa', nombre: 'Tocancipá' },
      { id: 'gachancipa', nombre: 'Gachancipá' },
      { id: 'nemocon', nombre: 'Nemocón' },
      { id: 'sopo', nombre: 'Sopó' },
      { id: 'guasca', nombre: 'Guasca' },
      { id: 'la_vega', nombre: 'La Vega' },
      { id: 'villeta', nombre: 'Villeta' },
      { id: 'granada', nombre: 'Granada' },
      { id: 'fusagasuga', nombre: 'Fusagasugá' },
      { id: 'silvania', nombre: 'Silvania' },
      { id: 'melgar', nombre: 'Melgar' },
      { id: 'girardot', nombre: 'Girardot' },
      { id: 'nilo', nombre: 'Nilo' },
      { id: 'agua_de_dios', nombre: 'Agua de Dios' },
      { id: 'jerusalen', nombre: 'Jerusalén' },
      { id: 'arbelaez', nombre: 'Arbeláez' },
      { id: 'pasca', nombre: 'Pasca' },
      { id: 'san_bernardo', nombre: 'San Bernardo' },
      { id: 'venecia', nombre: 'Venecia' },
      { id: 'cabrera', nombre: 'Cabrera' },
      { id: 'puente_quetame', nombre: 'Puente Quetame' },
      { id: 'san_francisco', nombre: 'San Francisco' },
      { id: 'caparrapi', nombre: 'Caparrapí' },
      { id: 'quebradanegra', nombre: 'Quebradanegra' },
      { id: 'san_antonio_del_tequendama', nombre: 'San Antonio del Tequendama' },
      { id: 'anapoima', nombre: 'Anapoima' },
      { id: 'anolaima', nombre: 'Anolaima' },
      { id: 'cachipay', nombre: 'Cachipay' },
      { id: 'el_colegio', nombre: 'El Colegio' },
      { id: 'coello', nombre: 'Coello' },
      { id: 'nariño', nombre: 'Nariño' },
      { id: 'lerida', nombre: 'Lérida' },
      { id: 'mariquita', nombre: 'Mariquita' },
      { id: 'falan', nombre: 'Falan' },
      { id: 'palocabildo', nombre: 'Palocabildo' },
      { id: 'carmen_de_apicala', nombre: 'Carmen de Apicalá' },
      { id: 'cunday', nombre: 'Cunday' },
      { id: 'icononzo', nombre: 'Icononzo' },
      { id: 'pandiaco', nombre: 'Pandiaco' },
      { id: 'villahermosa', nombre: 'Villahermosa' },
      { id: 'villapinzon', nombre: 'Villapinzón' },
      { id: 'choconta', nombre: 'Chocontá' },
      { id: 'macheta', nombre: 'Machetá' },
      { id: 'ubate', nombre: 'Ubaté' },
      { id: 'susa', nombre: 'Susa' },
      { id: 'simijaca', nombre: 'Simijaca' },
      { id: 'suesca', nombre: 'Suesca' },
      { id: 'lenguazaque', nombre: 'Lenguazaque' },
      { id: 'cucunuba', nombre: 'Cucunubá' },
      { id: 'el_peñon', nombre: 'El Peñón' },
      { id: 'cabrera', nombre: 'Cabrera' },
      { id: 'choachi', nombre: 'Choachí' },
      { id: 'ubala', nombre: 'Ubalá' },
      { id: 'fomeque', nombre: 'Fómeque' },
      { id: 'fuquene', nombre: 'Fúquene' },
      { id: 'el_colegio', nombre: 'El Colegio' },
      { id: 'gutierrez', nombre: 'Gutiérrez' },
      { id: 'quipile', nombre: 'Quipile' },
      { id: 'apulo', nombre: 'Apulo' },
      { id: 'tibirita', nombre: 'Tibirita' },
      { id: 'ranta', nombre: 'Ranta' },
      { id: 'toca', nombre: 'Toca' },
      { id: 'carmen_de_carupa', nombre: 'Carmen de Carupa' },
      { id: 'topaipi', nombre: 'Topaipí' },
      { id: 'yacopi', nombre: 'Yacopí' },
      { id: 'cajon', nombre: 'Cajón' },
      { id: 'tausa', nombre: 'Tausa' },
      { id: 'sora', nombre: 'Sora' },
      { id: 'sesquile', nombre: 'Sesquilé' },
      { id: 'chingaza', nombre: 'Chingaza' },
      { id: 'san_miguel_de_sema', nombre: 'San Miguel de Sema' },
      { id: 'supata', nombre: 'Supatá' },
      { id: 'subachoque', nombre: 'Subachoque' },
      { id: 'zipacon', nombre: 'Zipacón' },
      { id: 'puerto_saldeño', nombre: 'Puerto Saldaño' },
      { id: 'manta', nombre: 'Manta' },
      { id: 'tobay', nombre: 'Togüí' },
      { id: 'villagomez', nombre: 'Villagómez' },
      { id: 'beltran', nombre: 'Beltrán' },
      { id: 'bituima', nombre: 'Bituima' },
      { id: 'chaguani', nombre: 'Chaguaní' },
      { id: 'guayabal_de_siquima', nombre: 'Guayabal de Síquima' },
      { id: 'pulí', nombre: 'Puli' },
      { id: 'rioblanco', nombre: 'Río Blanco' },
      { id: 'san_juan_de_rioseco', nombre: 'San Juan de Rioseco' },
      { id: 'vertientes', nombre: 'Vergara' },
      { id: 'nimaima', nombre: 'Nimaima' },
      { id: 'nocaima', nombre: 'Nocaima' },
      { id: 'quebradanegra', nombre: 'Quebradanegra' },
      { id: 'san_antonio_del_tequendama', nombre: 'San Antonio del Tequendama' },
      { id: 'sasaima', nombre: 'Sasaima' },
      { id: 'sesquile', nombre: 'Sesquilé' },
      { id: 'sibate', nombre: 'Sibaté' },
      { id: 'silvania', nombre: 'Silvania' },
      { id: 'simijaca', nombre: 'Simijaca' },
      { id: 'soacha', nombre: 'Soacha' },
      { id: 'sopó', nombre: 'Sopó' },
      { id: 'subachoque', nombre: 'Subachoque' },
      { id: 'suesca', nombre: 'Suesca' },
      { id: 'supata', nombre: 'Supatá' },
      { id: 'susa', nombre: 'Susa' },
      { id: 'sutatausa', nombre: 'Sutatausa' },
      { id: 'tabio', nombre: 'Tabio' },
      { id: 'tausa', nombre: 'Tausa' },
      { id: 'tenjo', nombre: 'Tenjo' },
      { id: 'tibacuy', nombre: 'Tibacuy' },
      { id: 'tibirita', nombre: 'Tibirita' },
      { id: 'tocaima', nombre: 'Tocaima' },
      { id: 'tocancipa', nombre: 'Tocancipá' },
      { id: 'topaipi', nombre: 'Topaipí' },
      { id: 'ubala', nombre: 'Ubalá' },
      { id: 'ubaque', nombre: 'Ubaque' },
      { id: 'ubate', nombre: 'Ubaté' },
      { id: 'une', nombre: 'Une' },
      { id: 'utica', nombre: 'Útica' },
      { id: 'venecia', nombre: 'Venecia' },
      { id: 'vergara', nombre: 'Vergara' },
      { id: 'viajama', nombre: 'Vianí' },
      { id: 'villagomez', nombre: 'Villagómez' },
      { id: 'villapinzon', nombre: 'Villapinzón' },
      { id: 'villeta', nombre: 'Villeta' },
      { id: 'viota', nombre: 'Viota' },
      { id: 'yacopi', nombre: 'Yacopí' },
      { id: 'zipacon', nombre: 'Zipacón' },
      { id: 'zipaquira', nombre: 'Zipaquirá' }
    ],
    Argentina: [
      { id: 'buenos_aires', nombre: 'Buenos Aires' },
      { id: 'cordoba', nombre: 'Córdoba' },
      { id: 'rosario', nombre: 'Rosario' },
      { id: 'mendoza', nombre: 'Mendoza' },
      { id: 'tucuman', nombre: 'Tucumán' },
      { id: 'la_plata', nombre: 'La Plata' },
      { id: 'mar_del_plata', nombre: 'Mar del Plata' },
      { id: 'salta', nombre: 'Salta' },
      { id: 'santa_fe', nombre: 'Santa Fe' },
      { id: 'san_juan', nombre: 'San Juan' }
    ],
    Chile: [
      { id: 'santiago', nombre: 'Santiago' },
      { id: 'valparaiso', nombre: 'Valparaíso' },
      { id: 'concepcion', nombre: 'Concepción' },
      { id: 'antofagasta', nombre: 'Antofagasta' },
      { id: 'vina_del_mar', nombre: 'Viña del Mar' },
      { id: 'talcahuano', nombre: 'Talcahuano' },
      { id: 'san_bernardo', nombre: 'San Bernardo' },
      { id: 'temuco', nombre: 'Temuco' },
      { id: 'iquique', nombre: 'Iquique' },
      { id: 'rancagua', nombre: 'Rancagua' }
    ],
    Mexico: [
      { id: 'mexico_city', nombre: 'Ciudad de México' },
      { id: 'guadalajara', nombre: 'Guadalajara' },
      { id: 'monterrey', nombre: 'Monterrey' },
      { id: 'puebla', nombre: 'Puebla' },
      { id: 'tijuana', nombre: 'Tijuana' },
      { id: 'leon', nombre: 'León' },
      { id: 'juarez', nombre: 'Juárez' },
      { id: 'torreon', nombre: 'Torreón' },
      { id: 'queretaro', nombre: 'Querétaro' },
      { id: 'merida', nombre: 'Mérida' }
    ],
    Peru: [
      { id: 'lima', nombre: 'Lima' },
      { id: 'arequipa', nombre: 'Arequipa' },
      { id: 'trujillo', nombre: 'Trujillo' },
      { id: 'chiclayo', nombre: 'Chiclayo' },
      { id: 'piura', nombre: 'Piura' },
      { id: 'cusco', nombre: 'Cusco' },
      { id: 'chimbote', nombre: 'Chimbote' },
      { id: 'ica', nombre: 'Ica' },
      { id: 'juliaca', nombre: 'Juliaca' },
      { id: 'huancayo', nombre: 'Huancayo' }
    ],
    Ecuador: [
      { id: 'quito', nombre: 'Quito' },
      { id: 'guayaquil', nombre: 'Guayaquil' },
      { id: 'cuenca', nombre: 'Cuenca' },
      { id: 'ambato', nombre: 'Ambato' },
      { id: 'machala', nombre: 'Machala' },
      { id: 'durán', nombre: 'Durán' },
      { id: 'manta', nombre: 'Manta' },
      { id: 'loja', nombre: 'Loja' },
      { id: 'portoviejo', nombre: 'Portoviejo' },
      { id: 'esmeraldas', nombre: 'Esmeraldas' }
    ],
    Venezuela: [
      { id: 'caracas', nombre: 'Caracas' },
      { id: 'maracaibo', nombre: 'Maracaibo' },
      { id: 'valencia', nombre: 'Valencia' },
      { id: 'barquisimeto', nombre: 'Barquisimeto' },
      { id: 'maracay', nombre: 'Maracay' },
      { id: 'ciudad_bolivar', nombre: 'Ciudad Bolívar' },
      { id: 'san_cristobal', nombre: 'San Cristóbal' },
      { id: 'barinas', nombre: 'Barinas' },
      { id: 'petare', nombre: 'Petare' },
      { id: 'puerto_la_cruz', nombre: 'Puerto La Cruz' }
    ],
    Panama: [
      { id: 'panama_city', nombre: 'Ciudad de Panamá' },
      { id: 'colon', nombre: 'Colón' },
      { id: 'david', nombre: 'David' },
      { id: 'santiago', nombre: 'Santiago' },
      { id: 'la_chorrera', nombre: 'La Chorrera' },
      { id: 'bugaba', nombre: 'Bugaba' },
      { id: 'penonome', nombre: 'Penonomé' },
      { id: 'chitre', nombre: 'Chitré' },
      { id: 'aguadulce', nombre: 'Aguadulce' },
      { id: 'anton', nombre: 'Antón' }
    ],
    'Costa Rica': [
      { id: 'san_jose', nombre: 'San José' },
      { id: 'alajuela', nombre: 'Alajuela' },
      { id: 'cartago', nombre: 'Cartago' },
      { id: 'heredia', nombre: 'Heredia' },
      { id: 'liberia', nombre: 'Liberia' },
      { id: 'puntarenas', nombre: 'Puntarenas' },
      { id: 'limon', nombre: 'Limón' },
      { id: 'san_carlos', nombre: 'San Carlos' },
      { id: 'guanacaste', nombre: 'Guanacaste' },
      { id: 'puntarenas', nombre: 'Puntarenas' }
    ],
    Uruguay: [
      { id: 'montevideo', nombre: 'Montevideo' },
      { id: 'salto', nombre: 'Salto' },
      { id: 'paysandu', nombre: 'Paysandú' },
      { id: 'las_piedras', nombre: 'Las Piedras' },
      { id: 'rivera', nombre: 'Rivera' },
      { id: 'maldonado', nombre: 'Maldonado' },
      { id: 'tacuarembo', nombre: 'Tacuarembó' },
      { id: 'melo', nombre: 'Melo' },
      { id: 'mercedes', nombre: 'Mercedes' },
      { id: 'artigas', nombre: 'Artigas' }
    ],
    Paraguay: [
      { id: 'asuncion', nombre: 'Asunción' },
      { id: 'ciudad_del_este', nombre: 'Ciudad del Este' },
      { id: 'encarnacion', nombre: 'Encarnación' },
      { id: 'luque', nombre: 'Luque' },
      { id: 'san_lorenzo', nombre: 'San Lorenzo' },
      { id: 'lambera', nombre: 'Lambaré' },
      { id: 'fernando_de_la_mora', nombre: 'Fernando de la Mora' },
      { id: 'pedro_juan_caballero', nombre: 'Pedro Juan Caballero' },
      { id: 'mariano_roque_alonso', nombre: 'Mariano Roque Alonso' },
      { id: 'itaugua', nombre: 'Itauguá' }
    ],
    Bolivia: [
      { id: 'la_paz', nombre: 'La Paz' },
      { id: 'santa_cruz', nombre: 'Santa Cruz de la Sierra' },
      { id: 'cochabamba', nombre: 'Cochabamba' },
      { id: 'sucre', nombre: 'Sucre' },
      { id: 'oruro', nombre: 'Oruro' },
      { id: 'potosi', nombre: 'Potosí' },
      { id: 'tarija', nombre: 'Tarija' },
      { id: 'trinidad', nombre: 'Trinidad' },
      { id: 'cobija', nombre: 'Cobija' },
      { id: 'riberalta', nombre: 'Riberalta' }
    ],
    Guatemala: [
      { id: 'guatemala_city', nombre: 'Ciudad de Guatemala' },
      { id: 'mixco', nombre: 'Mixco' },
      { id: 'villa_nueva', nombre: 'Villa Nueva' },
      { id: 'quetzaltenango', nombre: 'Quetzaltenango' },
      { id: 'san_miguel_peten', nombre: 'San Miguel Petén' },
      { id: 'escuintla', nombre: 'Escuintla' },
      { id: 'mazatenango', nombre: 'Mazatenango' },
      { id: 'chimaltenango', nombre: 'Chimaltenango' },
      { id: 'huehuetenango', nombre: 'Huehuetenango' },
      { id: 'totonicapan', nombre: 'Totonicapán' }
    ],
    Honduras: [
      { id: 'tegucigalpa', nombre: 'Tegucigalpa' },
      { id: 'san_pedro_sula', nombre: 'San Pedro Sula' },
      { id: 'choloma', nombre: 'Choloma' },
      { id: 'la_ceiba', nombre: 'La Ceiba' },
      { id: 'el_progreso', nombre: 'El Progreso' },
      { id: 'choluteca', nombre: 'Choluteca' },
      { id: 'comayagua', nombre: 'Comayagua' },
      { id: 'puerto_cortes', nombre: 'Puerto Cortés' },
      { id: 'san_lorenzo', nombre: 'San Lorenzo' },
      { id: 'danli', nombre: 'Danlí' }
    ],
    'El Salvador': [
      { id: 'san_salvador', nombre: 'San Salvador' },
      { id: 'santa_ana', nombre: 'Santa Ana' },
      { id: 'san_miguel', nombre: 'San Miguel' },
      { id: 'mejicanos', nombre: 'Mejicanos' },
      { id: 'soyapango', nombre: 'Soyapango' },
      { id: 'santa_tecla', nombre: 'Santa Tecla' },
      { id: 'apopa', nombre: 'Apopa' },
      { id: 'delgado', nombre: 'Delgado' },
      { id: 'sonsonate', nombre: 'Sonsonate' },
      { id: 'ahuachapan', nombre: 'Ahuachapán' }
    ],
    Nicaragua: [
      { id: 'managua', nombre: 'Managua' },
      { id: 'leon', nombre: 'León' },
      { id: 'granada', nombre: 'Granada' },
      { id: 'masaya', nombre: 'Masaya' },
      { id: 'chinandega', nombre: 'Chinandega' },
      { id: 'matagalpa', nombre: 'Matagalpa' },
      { id: 'esteli', nombre: 'Estelí' },
      { id: 'tipitapa', nombre: 'Tipitapa' },
      { id: 'jinotega', nombre: 'Jinotega' },
      { id: 'rivas', nombre: 'Rivas' }
    ],
    'Republica Dominicana': [
      { id: 'santo_domingo', nombre: 'Santo Domingo' },
      { id: 'santiago', nombre: 'Santiago' },
      { id: 'santo_domingo_este', nombre: 'Santo Domingo Este' },
      { id: 'santo_domingo_norte', nombre: 'Santo Domingo Norte' },
      { id: 'santo_domingo_oeste', nombre: 'Santo Domingo Oeste' },
      { id: 'higuey', nombre: 'Higüey' },
      { id: 'duarte', nombre: 'Duarte' },
      { id: 'san_cristobal', nombre: 'San Cristóbal' },
      { id: 'puerto_plata', nombre: 'Puerto Plata' },
      { id: 'la_romana', nombre: 'La Romana' }
    ],
    'Puerto Rico': [
      { id: 'san_juan', nombre: 'San Juan' },
      { id: 'bayamon', nombre: 'Bayamón' },
      { id: 'carolina', nombre: 'Carolina' },
      { id: 'ponce', nombre: 'Ponce' },
      { id: 'caguas', nombre: 'Caguas' },
      { id: 'guaynabo', nombre: 'Guaynabo' },
      { id: 'mayaguez', nombre: 'Mayagüez' },
      { id: 'toledo', nombre: 'Toledo' },
      { id: 'arecibo', nombre: 'Arecibo' },
      { id: 'vega_baja', nombre: 'Vega Baja' }
    ],
    Cuba: [
      { id: 'la_habana', nombre: 'La Habana' },
      { id: 'santiago_de_cuba', nombre: 'Santiago de Cuba' },
      { id: 'camaguey', nombre: 'Camagüey' },
      { id: 'holguin', nombre: 'Holguín' },
      { id: 'guantanamo', nombre: 'Guantánamo' },
      { id: 'santa_clara', nombre: 'Santa Clara' },
      { id: 'las_tunas', nombre: 'Las Tunas' },
      { id: 'bayamo', nombre: 'Bayamo' },
      { id: 'cienfuegos', nombre: 'Cienfuegos' },
      { id: 'pinar_del_rio', nombre: 'Pinar del Río' }
    ],
    Otro: [
      { id: 'otra', nombre: 'Otra' }
    ]
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handlePaisChange = (value: string) => {
    onFormChange({ target: { name: 'pais', value } } as any)
    onFormChange({ target: { name: 'ciudad', value: '' } } as any)
  }

  const handleCityChange = (value: string) => {
    onFormChange({ target: { name: 'ciudad', value } } as any)
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null

    const formDataUpload = new FormData()
    formDataUpload.append('photo', selectedFile)

    try {
      const response = await fetch('http://localhost:3001/auth/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        return data.url
      } else {
        toast({
          title: "Error al subir imagen",
          description: "No se pudo subir la imagen de perfil.",
          variant: "destructive",
        })
        return null
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor para subir la imagen.",
        variant: "destructive",
      })
      return null
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Correo electrónico inválido",
        description: "Por favor, ingresa un correo electrónico válido.",
        variant: "destructive",
      })
      return
    }

    // Subir imagen si hay una seleccionada
    let imageUrl = formData.foto_perfil_url || null
    if (selectedFile) {
      imageUrl = await uploadImage()
      if (!imageUrl) return // Si falló la subida, no continuar
    }

    // Crear formData con la URL de la imagen
    const submitData = { ...formData, foto_perfil_url: imageUrl || undefined }

    // Llamar al onSubmit original con los datos actualizados
    onSubmit(submitData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl transform transition-all animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit}>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Información Básica */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
                    Información Básica
                  </h4>

                  {/* Nombre Completo */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4 text-blue-600" />
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="nombre_completo"
                      value={formData.nombre_completo}
                      onChange={onFormChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onFormChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>

                  {/* Contraseña (solo al crear) */}
                  {!isEditing && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Lock className="w-4 h-4 text-blue-600" />
                        Contraseña
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password || ''}
                        onChange={onFormChange}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                  )}
                </div>

                {/* Configuración del Sistema */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
                    Configuración del Sistema
                  </h4>

                  {/* Grid para Rol y Estado */}
                  <div className="grid grid-cols-1 gap-4">
                    {/* Rol */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Shield className="w-4 h-4 text-blue-600" />
                        Rol
                      </label>
                      <select
                        name="rol"
                        value={formData.rol}
                        onChange={onFormChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 cursor-pointer"
                      >
                        <option value="estudiante">Estudiante</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </div>

                    {/* Estado */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Activity className="w-4 h-4 text-blue-600" />
                        Estado
                      </label>
                      <select
                        name="estado"
                        value={formData.estado}
                        onChange={onFormChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 cursor-pointer"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="suspendido">Suspendido</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Información de Contacto */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
                    Información de Contacto
                  </h4>

                  {/* Foto de Perfil */}
                  <div className="space-y-4">
                    <h5 className="text-md font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
                      Foto de Perfil
                    </h5>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={previewUrl || formData.foto_perfil_url} alt="Foto de perfil" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                          {formData.nombre_completo?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                            <Upload className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-700 dark:text-blue-300">
                              {selectedFile ? selectedFile.name : 'Seleccionar imagen'}
                            </span>
                          </div>
                        </Label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Formatos: JPG, PNG, GIF. Máximo 5MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      name="telefono"
                      value={formData.telefono || ''}
                      onChange={onFormChange}
                      placeholder="Ej: +57 300 123 4567"
                    />
                  </div>

                  {/* Dirección */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Dirección
                    </label>
                    <Input
                      type="text"
                      name="direccion"
                      value={formData.direccion || ''}
                      onChange={onFormChange}
                      placeholder="Ej: Calle 123 #45-67"
                    />
                  </div>

                  {/* País */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Globe className="w-4 h-4 text-blue-600" />
                      País
                    </label>
                    <Select value={formData.pais || 'Colombia'} onValueChange={handlePaisChange}>
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

                  {/* Ciudad */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Ciudad
                    </label>
                    {formData.pais === 'Otro' ? (
                      <Input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad || ''}
                        onChange={onFormChange}
                        placeholder="Escribe el nombre de tu ciudad"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    ) : (
                      <Select value={formData.ciudad || ''} onValueChange={handleCityChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={formData.pais ? "Selecciona tu ciudad" : "Selecciona un país primero"} />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.pais && citiesByCountry[formData.pais] ? (
                            citiesByCountry[formData.pais].map((city) => (
                              <SelectItem key={city.id} value={city.nombre}>
                                {city.nombre}
                              </SelectItem>
                            ))
                          ) : null}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserFormModal