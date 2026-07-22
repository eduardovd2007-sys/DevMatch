const fs = require('fs');
let c = fs.readFileSync('c:/Users/eduar/OneDrive/Desktop/devmatch-backend/src/controllers/postulacionController.ts', 'utf8');

c = c.replace(
    /const nuevaPostulacion = await prisma.postulacion.create\(\{[\s\S]*?res\.status\(201\)\.json\(\{/s,
    `const nuevaPostulacion = await prisma.postulacion.create({
      data: {
        usuario_id: Number(usuarioId),
        proyecto_id: Number(proyectoId)
      },
    });

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
          titulo: \`\${usuarioInfo.nombre} postuló a \${proyectoInfo.titulo}\`,
          meta: \`stack:\${stackList}\`
        }
      });
    }

    res.status(201).json({`
);

c = c.replace(
    /const updatedApplication = await prisma\.postulacion\.update\(\{[\s\S]*?where: \{ id: Number\(applicantId\) \},[\s\S]*?data: \{ estado, \.\.\.\(link_contacto && \{ link_contacto \}\) \}[\s\S]*?\}\);[\s\S]*?res\.status\(200\)\.json\(updatedApplication\);/s,
    `const updatedApplication = await prisma.postulacion.update({
      where: { id: Number(applicantId) },
      data: { estado, ...(link_contacto && { link_contacto }) },
      include: { proyecto: true }
    });

    if (estado === 'Aceptado') {
      await prisma.notificacion.create({
        data: {
          usuario_id: updatedApplication.usuario_id,
          tipo: 'match_confirmado',
          titulo: \`Líder confirmó match en \${updatedApplication.proyecto.titulo}\`,
          meta: \`estado:enlace_activo\`
        }
      });
    }

    res.status(200).json(updatedApplication);`
);

fs.writeFileSync('c:/Users/eduar/OneDrive/Desktop/devmatch-backend/src/controllers/postulacionController.ts', c);
console.log('Postulaciones controller updated with notifications!');
