import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const pending = await prisma.property.findMany({
    where: { status: 'PENDING' },
    select: { id: true, title: true, status: true }
  });
  console.log('--- PENDING PROPERTIES ---');
  console.log(JSON.stringify(pending, null, 2));
  
  const all = await prisma.property.count();
  console.log('Total properties:', all);
  
  await prisma.$disconnect();
}

check().catch(console.error);
