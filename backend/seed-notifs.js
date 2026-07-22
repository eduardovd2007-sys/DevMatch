const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.notificacion.createMany({
    data: [
      { usuario_id: 1, tipo: 'match_confirmado', titulo: 'Valentina Orozco confirmó match', meta: 'rol:Frontend_Lead' },
      { usuario_id: 1, tipo: 'nuevo_postulante', titulo: 'Carlos Fletcher postuló', meta: 'match_score:92%' }
    ]
  });
  console.log('Notificaciones creadas.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
