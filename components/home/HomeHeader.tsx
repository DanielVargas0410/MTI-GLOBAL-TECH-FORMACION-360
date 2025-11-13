"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpenCheck } from "lucide-react";

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BookOpenCheck className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Formación 360
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="#features">Características</Link>
            <Link href="#testimonials">Testimonios</Link>
            <Link href="#courses">Cursos</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <ThemeToggle />
            <Button asChild variant="ghost" className="ml-4">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="ml-4">
              <Link href="/register">Registrarse</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
