import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debug() {
  const properties = await prisma.property.findMany({
    include: { bookings: true }
  });
  
  console.log('--- Properties & Bookings ---');
  properties.forEach(p => {
    console.log(`Property: ${p.title} (${p.id})`);
    p.bookings.forEach(b => {
      console.log(`  Booking: ${b.checkInDate.toISOString()} -> ${b.checkOutDate.toISOString()} [${b.status}]`);
    });
  });
}

debug().catch(console.error).finally(() => prisma.$disconnect());
