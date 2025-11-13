-- =============================================
-- BASE DE DATOS: FORMACIÓN 360 - AUDITORÍA SIMPLE
-- =============================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS formacion360;
USE formacion360;

-- =============================================
-- 1. TABLA: USUARIOS
-- =============================================
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) DEFAULT NULL,
    direccion VARCHAR(300) DEFAULT NULL,
    ciudad VARCHAR(100) DEFAULT NULL,
    pais VARCHAR(100) DEFAULT 'Colombia',
    password_hash VARCHAR(255) NOT NULL,
    foto_perfil_url VARCHAR(500) DEFAULT NULL,
    rol ENUM('administrador', 'estudiante') NOT NULL DEFAULT 'estudiante',
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultimo_acceso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_telefono (telefono)
);

-- =============================================
-- 2. TABLA: CATEGORÍAS
-- =============================================
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_estado (estado)
);

-- =============================================
-- 3. TABLA: CURSOS
-- =============================================
CREATE TABLE cursos (
    id_curso INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    imagen_url VARCHAR(500) DEFAULT NULL,
    codigo_acceso VARCHAR(20) UNIQUE NOT NULL,
    id_categoria INT NOT NULL,
    precio DECIMAL(10,2) DEFAULT 0.00,
    estado ENUM('borrador', 'activo', 'inactivo') DEFAULT 'borrador',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_publicacion TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    INDEX idx_codigo_acceso (codigo_acceso),
    INDEX idx_categoria (id_categoria),
    INDEX idx_titulo (titulo),
    INDEX idx_estado (estado)
);

-- =============================================
-- 4. TABLA: MÓDULOS
-- =============================================
CREATE TABLE modulos (
    id_modulo INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    id_curso INT NOT NULL,
    numero_orden INT NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE,
    UNIQUE KEY unique_curso_orden (id_curso, numero_orden),
    INDEX idx_curso_orden (id_curso, numero_orden)
);

-- =============================================
-- 5. TABLA: VIDEOS
-- =============================================
CREATE TABLE videos (
    id_video INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    video_url VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(500) DEFAULT NULL,
    id_modulo INT NOT NULL,
    numero_orden INT NOT NULL,
    estado ENUM('activo', 'inactivo', 'procesando') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_modulo) REFERENCES modulos(id_modulo) ON DELETE CASCADE,
    UNIQUE KEY unique_modulo_orden (id_modulo, numero_orden),
    INDEX idx_modulo_orden (id_modulo, numero_orden),
    INDEX idx_titulo (titulo)
);

-- =============================================
-- 6. TABLA: CURSOS_ESTUDIANTE
-- =============================================
CREATE TABLE cursos_estudiante (
    id_curso_estudiante INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    codigo_activacion VARCHAR(10) ,
    fecha_activacion TIMESTAMP NULL DEFAULT NULL,
    estado ENUM('pendiente', 'activo', 'completado', 'pausado') DEFAULT 'pendiente',
    videos_vistos INT DEFAULT 0,
    fecha_ultimo_acceso TIMESTAMP NULL,
    comentario_curso TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_curso (id_usuario, id_curso),
    INDEX idx_usuario (id_usuario),
    INDEX idx_curso (id_curso),
    INDEX idx_estado (estado)
);

-- =============================================
-- 7. TABLA: VIDEOS_VISTOS
-- =============================================
CREATE TABLE videos_vistos (
    id_visto INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_video INT NOT NULL,
    fecha_primera_vista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_vista TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_video) REFERENCES videos(id_video) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_video (id_usuario, id_video),
    INDEX idx_usuario (id_usuario),
    INDEX idx_video (id_video)
);


-- =============================================
-- 8. TABLA: CERTIFICADOS
-- =============================================
CREATE TABLE certificados (
    id_certificado INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    codigo_certificado VARCHAR(50) UNIQUE NOT NULL,
    nombre_certificado VARCHAR(255) DEFAULT NULL ,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'revocado') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_curso_cert (id_usuario, id_curso),
    INDEX idx_codigo (codigo_certificado),
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha_emision (fecha_emision)
);


-- =============================================
-- 9. TABLA: ACTIVIDADES (solo auditoría de visualización)
-- =============================================
CREATE TABLE actividades (
    id_actividad INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo_actividad ENUM(
        'login', 'logout',
        'curso_activado',
        'video_visto',
        'curso_completado',
        'certificado_generado'
    ) NOT NULL,
    descripcion VARCHAR(500) DEFAULT NULL,
    id_curso INT DEFAULT NULL,   -- se guarda como referencia informativa, no FK
    id_video INT DEFAULT NULL,   -- se guarda como referencia informativa, no FK
    user_agent TEXT DEFAULT NULL,
    fecha_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario_fecha (id_usuario, fecha_actividad),
    INDEX idx_tipo (tipo_actividad),
    INDEX idx_fecha (fecha_actividad)
);

CREATE TABLE hero_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL COMMENT 'Ruta o URL de la imagen',
    titulo VARCHAR(150) NULL COMMENT 'Título opcional para la imagen',
    descripcion VARCHAR(255) NULL COMMENT 'Descripción opcional',
    estado ENUM('activo', 'inactivo') DEFAULT 'inactivo' COMMENT 'Controla cuál imagen se usa en el Hero',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
