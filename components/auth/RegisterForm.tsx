'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Mail, User, Phone, MapPin, Lock, Image as ImageIcon, CheckCircle2, XCircle, Globe, Sparkles, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { departamentos, getCiudadesPorDepartamento } from '@/lib/colombia-data';

const paises = [
  'Colombia',
  'Argentina',
  'Chile',
  'México',
  'Perú',
  'Ecuador',
  'Venezuela',
  'Brasil',
  'Uruguay',
  'Paraguay',
  'Bolivia',
  'Panamá',
  'Costa Rica',
  'Nicaragua',
  'Honduras',
  'El Salvador',
  'Guatemala',
  'Belice',
];

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nombre_completo: '',
    telefono: '',
    direccion: '',
    pais: 'Colombia',
    ciudad: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedDep, setSelectedDep] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });
  const [focusedField, setFocusedField] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string): PasswordValidation => {
    return {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  };

  const isPasswordValid = (validation: PasswordValidation): boolean => {
    return validation.minLength && validation.hasUppercase && validation.hasLowercase && validation.hasNumber;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'departamento') {
      setSelectedDep(value);
      setFormData(prev => ({ ...prev, ciudad: '' }));
    }
    if (name === 'ciudad') {
      setFormData(prev => ({ ...prev, ciudad: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoFile(e.target.files[0]);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!fotoFile) return null;

    const formDataUpload = new FormData();
    formDataUpload.append('photo', fotoFile);

    try {
      const response = await fetch('http://localhost:3001/auth/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Error al subir la foto');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones
    if (!isPasswordValid(passwordValidation)) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña débil',
        text: 'La contraseña no cumple con los requisitos de seguridad',
        confirmButtonText: 'Entendido',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6'
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonText: 'Entendido',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6'
      });
      setIsLoading(false);
      return;
    }

    if (!formData.ciudad) {
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: 'Debes seleccionar o ingresar una ciudad',
        confirmButtonText: 'Entendido',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6'
      });
      setIsLoading(false);
      return;
    }

    try {
      let fotoUrl = null;
      if (fotoFile) {
        fotoUrl = await uploadPhoto();
      }

      const registerData = {
        email: formData.email,
        nombre_completo: formData.nombre_completo,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        pais: formData.pais,
        password: formData.password,
        foto_perfil_url: fotoUrl,
      };

      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso! 🎉',
        text: `Bienvenido ${data.nombre_completo}. Tu rol es ${data.rol}`,
        confirmButtonText: 'Continuar',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        router.push('/login');
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: error.message,
        confirmButtonText: 'Intentar nuevamente',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ciudades = getCiudadesPorDepartamento(selectedDep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute top-10 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-10 left-20 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Volver al Login</span>
              </Link>
            </div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                Formación 360
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Crea tu cuenta
            </h2>
            <p className="text-gray-300 text-lg">
              Completa el formulario para comenzar tu experiencia de aprendizaje
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna Izquierda */}
                <div className="space-y-5">
                  {/* Email Field */}
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
                        focusedField === 'email' || formData.email
                          ? 'top-2 text-xs text-blue-300'
                          : 'top-4 text-gray-400'
                      }`}
                    >
                      Correo electrónico *
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full pt-6 pb-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                      />
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Nombre Completo Field */}
                  <div className="relative">
                    <label
                      htmlFor="nombre_completo"
                      className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
                        focusedField === 'nombre_completo' || formData.nombre_completo
                          ? 'top-2 text-xs text-blue-300'
                          : 'top-4 text-gray-400'
                      }`}
                    >
                      Nombre completo *
                    </label>
                    <div className="relative">
                      <input
                        id="nombre_completo"
                        name="nombre_completo"
                        type="text"
                        required
                        className="w-full pt-6 pb-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        value={formData.nombre_completo}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('nombre_completo')}
                        onBlur={() => setFocusedField('')}
                      />
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Teléfono Field */}
                  <div className="relative">
                    <label
                      htmlFor="telefono"
                      className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
                        focusedField === 'telefono' || formData.telefono
                          ? 'top-2 text-xs text-blue-300'
                          : 'top-4 text-gray-400'
                      }`}
                    >
                      Teléfono
                    </label>
                    <div className="relative">
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        className="w-full pt-6 pb-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('telefono')}
                        onBlur={() => setFocusedField('')}
                      />
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Dirección Field */}
                  <div className="relative">
                    <label
                      htmlFor="direccion"
                      className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
                        focusedField === 'direccion' || formData.direccion
                          ? 'top-2 text-xs text-blue-300'
                          : 'top-4 text-gray-400'
                      }`}
                    >
                      Dirección
                    </label>
                    <div className="relative">
                      <input
                        id="direccion"
                        name="direccion"
                        type="text"
                        className="w-full pt-6 pb-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('direccion')}
                        onBlur={() => setFocusedField('')}
                      />
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* País Field */}
                  <div className="relative">
                    <label className="block text-blue-300 text-xs mb-2">País *</label>
                    <div className="relative">
                      <select
                        value={formData.pais}
                        onChange={(e) => handleSelectChange('pais', e.target.value)}
                        className="w-full py-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
                      >
                        {paises.map((pais) => (
                          <option key={pais} value={pais} className="bg-gray-800">
                            {pais}
                          </option>
                        ))}
                      </select>
                      <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Foto de Perfil */}
                  <div className="relative">
                    <label className="block text-blue-300 text-xs mb-2">Foto de perfil (opcional)</label>
                    <input
                      id="foto"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full py-2 px-4 bg-white/5 border border-white/20 rounded-xl text-white file:bg-blue-500/20 file:text-blue-300 file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 hover:file:bg-blue-500/30 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-5">
                  {formData.pais === 'Colombia' ? (
                    <>
                      {/* Departamento Field */}
                      <div className="relative">
                        <label className="block text-blue-300 text-xs mb-2">Departamento *</label>
                        <div className="relative">
                          <select
                            value={selectedDep}
                            onChange={(e) => handleSelectChange('departamento', e.target.value)}
                            className="w-full py-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
                          >
                            <option value="" className="bg-gray-800">Selecciona departamento</option>
                            {departamentos.map((dep) => (
                              <option key={dep.id} value={dep.id} className="bg-gray-800">
                                {dep.nombre}
                              </option>
                            ))}
                          </select>
                          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Ciudad Field - Select */}
                      <div className="relative">
                        <label className="block text-blue-300 text-xs mb-2">Ciudad *</label>
                        <div className="relative">
                          <select
                            value={formData.ciudad}
                            onChange={(e) => handleSelectChange('ciudad', e.target.value)}
                            disabled={!selectedDep}
                            className="w-full py-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="" className="bg-gray-800">Selecciona ciudad</option>
                            {ciudades.map((ciudad) => (
                              <option key={ciudad.id} value={ciudad.nombre} className="bg-gray-800">
                                {ciudad.nombre}
                              </option>
                            ))}
                          </select>
                          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Ciudad Field - Input */
                    <div className="relative">
                      <label
                        htmlFor="ciudad"
                        className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
                          focusedField === 'ciudad' || formData.ciudad
                            ? 'top-2 text-xs text-blue-300'
                            : 'top-4 text-gray-400'
                        }`}
                      >
                        Ciudad *
                      </label>
                      <div className="relative">
                        <input
                          id="ciudad"
                          name="ciudad"
                          type="text"
                          required
                          className="w-full pt-6 pb-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          value={formData.ciudad}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('ciudad')}
                          onBlur={() => setFocusedField('')}
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {/* Password Field */}
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
                        focusedField === 'password' || formData.password
                          ? 'top-2 text-xs text-blue-300'
                          : 'top-4 text-gray-400'
                      }`}
                    >
                      Contraseña *
                    </label>
                    <div className="relative group">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full pt-6 pb-3 px-4 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    {/* Password validation hints */}
                    <div className={`mt-3 space-y-2 text-sm transition-opacity duration-300 ${formData.password ? 'opacity-100' : 'opacity-0'}`} aria-live="polite">
                        <div className={`flex items-center gap-2 transition-colors ${passwordValidation.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                          {passwordValidation.minLength ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          Mínimo 6 caracteres
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordValidation.hasUppercase ? 'text-green-400' : 'text-gray-400'}`}>
                          {passwordValidation.hasUppercase ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          Al menos una mayúscula
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordValidation.hasLowercase ? 'text-green-400' : 'text-gray-400'}`}>
                          {passwordValidation.hasLowercase ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          Al menos una minúscula
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordValidation.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                          {passwordValidation.hasNumber ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          Al menos un número
                        </div>
                      </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <label
                      htmlFor="confirmPassword"
                      className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
                        focusedField === 'confirmPassword' || formData.confirmPassword
                          ? 'top-2 text-xs text-blue-300'
                          : 'top-4 text-gray-400'
                      }`}
                    >
                      Confirmar contraseña *
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full pt-6 pb-3 px-4 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField('')}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !isPasswordValid(passwordValidation)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <span>Crear cuenta</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-gray-300">
                  ¿Ya tienes cuenta?{' '}
                  <Link
                    href="/login"
                    className="text-blue-300 hover:text-white font-semibold transition-colors duration-300 hover:underline"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Accede a miles de cursos y recursos de aprendizaje
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}