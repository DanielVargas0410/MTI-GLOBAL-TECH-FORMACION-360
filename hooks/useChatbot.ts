import { useState, useCallback } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Course {
  id_curso: number;
  titulo: string;
  descripcion: string;
  precio: number;
  estado: string;
  categoria_nombre?: string;
}

interface Module {
  id_modulo: number;
  titulo: string;
  descripcion: string;
  videos: { id_video: number; titulo: string }[];
}

interface Video {
  id_video: number;
  titulo: string;
  descripcion: string;
  video_url: string;
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente de IA de Formación 360. ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre nuestros cursos, precios, módulos y videos.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [contextCourses, setContextCourses] = useState<Course[]>([]);

  const addMessage = useCallback((text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const processMessage = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    addMessage(userMessage, true);

    try {
      const response = await generateResponse(userMessage.toLowerCase());
      addMessage(response, false);
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.', false);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const generateResponse = async (message: string): Promise<string> => {
    // Keywords for different query types
    const greetingKeywords = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey'];
    const helpKeywords = ['ayuda', 'help', 'info', 'información', 'opciones'];
    const courseKeywords = ['curso', 'cursos', 'course', 'courses', 'catálogo', 'catalogo'];
    const priceKeywords = ['precio', 'precios', 'price', 'prices', 'costo', 'costos', 'cuánto', 'cuanto'];
    const moduleKeywords = ['módulo', 'modulos', 'módulos', 'module', 'modules'];
    const videoKeywords = ['video', 'videos', 'video', 'videos', 'lección', 'leccion', 'lesson'];

    // Check for greetings
    if (greetingKeywords.some(keyword => message.includes(keyword))) {
      return '¡Hola! ¿Cómo puedo ayudarte hoy? Puedes preguntarme sobre nuestros cursos, precios, módulos y más.';
    }

    // Check for help queries
    if (helpKeywords.some(keyword => message.includes(keyword))) {
      return 'Claro, puedo ayudarte con lo siguiente:\n\n- **Cursos**: "muéstrame los cursos" o "qué cursos tienen".\n- **Precios**: "cuáles son los precios de los cursos".\n- **Módulos**: "qué módulos tiene el curso X".\n- **Videos**: "qué videos hay disponibles".\n\n¿Qué te gustaría saber?';
    }

    // Check for course-related queries
    if (courseKeywords.some(keyword => message.includes(keyword))) {
      if (priceKeywords.some(keyword => message.includes(keyword))) {
        return await getCoursesWithPrices(message);
      }
       // Check if the user is asking for details about a specific course
      const allCourses = await fetch('http://localhost:3001/cursos').then(res => res.json());
      const mentionedCourse = allCourses.find((course: Course) => message.toLowerCase().includes(course.titulo.toLowerCase()));

      if (mentionedCourse) {
        return await getCourseDetails(message);
      }

      return await getCoursesList(message);
    }

    // Check for price queries
    if (priceKeywords.some(keyword => message.includes(keyword))) {
      return await getCoursesWithPrices(message);
    }

    // Check for module queries
    if (moduleKeywords.some(keyword => message.includes(keyword))) {
      return await getModulesInfo(message);
    }

    // Check for video queries
    if (videoKeywords.some(keyword => message.includes(keyword))) {
      setContextCourses([]); // Clear course context when asking about videos
      return await getVideosInfo();
    }

    // Default response
    return 'Lo siento, no entendí tu pregunta. Puedo ayudarte con información sobre cursos, precios, módulos y videos de Formación 360. ¿Qué te gustaría saber?';
  };

  const getCoursesList = async (message?: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:3001/cursos');
      if (!response.ok) throw new Error('Failed to fetch courses');

      const courses: Course[] = await response.json();
      const activeCourses = courses.filter(course => course.estado === 'activo');

      if (activeCourses.length === 0) {
        return 'Actualmente no hay cursos disponibles.';
      }

      let filteredCourses = activeCourses;
      const stopwords = ['curso', 'cursos', 'para', 'tiene', 'tienen', 'hay', 'un', 'una', 'el', 'la', 'los', 'las', 'de', 'del', 'me', 'puedes', 'mostrar', 'dime', 'quiero', 'saber', 'sobre', 'qué', 'que', 'cuáles', 'son'];
      const keywords = message ? message.toLowerCase().split(' ').filter(word => !stopwords.includes(word) && word.length > 2) : [];

      if (keywords.length > 0) {
        filteredCourses = activeCourses.filter(course => {
          const courseText = `${course.titulo} ${course.descripcion} ${course.categoria_nombre || ''}`.toLowerCase();
          return keywords.some(keyword => courseText.includes(keyword));
        });
      }

      setContextCourses(filteredCourses); // Set context

      if (filteredCourses.length === 0) {
        return 'No encontré cursos que coincidan con tu búsqueda. Intenta con otras palabras.';
      }

      let responseText = keywords.length === 0
        ? 'Estos son nuestros cursos disponibles:\n\n'
        : `Encontré ${filteredCourses.length} cursos relacionados con tu búsqueda:\n\n`;

      filteredCourses.forEach(course => {
        responseText += `• ${course.titulo}\n`;
        if (course.descripcion) {
          responseText += `  ${course.descripcion.substring(0, 100)}${course.descripcion.length > 100 ? '...' : ''}\n`;
        }
        responseText += '\n';
      });

      return responseText;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return 'Lo siento, no pude obtener la lista de cursos en este momento.';
    }
  };

  const getCourseDetails = async (message: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:3001/cursos');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const courses: Course[] = await response.json();
      const activeCourses = courses.filter(course => course.estado === 'activo');

      const mentionedCourse = activeCourses.find(course => message.toLowerCase().includes(course.titulo.toLowerCase()));

      if (mentionedCourse) {
        setContextCourses([mentionedCourse]); // Set context
        let responseText = `Aquí tienes los detalles del curso "${mentionedCourse.titulo}":\n\n`;
        responseText += `**Descripción**: ${mentionedCourse.descripcion}\n`;
        responseText += `**Precio**: $${mentionedCourse.precio.toLocaleString('es-CO')}\n`;
        if (mentionedCourse.categoria_nombre) {
          responseText += `**Categoría**: ${mentionedCourse.categoria_nombre}\n`;
        }
        // You could add module and video counts here if available on the course object
        return responseText;
      }

      return 'No pude encontrar un curso con ese nombre. ¿Puedes intentarlo de nuevo?';
    } catch (error) {
      console.error('Error fetching course details:', error);
      return 'Lo siento, no pude obtener los detalles del curso en este momento.';
    }
  };

