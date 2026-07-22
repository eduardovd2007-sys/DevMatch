import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const postulaciones = await prisma.postulacion.findMany();
  console.log(JSON.stringify(postulaciones, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
