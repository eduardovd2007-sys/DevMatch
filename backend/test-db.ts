import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Intentando conectar a la base de datos...");
  const users = await prisma.usuario.findMany();
  console.log("Conexión exitosa, usuarios en la base de datos:", users.length);
}

main()
  .catch(e => {
    console.error("Error al conectar a la base de datos:");
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
