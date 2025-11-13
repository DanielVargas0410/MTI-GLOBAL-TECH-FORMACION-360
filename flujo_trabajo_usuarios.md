
# Manual de Usuario Detallado

Este manual proporciona una guía exhaustiva, paso a paso, para utilizar todas las funcionalidades de la plataforma de e-learning. Está dividido en dos grandes secciones: una para el rol de **Administrador** y otra para el rol de **Estudiante**.

---

## 1. Manual del Administrador

El panel de administrador es el centro de control de la plataforma. Desde aquí, puedes gestionar cada aspecto del contenido, los usuarios y la configuración del sistema.

### 1.1. Acceso y Panel Principal (Dashboard)

Al iniciar sesión con tus credenciales de administrador, serás dirigido al panel principal. Este dashboard te ofrece una vista rápida y consolidada de la actividad en la plataforma.

*   **Tarjetas de Estadísticas (`AdminStatsSection`):** Verás métricas clave como:
    *   **Total de Usuarios Registrados:** Cuántas personas usan la plataforma.
    *   **Total de Cursos Activos:** El número de cursos disponibles.
    *   **Total de Inscripciones:** Cuántas veces los usuarios se han inscrito a cursos.
    *   **Ingresos (si aplica):** Un resumen financiero.
*   **Actividad Reciente:** Un listado de las últimas acciones importantes, como nuevos usuarios registrados o finalizaciones de cursos.

### 1.2. Módulo de Gestión de Usuarios

Esta sección es fundamental para administrar a la comunidad de la plataforma.

**Ruta de acceso:** Menú lateral → **Usuarios**

#### Cómo ver la lista de usuarios:
1.  Al entrar en la sección, verás una tabla con columnas como `Nombre`, `Email`, `Rol` y `Fecha de Registro`.
2.  Utiliza la **barra de búsqueda** en la parte superior para encontrar un usuario específico por su nombre o correo.
3.  Puedes **ordenar** la lista haciendo clic en los encabezados de las columnas.

#### Cómo crear un nuevo usuario:
1.  Haz clic en el botón **"Añadir Nuevo Usuario"**.
2.  Se abrirá un formulario (`RegisterForm`) donde deberás completar:
    *   **Nombre y Apellidos:** Datos identificativos del usuario.
    *   **Correo Electrónico:** Será su nombre de usuario para el login.
    *   **Contraseña:** Asigna una contraseña segura.
    *   **Rol:** Selecciona si será `Estudiante` o `Administrador`.
3.  Haz clic en **"Guardar"**. El usuario recibirá una notificación (si está configurado) y podrá iniciar sesión.

#### Cómo editar o eliminar un usuario:
1.  En la lista de usuarios, localiza al que deseas modificar.
2.  En la fila correspondiente, haz clic en el icono de **Editar** (lápiz) o **Eliminar** (papelera).
3.  **Al editar:** Se abrirá el mismo formulario de creación, pero con los datos del usuario. Modifica lo que necesites y haz clic en **"Actualizar"**.
4.  **Al eliminar:** Aparecerá un cuadro de diálogo de confirmación para evitar borrados accidentales. Confirma para eliminar al usuario permanentemente.

### 1.3. Módulo de Gestión de Cursos

Aquí es donde se crea, edita y estructura toda la oferta formativa.

**Ruta de acceso:** Menú lateral → **Cursos**

#### Cómo crear un nuevo curso:
1.  Haz clic en el botón **"Crear Nuevo Curso"**.
2.  Rellena el formulario detallado:
    *   **Título del Curso:** Un nombre claro y atractivo.
    *   **Descripción Completa:** Explica de qué trata el curso, a quién va dirigido y qué aprenderán los estudiantes.
    *   **Categoría:** Asigna una categoría previamente creada (ej: "Desarrollo Web").
    *   **Imagen de Portada:** Sube una imagen representativa para el curso. Esta es la que se mostrará en el catálogo.
    *   **Nivel de Dificultad:** (Opcional) Principiante, Intermedio, Avanzado.
3.  Haz clic en **"Guardar Curso"**. El curso se creará como un "borrador" y podrás empezar a añadirle contenido.

#### Cómo gestionar el contenido de un curso (Módulos y Videos):
1.  En la lista de cursos, busca el curso que quieres gestionar y haz clic en el botón **"Administrar Contenido"** o en su título.
2.  Serás llevado a la vista de estructuración del curso.

##### **Gestión de Módulos:**
*   **Crear un Módulo:**
    1.  Haz clic en **"Añadir Módulo"**.
    2.  Introduce un **título** para el módulo (ej: "Módulo 1: Introducción a React").
    3.  Haz clic en **"Guardar"**. El módulo aparecerá en la lista.
*   **Editar o Eliminar un Módulo:**
    1.  Junto al nombre del módulo, verás los iconos de **Editar** y **Eliminar**.
    2.  Usa estas opciones para cambiar el nombre o borrar el módulo completo (se te pedirá confirmación).

