const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const userSkills = await prisma.usuarioHabilidad.findMany({ include: { habilidad: true } });
  console.log('All User skills:', userSkills.map(s => ({ user: s.usuario_id, skill: s.habilidad.nombre })));
  const projects = await prisma.proyecto.findMany({ include: { habilidades: { include: { habilidad: true } } } });
  console.log('Projects:', projects.map(p => ({ id: p.id, title: p.titulo, skills: p.habilidades.map(h => h.habilidad.nombre) })));
}
main().finally(() => prisma.$disconnect());
