import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { bancoPsicometrico } from '../data/bancoPsicometrico';

const prisma = new PrismaClient();

// 1. Endpoint para obtener 5 preguntas aleatorias del banco de 40
export const getPsychometricQuestions = (req: Request, res: Response) => {
  try {
    // Barajamos todo el banco y tomamos solo 5
    const shuffled = [...bancoPsicometrico].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    res.status(200).json({
      mensaje: "Preguntas psicométricas generadas con éxito",
      preguntas: selected
    });
  } catch (error) {
    console.error("Error al obtener preguntas psicométricas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 2. Endpoint para evaluar las 5 respuestas, calcular el rol y guardarlo
export const savePsychometricRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roles_selected } = req.body; // Array de strings, ej: ["Impulsor", "Monitor", "Impulsor", "Cerebro", "Impulsor"]

    if (!roles_selected || !Array.isArray(roles_selected)) {
      return res.status(400).json({ error: "Formato de roles incorrecto" });
    }

    // Calculamos la frecuencia de cada rol elegido
    const frequency: Record<string, number> = {};
    let dominantRole = "";
    let maxCount = 0;

    for (const role of roles_selected) {
      frequency[role] = (frequency[role] || 0) + 1;
      if (frequency[role] > maxCount) {
        maxCount = frequency[role];
        dominantRole = role;
      }
    }

    // Si hubo algún error o está vacío, asignamos uno por defecto
    if (!dominantRole) dominantRole = "Desarrollador Versátil";

    // Guardamos en la base de datos
    const updatedUser = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { rol_psicometrico: dominantRole }
    });

    res.status(200).json({
      mensaje: "Rol psicométrico calculado y guardado con éxito",
      rol_asignado: updatedUser.rol_psicometrico
    });

  } catch (error) {
    console.error("Error al calcular y guardar rol:", error);
    res.status(500).json({ error: "Error al procesar el perfil psicométrico" });
  }
};
