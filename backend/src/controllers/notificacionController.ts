import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notificaciones = await prisma.notificacion.findMany({
      where: { usuario_id: Number(id) },
      orderBy: { fecha: 'desc' },
      take: 20 // Return the 20 most recent
    });
    res.status(200).json(notificaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notificacion = await prisma.notificacion.update({
      where: { id: Number(id) },
      data: { leida: true }
    });
    res.status(200).json(notificacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al marcar la notificacion' });
  }
};
