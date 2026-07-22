import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { bancoDePreguntas } from '../data/bancoPreguntas';

export const generateTechTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stack } = req.body; // Array de strings, ej: ["Python", "React"]

    // 1. Guardar el stack en el usuario
    await prisma.usuario.update({
      where: { id: Number(id) },
      data: { stack: stack } 
    });

    // 1.1 Sincronizar con tabla relacional para que el matchmaking funcione correctamente
    if (stack && Array.isArray(stack)) {
      await prisma.usuarioHabilidad.deleteMany({
        where: { usuario_id: Number(id) }
      });
      for (const tagName of stack) {
        let skill = await prisma.habilidad.findFirst({ where: { nombre: tagName } });
        if (!skill) {
          skill = await prisma.habilidad.create({ data: { nombre: tagName } });
        }
        await prisma.usuarioHabilidad.create({
          data: {
            usuario_id: Number(id),
            habilidad_id: skill.id,
            nivel: "Básico" // Se asume Básico por defecto al hacer el test
          }
        });
      }
    }

    // 2. Motor de Evaluación: Construir el test de 5 preguntas
    let examenGenerado: any[] = [];
    
    stack.forEach((tech: string) => {
      if (bancoDePreguntas[tech]) {
        // Agregamos las preguntas de esa tecnología al examen con su etiqueta
        const preguntasConTech = bancoDePreguntas[tech].map(p => ({ ...p, tecnologia: tech }));
        examenGenerado = examenGenerado.concat(preguntasConTech);
      } else {
        // Fallback dinámico: Generamos 5 preguntas estándar adaptadas a la tecnología seleccionada
        const fallbackQuestions = [
          { pregunta: `¿Cuál es el propósito principal de usar ${tech} en un entorno de producción?`, opciones: ["Mejorar la escalabilidad y mantenibilidad", "Reducir la velocidad del servidor", "Evitar el uso de bases de datos", "Ninguno de los anteriores"], correcta: "Mejorar la escalabilidad y mantenibilidad", tecnologia: tech },
          { pregunta: `¿Qué ventaja competitiva ofrece el ecosistema de ${tech} frente a alternativas obsoletas?`, opciones: ["Su comunidad activa y documentación oficial", "Que no requiere escribir código", "Solo funciona en Windows 95", "Es de código cerrado sin soporte"], correcta: "Su comunidad activa y documentación oficial", tecnologia: tech },
          { pregunta: `Identifica la estructura de configuración inicial típica para ${tech}:`, codigo: `// Configuración base de ${tech}\nmodule.exports = {\n  environment: "production",\n  strictMode: true\n};`, opciones: ["Es una configuración estándar válida", "Provocará un Kernel Panic", "Borrará el disco duro", "Es sintaxis de HTML"], correcta: "Es una configuración estándar válida", tecnologia: tech },
          { pregunta: `¿Cómo se gestionan las versiones y actualizaciones de ${tech}?`, opciones: ["Mediante su gestor de paquetes y versionado semántico", "Descargando archivos .zip manuales", "No se actualiza nunca", "Por correo electrónico"], correcta: "Mediante su gestor de paquetes y versionado semántico", tecnologia: tech },
          { pregunta: `¿Cuál de las siguientes es una buena práctica de seguridad al implementar ${tech}?`, opciones: ["Ocultar credenciales en variables de entorno", "Subir contraseñas en texto plano a GitHub", "Dar permisos de administrador a todos los usuarios", "Desactivar el firewall"], correcta: "Ocultar credenciales en variables de entorno", tecnologia: tech }
        ];
        examenGenerado = examenGenerado.concat(fallbackQuestions);
      }
    });

    // Si no juntamos 5 preguntas (por si eligió algo que no está en el banco aún), rellenamos con preguntas genéricas
    const preguntasGenericas = [
      { pregunta: "¿Qué significa API?", opciones: ["Application Programming Interface", "Advanced Program Integration", "Automated Protocol Interface", "Apple Pie Inside"], correcta: "Application Programming Interface" },
      { pregunta: "¿Qué es Git?", opciones: ["Un lenguaje", "Un sistema de control de versiones", "Una base de datos", "Un framework"], correcta: "Un sistema de control de versiones" },
      { pregunta: "¿Qué es HTTP?", opciones: ["Un protocolo de transferencia de hipertexto", "Un lenguaje de marcado", "Un servidor web", "Un sistema operativo"], correcta: "Un protocolo de transferencia de hipertexto" },
      { pregunta: "¿Para qué sirve el comando 'npm install'?", opciones: ["Para instalar dependencias de Node.js", "Para crear un nuevo proyecto", "Para borrar archivos", "Para compilar código"], correcta: "Para instalar dependencias de Node.js" },
      { pregunta: "¿Cuál es el propósito de CSS?", opciones: ["Dar estilo a las páginas web", "Crear bases de datos", "Escribir lógica de servidor", "Definir rutas en una API"], correcta: "Dar estilo a las páginas web" }
    ];

    if (examenGenerado.length < 5) {
      // Rellenamos con preguntas genéricas solo si no llega al mínimo de 5
      for (const preg of preguntasGenericas) {
        if (examenGenerado.length >= 5) break;
        if (!examenGenerado.find(p => p.pregunta === preg.pregunta)) {
          examenGenerado.push({ ...preg, tecnologia: "General" });
        }
      }
    }

    // Barajamos las preguntas (se eliminó el límite de 30 para permitir 5 por cada stack sin importar cuántos elija)
    const testFinal = examenGenerado.sort(() => 0.5 - Math.random());

    res.status(200).json({
      mensaje: "Test configurado con éxito",
      test: testFinal
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el motor de evaluación" });
  }
};

export const saveTechTestScore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { score } = req.body;

    const updatedUser = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { calificacion_test: Number(score) }
    });

    res.status(200).json({
      mensaje: "¡Calificación guardada exitosamente!",
      calificacion_test: updatedUser.calificacion_test
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar la calificación" });
  }
};