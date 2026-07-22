const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sync() {
    const users = await prisma.usuario.findMany();
    for(const u of users) {
        if(u.stack && Array.isArray(u.stack)) {
            await prisma.usuarioHabilidad.deleteMany({where: {usuario_id: u.id}});
            for(const t of u.stack) {
                let s = await prisma.habilidad.findFirst({where: {nombre: t}});
                if(!s) s = await prisma.habilidad.create({data:{nombre:t}});
                await prisma.usuarioHabilidad.create({data:{usuario_id:u.id, habilidad_id:s.id, nivel:'Básico'}});
            }
        }
    }
    console.log('Done syncing DB');
}
sync().finally(() => prisma.$disconnect());
