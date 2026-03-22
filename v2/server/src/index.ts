import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Seed initial data if empty
async function seed() {
  const count = await prisma.property.count();
  if (count < 200) {
    console.log(`Current properties: ${count}. Seeding up to 200...`);
    
    // 1. Create Categories
    const categories = await Promise.all([
      prisma.category.upsert({ where: { slug: 'apartments' }, update: {}, create: { name: 'Квартиры', slug: 'apartments' } }),
      prisma.category.upsert({ where: { slug: 'hotels' }, update: {}, create: { name: 'Отели', slug: 'hotels' } }),
      prisma.category.upsert({ where: { slug: 'houses' }, update: {}, create: { name: 'Дома', slug: 'houses' } })
    ]);

    // 2. Create Amenities
    const amenitiesList = [
      { name: 'WiFi', group: 'room' },
      { name: 'Кондиционер', group: 'room' },
      { name: 'Кухня', group: 'room' },
      { name: 'Парковка', group: 'building' },
      { name: 'Бассейн', group: 'building' },
      { name: 'Телевизор', group: 'room' },
      { name: 'Рабочая зона', group: 'room' }
    ];
    
    const createdAmenities = await Promise.all(
      amenitiesList.map(a => prisma.amenity.upsert({ where: { name: a.name }, update: {}, create: { name: a.name, groupId: a.group } }))
    );

    // 3. Create Admin User
    const user = await prisma.user.upsert({
      where: { email: 'admin@hatka.ru' },
      update: {},
      create: { email: 'admin@hatka.ru', name: 'Admin', role: 'landlord' }
    });

    const cities = ['Москва', 'Санкт-Петербург', 'Сочи', 'Казань', 'Новосибирск', 'Томск', 'Екатеринбург'];
    const types = ['Апартаменты', 'Студия', 'Лофт', 'Квартира', 'Дом', 'Отель'];
    const descriptors = ['в центре', 'у парка', 'с видом на город', 'в тихом районе', 'бизнес-класса', 'уютный'];

    const images = [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c20360a59?w=800&q=80"
    ];

    // 4. Seeding Loop
    const remainingCount = 200 - count;
    for (let i = 0; i < remainingCount; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const desc = descriptors[Math.floor(Math.random() * descriptors.length)];
      
      const price = Math.floor(Math.random() * (12000 - 2000) + 2000);
      const rooms = Math.floor(Math.random() * 4) + 1;
      const area = Math.floor(Math.random() * (90 - 20) + 20);
      const guests = Math.floor(Math.random() * 6) + 1;
      const rating = (Math.random() * (5 - 4) + 4).toFixed(1);
      const reviews = Math.floor(Math.random() * 300);
      
      // Random amenities
      const randomAmenities = createdAmenities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 5) + 1)
        .map(a => a.id);

      await prisma.property.create({
        data: {
          ownerId: user.id,
          title: `${type} ${desc} (${city})`,
          description: `Прекрасный вариант: ${type} специально для вас. Все удобства включены.`,
          pricePerNight: price,
          city: city || null,
          address: `Улица ${i + 1}`,
          rooms: rooms,
          beds: Math.max(1, rooms),
          area: area,
          maxGuests: guests,
          avgRating: parseFloat(rating),
          reviewsCount: reviews,
          categoryId: (categories.length > 0) ? (categories[Math.floor(Math.random() * categories.length)].id) : null,
          amenityIds: randomAmenities,
          images: {
            create: [
              { url: images[Math.floor(Math.random() * images.length)] || "", isPrimary: true }
            ]
          }
        }
      });

      if (i % 50 === 0) console.log(`Seeded ${i + 1} / ${remainingCount}...`);
    }

    console.log('Seeding complete. 200 properties ready.');
  }
}

// Status update endpoints
app.patch('/api/moderation/approve/:id', async (req, res) => {
  try {
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: { status: 'ACTIVE' }
    });
    res.json({ success: true, data: property });
  } catch (error) { res.status(500).json({ error: 'Failed to approve' }); }
});

app.patch('/api/moderation/reject/:id', async (req, res) => {
  try {
    const { comment } = req.body;
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: { status: 'REJECTED', moderationComment: comment }
    });
    res.json({ success: true, data: property });
  } catch (error) { res.status(500).json({ error: 'Failed to reject' }); }
});

app.get('/api/moderation/pending', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'PENDING' },
      include: { images: true, category: true }
    });
    res.json({ success: true, data: properties });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch pending' }); }
});

app.get('/api/moderation/published', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'ACTIVE' },
      include: { images: true, category: true }
    });
    res.json({ success: true, data: properties });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch published' }); }
});

app.post('/api/properties', async (req, res) => {
  try {
    const data = req.body;
    const property = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        pricePerNight: data.pricePerNight || 0,
        address: data.address || '',
        city: data.city,
        landmarks: data.landmarks,
        rooms: data.rooms || 1,
        beds: data.beds || 1,
        maxGuests: data.maxGuests || 2,
        area: data.area,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        smoking: data.smoking,
        animals: data.animals,
        children: data.children !== undefined ? data.children : true,
        wifi: data.wifi,
        parking: data.parking,
        paymentMethods: data.paymentMethods || [],
        deposit: data.deposit || 0,
        categoryId: data.categoryId,
        ownerId: data.ownerId,
        status: data.status || 'PENDING',
        images: {
          create: data.images?.map((url: string) => ({ url })) || []
        }
      }
    });

    res.json({ success: true, data: property });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create property', details: error.message });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const data = req.body;
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        title: data.title,
        description: data.description,
        pricePerNight: data.pricePerNight,
        address: data.address,
        city: data.city,
        landmarks: data.landmarks,
        rooms: data.rooms,
        beds: data.beds,
        maxGuests: data.maxGuests,
        area: data.area,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        smoking: data.smoking,
        animals: data.animals,
        children: data.children,
        wifi: data.wifi,
        parking: data.parking,
        paymentMethods: data.paymentMethods,
        deposit: data.deposit,
        status: data.status,
        images: data.images ? {
          deleteMany: {},
          create: data.images.map((url: string) => ({ url }))
        } : undefined
      } as any // Use as any to bypass exactOptionalPropertyTypes if needed, or define proper type
    });
    res.json({ success: true, data: property });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update property', details: error.message });
  }
});

// Launch
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  seed().catch(console.error);
});

// Keep-alive
setInterval(() => {}, 1000 * 60 * 60);
