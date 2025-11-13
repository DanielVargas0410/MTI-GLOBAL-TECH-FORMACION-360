'use client'

import { useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, CheckCircle, User } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido de vuelta! 🎉',
          text: `Hola ${data.user.nombre_completo}`,
          confirmButtonText: 'Continuar',
          background: '#1f2937',
          color: '#ffffff',
          confirmButtonColor: '#8b5cf6',
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          // Redirigir según el rol
          if (data.user.rol === 'administrador') {
            window.location.href = '/administrador'
          } else if (data.user.rol === 'estudiante') {
            window.location.href = '/estudiante'
          } else {
            window.location.href = '/dashboard'
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: data.error || 'Credenciales incorrectas',
          confirmButtonText: 'Intentar nuevamente',
          background: '#1f2937',
          color: '#ffffff',
          confirmButtonColor: '#ef4444'
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        confirmButtonText: 'Aceptar',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute top-10 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-10 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span className="text-sm font-medium">Volver al Inicio</span>
              </Link>
            </div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Formación 360
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Bienvenido de vuelta!
            </h2>
            <p className="text-gray-300 text-lg">
              Accede a tu cuenta y continúa aprendiendo
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                    focusedField === 'email' || email
                      ? 'top-2 text-xs text-indigo-300'
                      : 'top-4 text-gray-400'
                  }`}
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pt-6 pb-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                    focusedField === 'password' || password
                      ? 'top-2 text-xs text-indigo-300'
                      : 'top-4 text-gray-400'
                  }`}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pt-6 pb-3 px-4 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <Lock className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  href="#"
                  className="text-indigo-300 hover:text-white text-sm transition-colors duration-300 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <span>Iniciar sesión</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-gray-300">
                  ¿No tienes cuenta?{' '}
                  <Link
                    href="/register"
                    className="text-indigo-300 hover:text-white font-semibold transition-colors duration-300 hover:underline"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Credenciales de prueba:
            </h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p><strong>Admin:</strong> admin@mtiglobaltech.com / admin123</p>
              <p><strong>Estudiante:</strong> estudiante@email.com / estudiante123</p>
            </div>
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
  )
}
