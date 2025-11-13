"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, Sparkles, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 light:from-gray-100 light:via-purple-100 light:to-gray-100 text-white dark:text-white light:text-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/20 dark:to-purple-500/20 light:from-blue-300/20 light:to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-orange-500/20 dark:from-pink-500/20 dark:to-orange-500/20 light:from-pink-300/20 light:to-orange-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/10 dark:to-pink-500/10 light:from-purple-300/10 light:to-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute top-10 right-20 w-2 h-2 bg-yellow-400 dark:bg-yellow-400 light:bg-yellow-200 rounded-full animate-ping"></div>
      <div className="absolute bottom-10 left-20 w-3 h-3 bg-pink-400 dark:bg-pink-400 light:bg-pink-200 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400 dark:bg-blue-400 light:bg-blue-200 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>

      <div className="relative container mx-auto px-4 md:px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Formación 360
                </h3>
              </div>
              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed">
                Potenciando tu futuro profesional con educación de calidad y tecnología de vanguardia.
              </p>
            </div>

            {/* Social media */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white dark:text-white light:text-gray-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400 dark:text-pink-400 light:text-pink-300" />
                Síguenos
              </h4>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#", color: "hover:text-blue-400", bg: "hover:bg-blue-500/20" },
                  { icon: Twitter, href: "#", color: "hover:text-sky-400", bg: "hover:bg-sky-500/20" },
                  { icon: Instagram, href: "#", color: "hover:text-pink-400", bg: "hover:bg-pink-500/20" },
                  { icon: Linkedin, href: "#", color: "hover:text-blue-500", bg: "hover:bg-blue-500/20" }
                ].map(({ icon: Icon, href, color, bg }, index) => (
                  <Link
                    key={index}
                    href={href}
                    className={`group w-10 h-10 bg-white/10 dark:bg-white/10 light:bg-gray-800/10 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 ${color} ${bg} hover:scale-110 hover:shadow-lg`}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400 dark:text-green-400 light:text-green-300" />
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Inicio", emoji: "🏠" },
                { href: "#courses", label: "Cursos", emoji: "📚" },
                { href: "#", label: "Sobre Nosotros", emoji: "👥" },
                { href: "#", label: "Contacto", emoji: "📞" }
              ].map(({ href, label, emoji }, index) => (
                <li key={index}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="text-sm">{emoji}</span>
                    <span className="group-hover:underline decoration-2 underline-offset-4">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400 dark:text-red-400 light:text-red-300" />
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#", label: "Términos de Servicio", emoji: "📋" },
                { href: "#", label: "Política de Privacidad", emoji: "🔒" }
              ].map(({ href, label, emoji }, index) => (
                <li key={index}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="text-sm">{emoji}</span>
                    <span className="group-hover:underline decoration-2 underline-offset-4">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-400 dark:text-orange-400 light:text-orange-300" />
              Contacto
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-300 dark:text-gray-300 light:text-gray-600">
                <Mail className="w-5 h-5 text-purple-400 dark:text-purple-400 light:text-purple-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Email</p>
                  <a href="mailto:info@formacion360.com" className="hover:text-purple-300 dark:hover:text-purple-300 light:hover:text-purple-400 transition-colors duration-300">
                    info@formacion360.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300 dark:text-gray-300 light:text-gray-600">
                <Phone className="w-5 h-5 text-green-400 dark:text-green-400 light:text-green-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Teléfono</p>
                  <a href="tel:+11234567890" className="hover:text-green-300 dark:hover:text-green-300 light:hover:text-green-400 transition-colors duration-300">
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t border-gray-700 dark:border-gray-700 light:border-gray-300">
          <div className="max-w-md mx-auto text-center space-y-4">
            <h4 className="text-lg font-semibold text-white dark:text-white light:text-gray-900">¡Mantente actualizado!</h4>
            <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 text-sm">Suscríbete para recibir las últimas noticias y ofertas exclusivas.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu email aquí..."
                className="flex-1 px-4 py-2 bg-white/10 dark:bg-white/10 light:bg-gray-800/10 backdrop-blur-sm border border-gray-600 dark:border-gray-600 light:border-gray-400 rounded-lg text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 light:focus:ring-purple-400 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-500 dark:to-pink-500 light:from-purple-300 light:to-pink-300 text-white dark:text-white light:text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/25 dark:hover:shadow-purple-500/25 light:hover:shadow-purple-300/25 transition-all duration-300 hover:scale-105">
                Suscribir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="relative border-t border-gray-700 dark:border-gray-700 light:border-gray-300 bg-black/20 dark:bg-black/20 light:bg-gray-100/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Formación 360. Todos los derechos reservados.
              <span className="inline-block ml-2 text-red-400 dark:text-red-400 light:text-red-300 animate-pulse">♥</span>
            </p>

            {/* Scroll to top button */}
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-600 dark:to-pink-600 light:from-purple-400 light:to-pink-400 text-white dark:text-white light:text-gray-900 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 dark:hover:shadow-purple-500/25 light:hover:shadow-purple-300/25 transition-all duration-300 hover:scale-105"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Volver arriba</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
