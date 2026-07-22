import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: {
        habilidades: { include: { habilidad: true } }
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // Capturamos el ID de la URL
    const { id } = req.params;
    // Capturamos los datos que el estudiante quiere actualizar
    const { nombre, email, perfil_logistico, stack, horario, github, portfolio } = req.body; 

    const updatedUser = await prisma.usuario.update({
      where: { 
        id: Number(id) 
      },
      data: { 
        nombre,
        email,
        perfil_logistico,
        stack,
        horario,
        github,
        portfolio
      }
    });

    // Sincronizar el stack con la tabla relacional UsuarioHabilidad para el Matchmaking
    if (stack && Array.isArray(stack)) {
      // Primero limpiamos las habilidades anteriores
      await prisma.usuarioHabilidad.deleteMany({
        where: { usuario_id: Number(id) }
      });

      // Calculamos el nivel dinámicamente basado en su calificación global del test
      const score = updatedUser.calificacion_test || 0;
      let assignedLevel = "Básico";
      if (score >= 80) assignedLevel = "Experto";
      else if (score >= 60) assignedLevel = "Autónomo";

      // Luego agregamos las nuevas
      for (const tagName of stack) {
        // Buscamos si la habilidad ya existe en el sistema
        let skill = await prisma.habilidad.findFirst({ where: { nombre: tagName } });
        
        // Si no existe, la creamos al vuelo
        if (!skill) {
          skill = await prisma.habilidad.create({ data: { nombre: tagName } });
        }

        // Asociamos el usuario con la habilidad
        await prisma.usuarioHabilidad.create({
          data: {
            usuario_id: Number(id),
            habilidad_id: skill.id,
            nivel: assignedLevel // Asignamos el nivel calculado
          }
        });
      }
    }

    res.status(200).json({
      mensaje: '¡Perfil de estudiante actualizado con éxito!',
      usuario: {
        id: updatedUser.id,
        nombre: updatedUser.nombre,
        cuatrimestre: updatedUser.cuatrimestre
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al actualizar el perfil' });
  }
};
export const updateUserSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Recibimos los datos exactos que armó nuestro fetch en el frontend
    const { perfil_logistico, horario } = req.body;

    const updatedUser = await prisma.usuario.update({
      where: { 
        id: Number(id) 
      },
      data: { 
        // Nota: Asegúrate de que estos campos existan en tu schema.prisma.
        // 'horario' debe estar configurado como un campo tipo JSON en tu base de datos.
        perfil_logistico: perfil_logistico,
        horario: horario 
      }
    });

    res.status(200).json({
      mensaje: '¡Logística y horario actualizados correctamente!',
      usuario: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al guardar el horario en la base de datos' });
  }
};