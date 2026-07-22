import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSystemStats = async (req: Request, res: Response) => {
  try {
    // Lanzamos múltiples conteos al mismo tiempo para mayor velocidad
    const totalUsuarios = await prisma.usuario.count();
    
    const totalProyectosActivos = await prisma.proyecto.count({
      where: { estado: 'Abierto' }
    });

    const totalPostulaciones = await prisma.postulacion.count();

    const totalHabilidadesEnCatalogo = await prisma.habilidad.count();

    // Empaquetamos todo en un JSON elegante para el dashboard
    res.status(200).json({
      mensaje: 'Estadísticas del sistema DevMatch cargadas con éxito',
      metricas: {
        usuarios_registrados: totalUsuarios,
        proyectos_buscando_talento: totalProyectosActivos,
        postulaciones_realizadas: totalPostulaciones,
        habilidades_disponibles: totalHabilidadesEnCatalogo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al calcular las métricas del sistema' });
  }
};