import axios from 'axios';

async function test() {
  const baseUrl = 'http://localhost:3001/api/properties/search?city=%D0%A2%D0%BE%D0%BC%D1%81%D0%BA&guests=1';
  
  console.log('--- Test 1: Overlapping Dates (CheckIn: 22, CheckOut: 24) ---');
  console.log('Expectation: "Савиных улица" should be EXCLUDED.');
  const res1 = await axios.get(`${baseUrl}&checkIn=2026-06-22&checkOut=2026-06-24`);
  console.log('Results:', res1.data.data.map(p => p.title));

  console.log('\n--- Test 2: Non-overlapping Dates (CheckIn: July 01) ---');
  console.log('Expectation: "Савиных улица" should be INCLUDED.');
  const res2 = await axios.get(`${baseUrl}&checkIn=2026-07-01&checkOut=2026-07-05`);
  console.log('Results:', res2.data.data.map(p => p.title));
}

test().catch(console.error);
