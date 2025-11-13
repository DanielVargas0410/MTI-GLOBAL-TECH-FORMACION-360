
import { Briefcase, Users, Zap, Award, Star, BookOpen, Clock, Trophy } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Cursos Relevantes",
      description: "Contenido actualizado y enfocado en las demandas del mercado laboral.",
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
      emoji: "📚"
    },
    {
      icon: Users,
      title: "Instructores Expertos",
      description: "Aprende de profesionales con años de experiencia en la industria.",
      color: "from-purple-500 to-pink-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
      emoji: "👨‍🏫"
    },
    {
      icon: Zap,
      title: "Aprendizaje Flexible",
      description: "Accede a tus cursos en cualquier momento y desde cualquier dispositivo.",
      color: "from-green-500 to-emerald-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
      emoji: "⚡"
    },
    {
      icon: Trophy,
      title: "Certificación",
      description: "Obtén certificados que validan tus nuevas habilidades y conocimientos.",
      color: "from-orange-500 to-red-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600",
      emoji: "🏆"
    }
  ];

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium animate-pulse">
              <Star className="w-4 h-4 mr-2" />
              Características Clave
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              ¿Por qué elegir Formación 360?
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300 leading-relaxed">
              Ofrecemos una plataforma robusta con todo lo que necesitas para llevar tu desarrollo profesional al siguiente nivel.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-8 py-16 lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl ${feature.bgColor} border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-${feature.iconColor.split('-')[1]}-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>

                {/* Floating emoji */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce">
                  <span className="text-sm">{feature.emoji}</span>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* Icon with gradient background */}
                  <div className={`relative p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6`}>
                    <IconComponent className="h-8 w-8 text-white" />
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Animated border */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                </div>

                {/* Floating particles effect */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
              </div>
            );
          })}
        </div>

        {/* Call to action section */}
        <div className="text-center mt-16">
          <a
            href="/register"
            className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-gray-800 to-blue-900 text-white font-bold shadow-lg hover:shadow-xl hover:from-gray-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <Zap className="w-6 h-6 mr-3 transform group-hover:scale-110 transition-transform duration-300" />
            <span className="text-lg">¡Comienza tu transformación hoy!</span>
            <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
