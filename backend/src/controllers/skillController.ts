import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSkill = async (req: Request, res: Response) => {
  try {
    // Capturamos el nombre de la habilidad que se quiere registrar
    const { nombre } = req.body;

    const nuevaHabilidad = await prisma.habilidad.create({
      data: {
        nombre
      },
    });

    res.status(201).json({
      mensaje: '¡Habilidad agregada al catálogo de DevMatch!',
      habilidad: nuevaHabilidad,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al registrar la habilidad' });
  }
};
export const assignSkillToUser = async (req: Request, res: Response) => {
  try {
    // Capturamos el ID del estudiante, el ID de la habilidad y su nivel
    const { usuarioId, habilidadId, nivel } = req.body;

    // Conectamos al usuario con la habilidad en la tabla intermedia
    const userSkill = await prisma.usuarioHabilidad.create({
      data: {
        usuario_id: Number(usuarioId),
        habilidad_id: Number(habilidadId),
        nivel, // Puede ser: "Básico", "Autónomo" o "Experto"
      },
    });

    res.status(201).json({
      mensaje: '¡Habilidad agregada al perfil del estudiante exitosamente!',
      perfil: userSkill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al vincular la habilidad' });
  }
};
export const assignSkillToProject = async (req: Request, res: Response) => {
  try {
    // Capturamos el ID del proyecto y la habilidad requerida
    const { proyectoId, habilidadId } = req.body;

    const projectSkill = await prisma.proyectoHabilidad.create({
      data: {
        // Asegúrate de que estos nombres coincidan con tu schema.prisma
        proyecto_id: Number(proyectoId),
        habilidad_id: Number(habilidadId),
      },
    });

    res.status(201).json({
      mensaje: '¡Habilidad requerida agregada al proyecto con éxito!',
      requisito: projectSkill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al agregar la habilidad al proyecto' });
  }
};