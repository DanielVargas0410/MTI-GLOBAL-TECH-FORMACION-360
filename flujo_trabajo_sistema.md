# Documentación Técnica del Sistema

## 1. Descripción General

Este proyecto es una plataforma de e-learning diseñada para ofrecer y gestionar cursos en línea. La solución permite a los administradores crear, organizar y supervisar el contenido educativo, mientras que los estudiantes pueden inscribirse en cursos, consumir el material de aprendizaje y realizar un seguimiento de su progreso.

El sistema se compone de tres partes principales:

*   **Frontend**: Una aplicación web moderna y receptiva con la que interactúan los usuarios (estudiantes y administradores).
*   **Backend**: Una API RESTful que gestiona la lógica de negocio, la autenticación de usuarios y la comunicación con la base de datos.
*   **Base de Datos**: Un sistema de base de datos relacional que almacena toda la información de la plataforma, incluyendo usuarios, cursos, módulos, videos y progreso del estudiante.

## 2. Tecnologías Utilizadas

*   **Frontend**:
    *   **Next.js**: Un framework de React para construir aplicaciones web renderizadas en el servidor (SSR) y generadas estáticamente (SSG).
    *   **TypeScript**: Un superconjunto de JavaScript que añade tipado estático para un desarrollo más robusto.
    *   **Tailwind CSS**: Un framework de CSS de utilidad para un diseño rápido y personalizado.
    *   **shadcn/ui**: Una colección de componentes de interfaz de usuario reutilizables.

*   **Backend**:
    *   **Node.js**: Un entorno de ejecución de JavaScript del lado del servidor.
    *   **Express.js**: Un framework de aplicación web para Node.js, utilizado para construir la API REST.
    *   **MySQL/MariaDB**: El sistema de gestión de bases de datos relacional.

*   **Base de Datos**:
    *   **SQL**: El lenguaje de consulta estructurado utilizado para interactuar con la base de datos. El archivo `sqlbd.sql` contiene el esquema y los datos iniciales.

## 3. Arquitectura del Proyecto

El sistema sigue una arquitectura de **API RESTful**, donde el frontend (cliente) y el backend (servidor) están desacoplados.

*   El **frontend** se encarga de la presentación y la experiencia del usuario. Realiza solicitudes HTTP (peticiones) al backend para obtener o enviar datos.
*   El **backend** expone una serie de *endpoints* (rutas) que el frontend puede consumir. Se encarga de procesar las solicitudes, aplicar la lógica de negocio y interactuar con la base de datos.
*   La **base de datos** actúa como la capa de persistencia, almacenando los datos de forma organizada y segura.

## 4. Estructura de Carpetas

A continuación se describe la estructura del proyecto y el propósito de las carpetas y archivos más importantes:

```
.
├── app/                # Contiene el código fuente del frontend (Next.js)
│   ├── administrador/  # Páginas y componentes específicos del panel de administrador
│   ├── estudiante/     # Páginas y componentes específicos del panel de estudiante
│   ├── login/          # Página de inicio de sesión
│   ├── register/       # Página de registro
│   ├── layout.tsx      # Plantilla principal de la aplicación
│   └── page.tsx        # Página de inicio
├── backend/            # Contiene el código fuente del backend (Node.js/Express)
│   ├── controllers/    # Lógica para manejar las solicitudes de la API
│   ├── routes/         # Definición de las rutas (endpoints) de la API
│   ├── db.js           # Configuración de la conexión a la base de datos
│   └── index.js        # Punto de entrada del servidor backend
├── components/         # Componentes de React reutilizables en el frontend
│   └── ui/             # Componentes base de la interfaz de usuario (shadcn/ui)
├── public/             # Archivos estáticos (imágenes, logos)
├── sqlbd.sql           # Archivo de volcado de la base de datos
└── ...
```

## 5. Guía de Instalación y Ejecución

Sigue estos pasos para instalar y ejecutar el proyecto en un entorno de desarrollo local.

### Prerrequisitos

*   Node.js (versión 18 o superior)
*   Un gestor de paquetes como `npm` o `pnpm`
*   Un servidor de base de datos MySQL o MariaDB (como XAMPP, WAMP o Docker)

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Configurar la Base de Datos

1.  Inicia tu servidor de base de datos (por ejemplo, Apache y MySQL en XAMPP).
2.  Abre una herramienta de gestión de bases de datos como `phpMyAdmin`.
3.  Crea una nueva base de datos (por ejemplo, `formacion360_db`).
4.  Selecciona la base de datos recién creada y ve a la pestaña de "Importar".
5.  Haz clic en "Seleccionar archivo" y elige el archivo `sqlbd.sql` ubicado en la raíz del proyecto.
6.  Haz clic en "Importar" para ejecutar el script y crear las tablas con los datos iniciales.

### 3. Configurar el Backend

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**: Crea un archivo `.env` en la carpeta `backend` y añade las credenciales de la base de datos. El archivo `db.js` te dará una pista de las variables necesarias. Debería verse así:

    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_DATABASE=formacion360_db
    ```

4.  Ejecuta el servidor de backend:
    ```bash
    node index.js
    ```
    El servidor se iniciará, generalmente en el puerto `3001` o el que esté configurado.

### 4. Configurar el Frontend

1.  Abre una **nueva terminal** y navega a la raíz del proyecto.
2.  Instala las dependencias del frontend:
    ```bash
    npm install
    ```
    *Nota: Si usas `pnpm`, ejecuta `pnpm install`.*

3.  Ejecuta el servidor de desarrollo del frontend:
    ```bash
    npm run dev
    ```
    La aplicación se abrirá en tu navegador, generalmente en `http://localhost:3000`.

## 6. Tablas Principales de la Base de Datos

La base de datos es el corazón del sistema. A continuación, se describen las tablas más importantes:

*   **usuarios**: Almacena la información de todos los usuarios, incluyendo su rol (administrador o estudiante).
    *   `id`, `nombre`, `email`, `password`, `rol_id`, etc.
*   **cursos**: Contiene la información general de cada curso.
    *   `id`, `titulo`, `descripcion`, `imagen_url`, `categoria_id`, etc.
*   **modulos**: Organiza el contenido de un curso en secciones o módulos.
    *   `id`, `titulo`, `curso_id`.
*   **videos**: Almacena la información de cada lección en video.
    *   `id`, `titulo`, `url_video`, `modulo_id`.
*   **cursos_estudiantes**: Tabla intermedia que relaciona a los estudiantes con los cursos en los que están inscritos.
    *   `id`, `usuario_id`, `curso_id`.
*   **videos_vistos**: Realiza un seguimiento del progreso de un estudiante, marcando los videos que ha completado.
    *   `id`, `usuario_id`, `video_id`.

### Relaciones Principales

*   Un `curso` tiene muchos `modulos`.
*   Un `modulo` tiene muchos `videos`.
*   Un `estudiante` (`usuario`) puede inscribirse en muchos `cursos` (a través de `cursos_estudiantes`).
*   Un `estudiante` puede marcar muchos `videos` como vistos (a través de `videos_vistos`).