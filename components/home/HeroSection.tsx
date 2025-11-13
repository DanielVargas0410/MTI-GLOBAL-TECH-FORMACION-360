
'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [heroImage, setHeroImage] = useState<string>("/placeholder.svg");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveHeroImage = async () => {
      try {
        const response = await fetch('http://localhost:3001/hero/active');
        if (response.ok) {
          const data = await response.json();
          if (data.image_url) {
            setHeroImage(data.image_url);
          }
        }
      } catch (error) {
        console.error('Error fetching active hero image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveHeroImage();
  }, []);

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-500 via-cyan-400 to-green-400 opacity-70 animate-gradient-y"></div>

      {/* Floating shapes for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-ping"></div>

      <div className="container relative px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6 animate-fade-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium animate-pulse">
                🚀 ¡Nuevo! Cursos actualizados 2024
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-white drop-shadow-lg">
                Eleva tu Potencial con
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-pulse">
                  Formación 360
                </span>
              </h1>
              <p className="max-w-[600px] text-white/90 md:text-xl leading-relaxed drop-shadow-md">
                Tu camino hacia el éxito profesional comienza aquí. Accede a cursos de alta calidad y transforma tu carrera con tecnología de vanguardia.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Link
                href="/register"
                className="group inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-base font-semibold text-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-white hover:to-gray-50"
              >
                <span className="mr-2">✨</span>
                Regístrate Ahora
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
                  <Link
      href="/login"
      className="group inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-base font-semibold text-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-white hover:to-gray-50"
    >
      Iniciar Sesión
    </Link>

              <Link
                href="#courses"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                <span className="mr-2">🎯</span>
                Explorar Cursos
              </Link>
            </div>

            {/* Stats section */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">👥</span>
                </div>
                <span className="text-sm font-medium">+10,000 estudiantes</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">📚</span>
                </div>
                <span className="text-sm font-medium">50+ cursos</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">⭐</span>
                </div>
                <span className="text-sm font-medium">4.9/5 valoración</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up animation-delay-300">
            <div className="relative">
              {/* Main image with glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <img
                alt="Hero"
                className="relative mx-auto aspect-video overflow-hidden rounded-2xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-2xl hover:shadow-3xl transition-shadow duration-500"
                height="550"
                src={heroImage}
                width="550"
              />

              {/* Floating elements around image */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white text-lg">🎓</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white text-sm">💡</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
