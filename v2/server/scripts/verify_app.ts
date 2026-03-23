import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

async function verify() {
  console.log('🧪 Starting App Verification (In-process)...');
  const testUser = {
    email: `verify_${Date.now()}@example.com`,
    password: 'Password123!',
    password_confirm: 'Password123!',
    first_name: 'Verify',
    last_name: 'User',
    city: 'Томск'
  };

  try {
    // 1. Регистрация
    console.log('Testing /api/auth/register...');
    const reg = await request(app).post('/api/auth/register').send(testUser);
    
    if (reg.status !== 201) {
      throw new Error(`Register failed (${reg.status}): ${JSON.stringify(reg.body)}`);
    }
    console.log('✅ Register: OK');

    const token = reg.body?.data?.token;

    // 2. Подсказки городов
    console.log('Testing /api/locations/suggest...');
    const loc = await request(app).get('/api/locations/suggest?query=томск');
    if (loc.status !== 200) {
      throw new Error(`Locations failed (${loc.status}): ${JSON.stringify(loc.body)}`);
    }
    console.log('✅ Suggest: OK');

    // 3. Создание объявления
    console.log('Testing /api/listings (Create)...');
    const listing = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'APARTMENT',
        title: 'Verified Listing',
        description: 'Testing listing creation flow',
        city: 'Томск',
        address: 'ул. Тестовая, 1',
        pricePerDay: 3000,
        amenities: ['wifi'],
        details: { rooms: 1 }
      });

    if (listing.status !== 201) {
      throw new Error(`Create listing failed (${listing.status}): ${JSON.stringify(listing.body)}`);
    }
    console.log('✅ Create Listing: OK');

    // Очистка
    console.log('Cleaning up test data...');
    await prisma.listing.deleteMany({ where: { title: 'Verified Listing' } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    
    console.log('\n🎉 ALL CORE API FLOWS VERIFIED!');
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ VERIFICATION FAILED!');
    console.error(err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