  const getCoursesWithPrices = async (message?: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:3001/cursos');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const courses: Course[] = await response.json();
      const activeCourses = courses.filter(course => course.estado === 'activo');

      if (activeCourses.length === 0) {
        return 'Actualmente no hay cursos disponibles.';
      }

      // New logic: check for keywords in the message to filter courses
      const stopwords = ['curso', 'cursos', 'para', 'tiene', 'tienen', 'hay', 'un', 'una', 'el', 'la', 'los', 'las', 'de', 'del', 'me', 'puedes', 'mostrar', 'dime', 'quiero', 'saber', 'sobre', 'qué', 'que', 'cuáles', 'son', 'precio', 'precios', 'costo', 'costos', 'cuánto', 'cuanto'];
      const keywords = message ? message.toLowerCase().split(' ').filter(word => !stopwords.includes(word) && word.length > 2) : [];

      let targetCourses = contextCourses;

      if (keywords.length > 0) {
        targetCourses = activeCourses.filter(course => {
          const courseText = `${course.titulo} ${course.descripcion} ${course.categoria_nombre || ''}`.toLowerCase();
          return keywords.some(keyword => courseText.includes(keyword));
        });

        if (targetCourses.length > 0) {
          setContextCourses(targetCourses); // Update context if new courses are found
        } else {
          targetCourses = contextCourses; // Revert to previous context if no new courses match
        }
      }

      if (targetCourses.length === 0) {
        // Fallback: list all courses with prices if no context and no keywords
        let responseText = 'Estos son nuestros cursos con sus precios:\n\n';
        activeCourses.forEach(course => {
          responseText += `• ${course.titulo}\n`;
          responseText += `  Precio: $${course.precio.toLocaleString('es-CO')}\n`;
          if (course.categoria_nombre) {
            responseText += `  Categoría: ${course.categoria_nombre}\n`;
          }
          responseText += '\n';
        });
        return responseText;
      }

      if (targetCourses.length === 1) {
        const course = targetCourses[0];
        return `El precio del curso "${course.titulo}" es $${course.precio.toLocaleString('es-CO')}.`;
      }

      // If multiple courses match, list them and their prices
      let responseText = `Encontré ${targetCourses.length} cursos que coinciden. Estos son sus precios:\n\n`;
      targetCourses.forEach(course => {
        responseText += `• ${course.titulo}: $${course.precio.toLocaleString('es-CO')}\n`;
      });
      return responseText;

    } catch (error) {
      console.error('Error fetching courses with prices:', error);
      return 'Lo siento, no pude obtener la información de precios en este momento.';
    }
  };

  const getModulesInfo = async (message?: string): Promise<string> => {
    try {
      // Get all courses first to get course IDs
      const coursesResponse = await fetch('http://localhost:3001/cursos');
      if (!coursesResponse.ok) throw new Error('Failed to fetch courses');

      const courses: Course[] = await coursesResponse.json();
      const activeCourses = courses.filter(course => course.estado === 'activo');

      if (activeCourses.length === 0) {
        return 'No hay cursos disponibles para mostrar módulos.';
      }

      // Check for a specific course in the message
      if (message) {
        const mentionedCourse = activeCourses.find(course => message.toLowerCase().includes(course.titulo.toLowerCase()));
        if (mentionedCourse) {
          setContextCourses([mentionedCourse]); // Set context
          const modulesResponse = await fetch(`http://localhost:3001/modulos/curso/${mentionedCourse.id_curso}`);
          if (modulesResponse.ok) {
            const modules: Module[] = await modulesResponse.json();
            if (modules.length > 0) {
              let responseText = `El curso "${mentionedCourse.titulo}" tiene los siguientes módulos:\n\n`;
              modules.forEach(module => {
                responseText += `• ${module.titulo} (${module.videos?.length || 0} videos)\n`;
              });
              return responseText;
            } else {
              return `El curso "${mentionedCourse.titulo}" no parece tener módulos todavía.`;
            }
          }
        }
      }

      // If no specific course in message, use context
      if (contextCourses.length === 1) {
        const course = contextCourses[0];
        const modulesResponse = await fetch(`http://localhost:3001/modulos/curso/${course.id_curso}`);
        if (modulesResponse.ok) {
          const modules: Module[] = await modulesResponse.json();
          if (modules.length > 0) {
            let responseText = `El curso "${course.titulo}" tiene los siguientes módulos:\n\n`;
            modules.forEach(module => {
              responseText += `• ${module.titulo} (${module.videos?.length || 0} videos)\n`;
            });
            return responseText;
          } else {
            return `El curso "${course.titulo}" no parece tener módulos todavía.`;
          }
        }
      }

      if (contextCourses.length > 1) {
        let responseText = 'Tengo información sobre varios cursos. ¿De cuál te gustaría saber los módulos?\n\n';
        contextCourses.forEach(course => {
          responseText += `• ${course.titulo}\n`;
        });
        return responseText;
      }

      let responseText = 'Información sobre módulos de nuestros cursos:\n\n';

      for (const course of activeCourses.slice(0, 3)) { // Limit to first 3 courses
        try {
          const modulesResponse = await fetch(`http://localhost:3001/modulos/curso/${course.id_curso}`);
          if (modulesResponse.ok) {
            const modules: Module[] = await modulesResponse.json();
            if (modules.length > 0) {
              responseText += `Curso: ${course.titulo}\n`;
              modules.forEach(module => {
                responseText += `• ${module.titulo} (${module.videos?.length || 0} videos)\n`;
              });
              responseText += '\n';
            }
          }
        } catch (error) {
          console.error(`Error fetching modules for course ${course.id_curso}:`, error);
        }
      }

      if (responseText === 'Información sobre módulos de nuestros cursos:\n\n') {
        return 'No pude obtener información detallada de módulos en este momento.';
      }

      return responseText;
    } catch (error) {
      console.error('Error fetching modules info:', error);
      return 'Lo siento, no pude obtener información sobre módulos.';
    }
  };

  const getVideosInfo = async (): Promise<string> => {
    try {
      // Get all videos
      const response = await fetch('http://localhost:3001/videos');
      if (!response.ok) throw new Error('Failed to fetch videos');

      const videos: Video[] = await response.json();

      if (videos.length === 0) {
        return 'Actualmente no hay videos disponibles.';
      }

      let responseText = 'Tenemos disponibles los siguientes videos:\n\n';
      // Group videos by module or show first 10
      const limitedVideos = videos.slice(0, 10);
      limitedVideos.forEach(video => {
        responseText += `• ${video.titulo}\n`;
      });

      if (videos.length > 10) {
        responseText += `\n... y ${videos.length - 10} videos más.`;
      }

      return responseText;
    } catch (error) {
      console.error('Error fetching videos info:', error);
      return 'Lo siento, no pude obtener información sobre videos.';
    }
  };

  return {
    messages,
    isLoading,
    processMessage,
  };
};
