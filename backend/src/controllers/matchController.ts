import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMatchesForUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioId = Number(id);

    // PASO 1: Descubrir qué sabe hacer el estudiante
    const misHabilidades = await prisma.usuarioHabilidad.findMany({
      where: { usuario_id: usuarioId },
      select: { habilidad_id: true }
    });

    // Transformamos el resultado en una lista simple de números (IDs)
    const misHabilidadesIds = misHabilidades.map(h => h.habilidad_id);

    if (misHabilidadesIds.length === 0) {
      return res.status(200).json({ 
        mensaje: "Aún no tienes habilidades registradas. ¡Agrega algunas para ver proyectos!" 
      });
    }

    // PASO 2: La magia del matchmaking. Buscar proyectos compatibles.
    const proyectosRecomendados = await prisma.proyecto.findMany({
      where: {
        estado: 'Abierto', // Regla de negocio: Solo proyectos que sigan buscando gente
        creador_id: { not: usuarioId }, // No recomendar los proyectos del propio usuario
        habilidades: {
          some: {
            habilidad_id: { in: misHabilidadesIds } // Debe requerir al menos una habilidad que el usuario tenga
          }
        }
      },
      include: {
        creador: {
          select: { nombre: true, cuatrimestre: true } // Traemos los datos de quién lo creó
        },
        habilidades: {
          include: { habilidad: true } // Traemos los nombres de las habilidades para que se vea genial en pantalla
        }
      }
    });

    res.status(200).json({
      mensaje: '¡Matches encontrados con éxito!',
      total_matches: proyectosRecomendados.length,
      recomendaciones: proyectosRecomendados
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al ejecutar el algoritmo de matchmaking' });
  }
};