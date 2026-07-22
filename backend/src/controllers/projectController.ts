import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeaderProjects = async (req: Request, res: Response) => {
  try {
    const creadorId = Number(req.query.userId) || 1;
    const projects = await prisma.proyecto.findMany({
      where: { creador_id: creadorId },
      include: {
        habilidades: { include: { habilidad: true } }
      }
    });

    // Mapear al formato esperado por el frontend
    const formatted = projects.map(p => {
      // Calcular semanas reales desde hoy hasta el plazo, o devolver el plazo string
      let semanas = '10 sem'; // fallback
      if (p.plazo) {
        const d1 = new Date();
        const d2 = new Date(p.plazo);
        if (!isNaN(d2.getTime())) {
          const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 7));
          if (diff > 0) semanas = `${diff} sem`;
          else semanas = 'Vencido';
        } else {
          semanas = p.plazo; // si es texto libre
        }
      }

      return {
        id: `PRJ-${String(p.id).padStart(3, '0')}`,
        realId: p.id,
        title: p.titulo,
        description: p.descripcion,
        duration: semanas,
        team: `${p.equipo || 3} devs`,
        tags: p.habilidades.map(h => h.habilidad.nombre),
        stack: p.habilidades.map(h => h.habilidad.nombre).join(' · ')
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener los proyectos del líder' });
  }
};

export const createLeaderProject = async (req: Request, res: Response) => {
  try {
    const { title, description, tags, creadorId, horas_requeridas, duration, team } = req.body;
    
    // 1. Crear el proyecto
    const newProject = await prisma.proyecto.create({
      data: {
        titulo: title,
        descripcion: description,
        horas_requeridas: horas_requeridas || 15,
        plazo: duration,
        equipo: Number(team) || 3,
        creador_id: Number(creadorId) || 1
      },
    });

    // 2. Asociar las habilidades con su nivel requerido
    const { stackLevels } = req.body; 
    // Si viene stackLevels (el nuevo formato) lo usamos, sino usamos tags por compatibilidad
    if (stackLevels && stackLevels.length > 0) {
      for (const item of stackLevels) {
        let skill = await prisma.habilidad.findFirst({ where: { nombre: item.nombre } });
        if (!skill) {
          skill = await prisma.habilidad.create({ data: { nombre: item.nombre } });
        }
        await prisma.proyectoHabilidad.create({
          data: {
            proyecto_id: newProject.id,
            habilidad_id: skill.id,
            nivel_requerido: item.nivel // Guardamos el nivel requerido!
          }
        });
      }
    } else if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let skill = await prisma.habilidad.findFirst({ where: { nombre: tagName } });
        if (!skill) {
          skill = await prisma.habilidad.create({ data: { nombre: tagName } });
        }
        await prisma.proyectoHabilidad.create({
          data: {
            proyecto_id: newProject.id,
            habilidad_id: skill.id
          }
        });
      }
    }

    res.status(201).json({
      mensaje: '¡Proyecto creado!',
      proyecto: newProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al crear el proyecto del líder' });
  }
};

export const getProjectMetrics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Obtenemos las habilidades del proyecto para que la gráfica tenga sentido
    const project = await prisma.proyecto.findUnique({
      where: { id: Number((id as string).replace('PRJ-', '')) },
      include: { habilidades: { include: { habilidad: true } } }
    });

    const tags = project?.habilidades.map(h => h.habilidad.nombre) || ['Backend', 'Frontend', 'DB', 'DevOps'];
    if (tags.length === 0) tags.push('General');

    // Construir métricas dinámicas basadas en los tags reales del proyecto
    const metrics = {
      balance: tags.map(tag => ({
        label: tag,
        value: Math.floor(Math.random() * 40) + 60 // 60 a 100
      })),
      sprintWindows: {
        sprints: ['SPR1', 'SPR2', 'SPR3', 'SPR4', 'SPR5', 'SPR6'],
        rows: tags.map(tag => ({
          role: tag,
          cells: Array(6).fill(0).map(() => {
            const r = Math.random();
            return r > 0.7 ? 'warn' : r > 0.85 ? 'no_disponible' : 'opt';
          })
        }))
      },
      hoursByRole: tags.map((tag, i) => {
        const colors = ['#2ee6a6', '#7c8cff', '#f0c94a', '#ff4d5e', '#4ac8f0', '#c678dd'];
        return {
          role: tag,
          pct: Math.floor(100 / tags.length),
          color: colors[i % colors.length]
        };
      }),
      totalHours: 1240,
      sprintHistory: {
        sprints: ['SPR1', 'SPR2', 'SPR3', 'SPR4', 'SPR5', 'SPR6'],
        series: tags.slice(0, 4).map((tag, i) => {
          const colors = ['#2ee6a6', '#7c8cff', '#f0c94a', '#ff4d5e'];
          let val = 30;
          return {
            name: tag,
            color: colors[i % colors.length],
            values: Array(6).fill(0).map(() => {
              val = Math.min(100, val + Math.floor(Math.random() * 20));
              return val;
            })
          };
        })
      }
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener las métricas' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    // Capturamos los datos del proyecto y el ID del estudiante creador
    const { titulo, descripcion, creadorId } = req.body;

    const newProject = await prisma.proyecto.create({
      data: {
        titulo,
        descripcion,
        // Relacionamos el proyecto con el estudiante en la base de datos
        creador_id: Number(creadorId) 
      },
    });

    res.status(201).json({
      mensaje: '¡Proyecto publicado exitosamente en DevMatch!',
      proyecto: newProject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al crear el proyecto' });
  }

};
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.proyecto.findMany({
      // El "include" hace la magia de traer los datos del creador cruzando las tablas
      include: {
        creador: {
          select: {
            nombre: true,
            cuatrimestre: true,
          }
        },
        habilidades: {
          include: { habilidad: true }
        }
      }
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener los proyectos' });
  }
};
export const getProjectById = async (req: Request, res: Response) => {
  try {
    // Capturamos el ID de la URL y limpiamos el prefijo PRJ- si viene del frontend
    const idParam = req.params.id as string;
    const parsedId = Number(idParam.replace('PRJ-', ''));
    
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: parsedId },
      include: {
        habilidades: {
          include: {
            habilidad: true
          }
        },
        creador: {
          select: { nombre: true, cuatrimestre: true }
        }
      }
    });

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.status(200).json(proyecto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener el proyecto' });
  }
};
export const updateProjectStatus = async (req: Request, res: Response) => {
  try {
    // Capturamos el ID de la URL y el nuevo estado desde el Body
    const { id } = req.params;
    const { estado } = req.body;

    // Le decimos a Prisma que actualice ese registro específico
    const updatedProject = await prisma.proyecto.update({
      where: { 
        id: Number(id) 
      },
      data: { 
        estado 
      }
    });

    res.status(200).json({
      mensaje: '¡Estado del proyecto actualizado con éxito!',
      proyecto: updatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al actualizar el estado del proyecto' });
  }
};
export const deleteProject = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    if (id.startsWith('PRJ-')) {
      id = id.replace('PRJ-', '');
    }
    const projectId = Number(id);

    // 1. Limpiamos la casa: Borramos los requisitos de habilidades asociados al proyecto
    await prisma.proyectoHabilidad.deleteMany({
      where: { 
        proyecto_id: projectId 
      }
    });

    // 2. Borramos las postulaciones asociadas a este proyecto
    await prisma.postulacion.deleteMany({
      where: { 
        proyecto_id: projectId 
      }
    });

    // 3. Ahora sí, con las dependencias limpias, destruimos el proyecto
    await prisma.proyecto.delete({
      where: { 
        id: projectId 
      }
    });

    res.status(200).json({
      mensaje: '¡Proyecto y todas sus dependencias eliminados correctamente de DevMatch!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al intentar eliminar el proyecto' });
  }
};