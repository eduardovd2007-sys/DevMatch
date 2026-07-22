import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const applyToProject = async (req: Request, res: Response) => {
  try {
    const { usuarioId, proyectoId } = req.body;

    const existePostulacion = await prisma.postulacion.findFirst({
      where: {
        usuario_id: Number(usuarioId),
        proyecto_id: Number(proyectoId)
      }
    });

    if (existePostulacion) {
      return res.status(400).json({ error: 'Ya te has postulado a este proyecto anteriormente.' });
    }

    const nuevaPostulacion = await prisma.postulacion.create({
      data: {
        usuario_id: Number(usuarioId),
        proyecto_id: Number(proyectoId)
      },
    });

    // 🔔 NOTIFICACION REAL (NUEVO POSTULANTE)
    const proyectoInfo = await prisma.proyecto.findUnique({
      where: { id: Number(proyectoId) },
      select: { titulo: true, creador_id: true }
    });
    const usuarioInfo = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) },
      select: { nombre: true, stack: true }
    });

    if (proyectoInfo && usuarioInfo) {
      const stackList = Array.isArray(usuarioInfo.stack) ? usuarioInfo.stack.join(', ') : 'Tecnologías no especificadas';
      await prisma.notificacion.create({
        data: {
          usuario_id: proyectoInfo.creador_id,
          tipo: 'nuevo_postulante',
          titulo: `${usuarioInfo.nombre} postuló a ${proyectoInfo.titulo}`,
          meta: `stack:${stackList}`
        }
      });
    }

    res.status(201).json({
      mensaje: '¡Postulación enviada exitosamente!',
      postulacion: nuevaPostulacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al postularse al proyecto' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; 

    const updatedApplication = await prisma.postulacion.update({
      where: { id: Number(id) },
      data: { estado }
    });

    res.status(200).json({
      mensaje: `¡El estado de la postulación ahora es: ${estado}!`,
      postulacion: updatedApplication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al actualizar el estado de la postulación' });
  }
};

export const getUserApplications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const postulaciones = await prisma.postulacion.findMany({
      where: { usuario_id: Number(id) },
      include: {
        proyecto: {
          include: {
            creador: { select: { nombre: true } },
            habilidades: { include: { habilidad: true } }
          }
        }
      }
    });

    res.status(200).json(postulaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener postulaciones del usuario' });
  }
};

export const getProjectApplicants = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id as string;
    const parsedId = Number(idParam.replace('PRJ-', ''));
    
    const postulantes = await prisma.postulacion.findMany({
      where: { proyecto_id: parsedId },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            perfil_logistico: true,
            stack: true
          }
        }
      }
    });
    res.status(200).json(postulantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los postulantes del proyecto' });
  }
};

export const updateApplicantStatus = async (req: Request, res: Response) => {
  try {
    const { applicantId } = req.params;
    const { link_contacto } = req.body;
    let { estado } = req.body;
    
    // Normalizar el estado a minúsculas
    if (estado) {
      estado = estado.toLowerCase();
    }
    
    const updatedApplication = await prisma.postulacion.update({
      where: { id: Number(applicantId) },
      data: { estado, ...(link_contacto && { link_contacto }) },
      include: { proyecto: true }
    });

    // 💡 NOTIFICACION REAL (MATCH CONFIRMADO)
    if (estado === 'aceptado') {
      await prisma.notificacion.create({
        data: {
          usuario_id: updatedApplication.usuario_id,
          tipo: 'match_confirmado',
          titulo: `Líder confirmó match en ${updatedApplication.proyecto.titulo}`,
          meta: `estado:enlace_activo`
        }
      });
      
      // Revisar si el proyecto ya alcanzó su límite de desarrolladores
      const totalAceptados = await prisma.postulacion.count({
        where: { 
          proyecto_id: updatedApplication.proyecto_id, 
          estado: 'aceptado' 
        }
      });
      const capacidadMax = updatedApplication.proyecto.equipo || 3;
      
      if (totalAceptados >= capacidadMax) {
        // El proyecto está lleno, se marca como cerrado
        await prisma.proyecto.update({
          where: { id: updatedApplication.proyecto_id },
          data: { estado: 'Cerrado' }
        });
      }
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado del postulante' });
  }
};

export const simulateApplicantMatch = async (req: Request, res: Response) => {
  try {
    const { projectId, applicantId } = req.params;
    
    const project = await prisma.proyecto.findUnique({
      where: { id: Number((projectId as string).replace('PRJ-', '')) },
      include: { habilidades: { include: { habilidad: true } } }
    });

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const application = await prisma.postulacion.findUnique({
      where: { id: Number(applicantId) },
      include: { 
        usuario: {
          include: {
            habilidades: { include: { habilidad: true } }
          }
        } 
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    const levelVal = (lvl: string | null) => {
      if (lvl === 'Experto') return 3;
      if (lvl === 'Autónomo') return 2;
      return 1; // Básico
    };

    let techScore = 100;
    const reqSkills = project.habilidades;
    const userSkills = application.usuario.habilidades;

    if (reqSkills.length > 0) {
      let totalSkillPoints = 0;
      const maxSkillPoints = reqSkills.length * 100;

      for (const req of reqSkills) {
        const reqName = req.habilidad.nombre;
        const reqLvl = levelVal(req.nivel_requerido);
        
        const userHab = userSkills.find(s => s.habilidad.nombre === reqName);
        if (userHab) {
          const userLvl = levelVal(userHab.nivel);
          if (userLvl >= reqLvl) totalSkillPoints += 100;
          else if (reqLvl - userLvl === 1) totalSkillPoints += 60;
          else totalSkillPoints += 20;
        }
      }
      techScore = Math.round((totalSkillPoints / maxSkillPoints) * 100);
    }

    let logisticScore = 100;
    const horarioBlocked = Array.isArray(application.usuario.horario) ? application.usuario.horario : [];
    const freeSlots = 84 - horarioBlocked.length;
    const reqSlots = project.horas_requeridas || 15;
    
    if (freeSlots < reqSlots) {
      logisticScore = Math.max(0, Math.round((freeSlots / reqSlots) * 100));
    }

    const matchScore = Math.round((techScore * 0.7) + (logisticScore * 0.3));
    
    res.status(200).json({ match: matchScore, applicantId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al simular el match' });
  }
};