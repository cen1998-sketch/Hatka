import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

async function runTests() {
  console.log('🧪 Starting API Verification Tests...');
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User'
  };

  let token = '';

  try {
    // 1. Auth Test
    console.log('\n--- 🔐 Auth API ---');
    console.log('Registering user...');
    const reg = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Register: OK');
    token = reg.data.data.token;

    console.log('Logging in...');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login: OK');

    // 2. Locations Test
    console.log('\n--- 📍 Locations API ---');
    const loc = await axios.get(`${BASE_URL}/locations/suggest?query=томск`);
    console.log('✅ Suggest: OK, results found:', loc.data.data.length);

    // 3. Listings Test
    console.log('\n--- 🏠 Listings API ---');
    console.log('Creating listing...');
    const listing = await axios.post(`${BASE_URL}/listings`, {
      type: 'APARTMENT',
      title: 'Test Listing from Script',
      description: 'Beautiful test apartment created by automation',
      city: 'Томск',
      address: 'ул. Ленина, 1',
      pricePerDay: 5000,
      amenities: ['wifi', 'tv'],
      details: { rooms: 2 }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Create Listing: OK');

    console.log('Searching listings...');
    const search = await axios.get(`${BASE_URL}/listings/search?city=Томск`);
    console.log('✅ Search Listing: OK, total matching:', search.data.data.total);

    console.log('\n🎉 ALL TESTS PASSED!');
  } catch (err: any) {
    console.error('\n❌ TEST FAILED!');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Error:', err.message);
    }
    console.log('\n💡 Tip: Make sure the server is running on http://localhost:3001 (npm run dev)');
    process.exit(1);
  }
}

runTests();
