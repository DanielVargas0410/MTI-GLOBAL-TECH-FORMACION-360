# Formación 360

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC)](https://tailwindcss.com/)

Una plataforma educativa completa para formación profesional, construida con Next.js, Express.js y MySQL.

## 📋 Descripción

Formación 360 es una plataforma de aprendizaje en línea que permite a estudiantes acceder a cursos organizados por módulos y videos. Los administradores pueden gestionar contenido, usuarios y certificados. La plataforma incluye sistema de autenticación, seguimiento de progreso y generación de certificados.

### ✨ Características Principales

- 🔐 **Autenticación completa** (registro, login, roles)
- 📚 **Gestión de cursos** por categorías y módulos
- 🎥 **Sistema de videos** con seguimiento de visualización
- 👥 **Panel de administración** para gestionar usuarios y contenido
- 📜 **Generación de certificados** al completar cursos
- 📊 **Dashboard de estudiante** con progreso
- 🎨 **Interfaz moderna** con modo claro/oscuro
- 📱 **Responsive design** para todos los dispositivos

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

### Requisitos Obligatorios
- **Node.js** (versión 18 o superior) - [Descargar](https://nodejs.org/)
  - Verifica la instalación: `node --version`
- **npm** (viene incluido con Node.js, versión 9+)
  - Verifica la instalación: `npm --version`
- **MySQL** (versión 8.0 o superior) - [Descargar](https://www.mysql.com/)
  - Verifica la instalación: `mysql --version`

### Requisitos Opcionales pero Recomendados
- **MySQL Workbench** (para gestión visual de BD) - [Descargar](https://www.mysql.com/products/workbench/)
- **Git** (para clonar el repositorio) - [Descargar](https://git-scm.com/)
- **Visual Studio Code** (editor recomendado) - [Descargar](https://code.visualstudio.com/)

### Librerías y Dependencias Principales

#### Frontend (Next.js + React)
- **Next.js 14.2.5** - Framework React para producción
- **React 18.3.1** - Biblioteca para interfaces de usuario
- **Tailwind CSS 3.4+** - Framework CSS utilitario
- **Radix UI** - Componentes primitivos accesibles
- **Lucide React** - Iconos SVG
- **Next Themes** - Soporte para modo claro/oscuro
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Recharts** - Gráficos y visualizaciones
- **SweetAlert2** - Modales y alertas
- **Sonner** - Notificaciones toast

#### Backend (Express.js + Node.js)
- **Express.js 4.21.2** - Framework web minimalista
- **MySQL2 3.15.0** - Cliente MySQL para Node.js
- **bcrypt 5.1.1** - Hashing de contraseñas
- **CORS 2.8.5** - Middleware para CORS
- **Express Validator 7.0.1** - Validación de datos
- **Multer 1.4.5** - Manejo de archivos multipart
- **Dotenv 16.6.1** - Variables de entorno
- **JWT** (json web tokens) - Autenticación basada en tokens

## 🚀 Instalación y Configuración

### Paso 1: Verificar Requisitos Previos

Antes de instalar, verifica que tienes las versiones correctas:

```bash
# Verificar Node.js y npm
node --version    # Debe ser 18+
npm --version     # Debe ser 9+

# Verificar MySQL
mysql --version   # Debe ser 8.0+
```

### Paso 2: Clonar el Repositorio

```bash
git clone https://github.com/XAlejoShot/Formation360.git
cd Formation360
```

### Paso 3: Configurar la Base de Datos MySQL

#### Opción A: Usando MySQL Workbench (Recomendado)

1. Abre MySQL Workbench
2. Conecta a tu servidor MySQL local
3. Crea una nueva consulta y ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS formacion360 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE formacion360;
```

4. Ve a **File > Open SQL Script**
5. Selecciona el archivo `sqlbd.sql` en la raíz del proyecto
6. Ejecuta el script (botón de rayo)

#### Opción B: Usando Línea de Comandos

```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS formacion360 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Importar esquema
mysql -u root -p formacion360 < sqlbd.sql
```

> **Nota:** Reemplaza `root` con tu usuario de MySQL si es diferente.

### Paso 4: Configurar el Backend

#### Instalar Dependencias del Backend

```bash
cd backend
npm install
```

Esto instalará automáticamente todas las dependencias listadas en `backend/package.json`:
- `express` (servidor web)
- `mysql2` (conexión a MySQL)
- `bcrypt` (encriptación de contraseñas)
- `cors` (manejo de CORS)
- `dotenv` (variables de entorno)
- `multer` (subida de archivos)
- `express-validator` (validación de datos)

#### Configurar Variables de Entorno

Crea el archivo `.env` en la carpeta `backend/`:

```env
# Configuración de la Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=formacion360
DB_PORT=3306

# Puerto del servidor backend
PORT=3001

# JWT Secret (genera una clave segura aleatoria)
JWT_SECRET=mi_clave_secreta_super_segura_2024_jwt_token
```

> **Importante:** Nunca subas el archivo `.env` a control de versiones. Ya está incluido en `.gitignore`.

#### Ejecutar el Backend

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# O modo producción
npm start
```

El backend estará disponible en `http://localhost:3001`

### Paso 5: Configurar el Frontend

#### Instalar Dependencias del Frontend

```bash
# Desde la raíz del proyecto
npm install
```

Esto instalará todas las dependencias de Next.js listadas en `package.json`:
- `next` (framework React)
- `react` y `react-dom` (biblioteca base)
- `tailwindcss` (estilos CSS)
- `@radix-ui/*` (componentes UI)
- `lucide-react` (iconos)
- `next-themes` (modo claro/oscuro)
- `react-hook-form` (manejo de formularios)
- `zod` (validación)
- `recharts` (gráficos)
- `sweetalert2` (alertas)
- `sonner` (notificaciones)

#### Ejecutar el Frontend

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

### Paso 6: Verificar la Instalación

1. Abre tu navegador en `http://localhost:3000`
2. Deberías ver la página principal de Formación 360
3. Prueba registrarte como estudiante
4. Verifica que el backend responde en `http://localhost:3001/test-db`

### Solución de Problemas Comunes

#### Error de conexión a MySQL
- Verifica que MySQL esté ejecutándose
- Confirma las credenciales en `.env`
- Asegúrate de que el usuario tenga permisos

#### Puerto ocupado
- Cambia el puerto en `.env` (PORT=3002)
- O mata el proceso usando el puerto: `npx kill-port 3001`

#### Dependencias faltantes
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Error de CORS
- Asegúrate de que el backend esté ejecutándose en el puerto correcto
- Verifica la URL del backend en las llamadas fetch del frontend

## 📁 Estructura del Proyecto

```
Formation360/
├── app/                    # Páginas Next.js (Frontend)
│   ├── administrador/      # Panel de administración
│   ├── estudiante/         # Panel de estudiante
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   └── page.tsx           # Página principal
├── backend/               # API REST (Express.js)
│   ├── controllers/       # Controladores de rutas
│   ├── routes/           # Definición de rutas
│   ├── uploads/          # Archivos subidos
│   ├── db.js             # Configuración BD
│   └── index.js          # Servidor principal
├── components/           # Componentes React reutilizables
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades y configuraciones
├── public/              # Archivos estáticos
├── sqlbd.sql           # Script de base de datos
├── package.json        # Dependencias frontend
└── README.md          # Este archivo
```

## 🎯 Cómo Usar la Plataforma

### Para Administradores

1. Regístrate como administrador (o solicita acceso)
2. Accede al panel de administración
3. Gestiona categorías, cursos, módulos y videos
4. Administra usuarios y certificados

### Para Estudiantes

1. Regístrate como estudiante
2. Explora los cursos disponibles
3. Activa cursos con códigos de acceso
4. Visualiza videos y completa módulos
5. Obtén certificados al finalizar cursos

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Inicia servidor de producción
- `npm run lint` - Ejecuta linter

### Backend
- `npm run dev` - Inicia servidor con nodemon
- `npm start` - Inicia servidor en producción

## 🌐 URLs de Acceso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Base de datos:** localhost:3306 (MySQL)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 📞 Soporte

Si tienes problemas con la instalación o uso de la plataforma, puedes:

- Revisar los issues del repositorio
- Crear un nuevo issue con detalles del problema
- Contactar al equipo de desarrollo

---

**¡Gracias por usar Formación 360!** 🎓