##### **Gestión de Videos (Lecciones) dentro de un Módulo:**
*   **Añadir un Video:**
    1.  Debajo del título de cada módulo, haz clic en **"Añadir Video"**.
    2.  Completa el formulario de la lección:
        *   **Título del Video:** El nombre de la lección (ej: "Instalación de Node.js").
        *   **URL del Video:** Pega el enlace del video (Vimeo, YouTube, o la URL del archivo si usas un servicio de hosting propio).
        *   **Descripción/Recursos:** (Opcional) Añade texto con enlaces a recursos, código fuente, etc.
    3.  Haz clic en **"Guardar Video"**. La lección aparecerá anidada dentro de su módulo.

### 1.4. Módulos Adicionales

#### Gestión de Categorías
**Ruta de acceso:** Menú lateral → **Categorías**
*   Esta sección es muy sencilla. Verás una lista de las categorías existentes.
*   Puedes **Añadir** una nueva categoría con un solo campo de nombre, o **Editar/Eliminar** las existentes.

#### Gestión de Certificados
**Ruta de acceso:** Menú lateral → **Certificados**
*   **Diseñar Plantilla:** Sube una plantilla de certificado (imagen o PDF) y define las áreas donde se insertará dinámicamente el nombre del estudiante, el nombre del curso y la fecha de finalización.
*   **Asignar a Cursos:** Vincula una plantilla de certificado a uno o más cursos. El sistema lo entregará automáticamente cuando un estudiante complete el 100% de las lecciones.
*   **Ver Certificados Emitidos:** Consulta un registro de todos los certificados que se han generado, a qué usuario y de qué curso.

#### Reportes de Progreso (`videos-vistos` y `cursos_estudiantes`)
**Ruta de acceso:** Menú lateral → **Reportes** o **Actividad**
*   **Progreso por Estudiante:** Selecciona un estudiante para ver un informe detallado de en qué cursos está inscrito y su porcentaje de avance en cada uno.
*   **Progreso por Curso:** Selecciona un curso para ver una lista de todos los estudiantes inscritos y el progreso individual de cada uno. Esto es útil para identificar quién se está quedando atrás.

---

## 2. Manual del Estudiante

El panel de estudiante es tu portal de aprendizaje personalizado, diseñado para ser intuitivo y fácil de usar.

### 2.1. Acceso y Panel Principal (Dashboard)

Al iniciar sesión, tu **Dashboard (`student-dashboard`)** te da la bienvenida. Aquí encontrarás:
*   **Mis Cursos en Progreso:** Acceso directo a los cursos que has empezado pero no has terminado. Verás una barra de progreso visual para cada uno.
*   **Última Actividad:** Un recordatorio del último video que viste, para que puedas continuar justo donde lo dejaste.
*   **Cursos Recomendados:** Sugerencias de otros cursos que podrían interesarte.

### 2.2. El Catálogo de Cursos

Aquí puedes descubrir todo lo que la plataforma tiene para ofrecer.

**Ruta de acceso:** Menú superior → **Explorar Cursos**

#### Cómo encontrar y elegir un curso:
1.  Navega por la cuadrícula de cursos. Cada tarjeta de curso (`CourseDetailView`) muestra su **imagen**, **título** y **categoría**.
2.  Usa la **barra de búsqueda** para buscar por palabras clave.
3.  Utiliza los **filtros** (normalmente a un lado) para acotar la búsqueda por `Categoría` o `Nivel de Dificultad`.
4.  Haz clic en un curso que te interese para ver su página de detalle, que incluye:
    *   La **descripción completa**.
    *   El **temario detallado** (lista de módulos y videos).
    *   La duración total estimada.

#### Cómo inscribirse en un curso:
1.  En la página de detalle del curso, haz clic en el botón grande que dice **"Inscribirme Ahora"** o **"Empezar a Aprender"**.
2.  ¡Listo! El curso se añadirá automáticamente a tu sección de "Mis Cursos".

### 2.3. Tu Experiencia de Aprendizaje

Una vez inscrito, el aprendizaje es sencillo y directo.

**Ruta de acceso:** Menú superior → **Mis Cursos**

#### Cómo ver las lecciones:
1.  Haz clic en el curso que deseas tomar.
2.  Serás llevado a la **interfaz del reproductor**. Típicamente, verás:
    *   **A la izquierda o en el centro:** El reproductor de video principal.
    *   **A la derecha:** El temario completo del curso, con todos los módulos y videos. El video que estás viendo actualmente estará resaltado.
3.  Para avanzar, puedes hacer clic en el siguiente video de la lista o usar el botón **"Siguiente Lección"** debajo del reproductor.

#### Cómo seguir tu progreso:
*   Debajo de cada video, verás un botón o checkbox que dice **"Marcar como Completado"**.
*   Al marcarlo, tu **barra de progreso** general del curso se actualizará.
*   El sistema recordará qué lecciones has completado, para que siempre sepas cuál es tu siguiente paso.

### 2.4. Tu Perfil y Certificados

#### Gestionar tu perfil:
1.  Haz clic en tu **icono de perfil** en la esquina superior derecha y selecciona **"Mi Perfil"**.
2.  Aquí puedes:
    *   **Cambiar tu nombre.**
    *   **Actualizar tu contraseña.**
    *   **Subir o cambiar tu foto de perfil.**

#### Ver tus certificados:
1.  En el mismo menú de perfil, selecciona **"Mis Certificados"**.
2.  Verás una lista de todos los cursos que has completado al 100%.
3.  Junto a cada curso completado, habrá un botón de **"Descargar Certificado"** que te permitirá guardar una copia en PDF.
