import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote, Heart, Sparkles, Users } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote: "Formación 360 me dio las herramientas que necesitaba para conseguir el trabajo de mis sueños. ¡Totalmente recomendado!",
      author: "Maria Rodriguez",
      role: "Desarrolladora Frontend",
      avatar: "/placeholder-user.jpg",
      initials: "MR",
      rating: 5,
      gradient: "from-pink-500 to-rose-400",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      emoji: "💖",
      company: "TechCorp"
    },
    {
      id: 2,
      quote: "La calidad del contenido y la experiencia de los instructores es de primer nivel. He aprendido muchísimo.",
      author: "Juan Garcia",
      role: "Gerente de Marketing",
      avatar: "/placeholder-user.jpg",
      initials: "JG",
      rating: 5,
      gradient: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      emoji: "🚀",
      company: "DigitalAgency"
    },
    {
      id: 3,
      quote: "Gracias a la flexibilidad de la plataforma, pude compaginar mis estudios con mi trabajo sin problemas.",
      author: "Laura Sanchez",
      role: "Project Manager",
      avatar: "/placeholder-user.jpg",
      initials: "LS",
      rating: 5,
      gradient: "from-green-500 to-emerald-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      emoji: "🎯",
      company: "InnovateCo"
    }
  ];

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating sparkles */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium animate-bounce">
              <Heart className="w-4 h-4 mr-2" />
              Testimonios
            </div>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300 leading-relaxed">
              Historias de éxito de quienes han transformado su carrera con nosotros. Únete a miles de estudiantes satisfechos.
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-8 pt-16 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group relative p-8 rounded-3xl ${testimonial.bgColor} border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 animate-fade-in-up`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>

              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
                <Quote className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>

              {/* Floating emoji */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce">
                <span className="text-lg">{testimonial.emoji}</span>
              </div>

              <div className="relative space-y-6">
                {/* Rating stars */}
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg font-semibold leading-relaxed text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-600 group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-colors duration-300">
                  <div className="relative">
                    <Avatar className="w-14 h-14 ring-4 ring-white dark:ring-gray-800 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback className={`bg-gradient-to-br ${testimonial.gradient} text-white font-bold text-lg`}>
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                  </div>

                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300 font-medium">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Sparkle effect */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
                </div>
              </div>

              {/* Animated border */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <a
            href="/register"
            className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-gray-800 to-blue-900 text-white font-bold shadow-lg hover:shadow-xl hover:from-gray-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <Users className="w-6 h-6 mr-3 transform group-hover:scale-110 transition-transform duration-300" />
            <span className="text-lg">¡Únete a nuestra comunidad!</span>
            <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
