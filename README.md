# 🚀 DevMatch

**DevMatch** es una plataforma innovadora diseñada para conectar a estudiantes universitarios en proyectos colaborativos, basándose en la compatibilidad de sus habilidades técnicas, disponibilidad de horario y perfiles psicológicos (Metodología Belbin).

---

## 🌟 Características Principales

*   **Motor de Matchmaking Inteligente:** Algoritmo que recomienda los mejores proyectos para cada desarrollador, cruzando variables técnicas, de tiempo y de personalidad.
*   **Gestión Integral de Proyectos:** Los líderes pueden crear, administrar vacantes y aceptar/rechazar postulantes desde un panel de control avanzado.
*   **Evaluaciones Integradas:** Módulos para realizar exámenes técnicos y tests psicométricos directamente en la plataforma.
*   **Sistema de Notificaciones:** Avisos en tiempo real sobre el estado de las postulaciones y matches de equipo.
*   **Seguridad:** Autenticación de usuarios con contraseñas encriptadas.

---

## 🛠️ Arquitectura y Stack Tecnológico

El proyecto es un monorepo que contiene tanto el cliente como el servidor, divididos en dos carpetas principales:

### 🎨 Frontend (`/frontend`)
*   **Tecnologías:** HTML5, CSS3 y Vanilla JavaScript.
*   **Características:** Diseño moderno y completamente responsivo, consumo de API REST de forma asíncrona, alertas dinámicas y vistas personalizadas por rol (líder vs desarrollador).

### ⚙️ Backend (`/backend`)
*   **Entorno:** Node.js + Express.js
*   **Base de Datos:** PostgreSQL
*   **ORM:** Prisma
*   **Despliegue:** Amazon Web Services (AWS EC2), orquestado con **PM2** y servido a través de **Nginx** con certificados SSL.

---

## 🚀 Entorno de Producción

La plataforma se encuentra en fase de producción. La API central de DevMatch se sirve a través de:
👉 **`https://devmatch.com.mx/api/`**

---

## 💡 Motivación

Este sistema fue desarrollado como respuesta a la necesidad de optimizar la conformación de equipos de trabajo en entornos académicos, asegurando que los perfiles se complementen tanto a nivel técnico (Hard Skills) como a nivel humano y organizacional (Soft Skills y Roles Belbin).
