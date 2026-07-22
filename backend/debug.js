const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Usuarios:");
    const users = await prisma.usuario.findMany();
    console.log(users);

    console.log("\nProyectos:");
    const proyectos = await prisma.proyecto.findMany({
        include: { habilidades: { include: { habilidad: true } } }
    });
    console.log(JSON.stringify(proyectos, null, 2));
    
    console.log("\nHabilidades de usuarios:");
    const userHabs = await prisma.usuarioHabilidad.findMany({
        include: { habilidad: true }
    });
    console.log(JSON.stringify(userHabs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
