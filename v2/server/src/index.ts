import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  const size = req.get('content-length');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body size: ${size} bytes`);
  next();
});
console.log('--- Express Body Limit: 50mb ---');

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

app.get('/api/properties', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: { images: true, category: true }
    });
    res.json({ success: true, data: properties });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch properties' }); }
});

app.get('/api/properties/search', async (req, res) => {
  try {
    const { city, guests, minPrice, maxPrice, type } = req.query;
    const properties = await prisma.property.findMany({
      where: {
        status: 'ACTIVE',
        city: city ? String(city) : undefined,
        maxGuests: guests ? { gte: Number(guests) } : undefined,
        pricePerNight: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined
        },
        type: type ? (type as any) : undefined
      },
      include: { images: true, category: true }
    });
    res.json({ success: true, data: properties });
  } catch (error) { res.status(500).json({ error: 'Search failed' }); }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: { images: true, category: true }
    });
    if (!property) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: property });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch property' }); }
});

const mapFrontendDraftToPrisma = (data: any) => {
  // 1. Mapping Property Type
  let type: 'HOTEL_ROOM' | 'APARTMENT' | 'HOUSE' | 'PRIVATE_ROOM' = 'APARTMENT';
  const subType = data.propertyType || data.subType || "";

  if (['Отель', 'Гостиница', 'Хостел', 'Гостевой дом'].includes(subType) || data.type === 'HOTEL_ROOM') {
    type = 'HOTEL_ROOM';
  } else if (['Дом', 'Коттедж', 'Вилла'].includes(subType) || data.type === 'HOUSE') {
    type = 'HOUSE';
  } else if (['Комната'].includes(subType) || data.type === 'PRIVATE_ROOM') {
    type = 'PRIVATE_ROOM';
  }

  // 2. Mapping Enums (UI Strings -> Prisma Enums)
  const mapSmoking = (val: string): any => {
    if (val === 'Можно' || val === 'ALLOWED') return 'ALLOWED';
    if (val === 'В специально отведенных местах' || val === 'DESIGNATED_AREAS') return 'DESIGNATED_AREAS';
    return 'FORBIDDEN';
  };

  const mapInternet = (val: string): any => {
    if (val === 'Бесплатно' || val === 'FREE') return 'FREE';
    if (val === 'Платно' || val === 'PAID') return 'PAID';
    return 'NONE';
  };

  const mapParking = (val: string): any => {
    if (val === 'Бесплатно' || val === 'FREE') return 'FREE';
    if (val === 'Платно' || val === 'PAID') return 'PAID';
    return 'NONE';
  };

  const mapPayment = (val: string): any => {
    if (val === 'Любой' || val === 'ANY') return 'ANY';
    if (val === 'Только наличные' || val === 'CASH_ONLY') return 'CASH_ONLY';
    if (val === 'Только карта' || val === 'CARD_ONLY') return 'CARD_ONLY';
    return 'CASH_AND_CARD';
  };

  const mapService = (val: string): any => {
    if (val === 'Включено в стоимость' || val === 'INCLUDED_IN_PRICE') return 'INCLUDED_IN_PRICE';
    if (val === 'Бесплатно по запросу' || val === 'AVAILABLE_FOR_FREE') return 'AVAILABLE_FOR_FREE';
    if (val === 'Платно по запросу' || val === 'AVAILABLE_FOR_FEE') return 'AVAILABLE_FOR_FEE';
    return 'NOT_AVAILABLE';
  };

  return {
    type,
    subType,
    title: data.title || "Черновик",
    registryNumber: data.registryNumber,
    starRating: Number(data.starRating) || 0,
    registryType: data.registryType,
    buildYear: Number(data.buildYear) || null,
    totalRooms: Number(data.totalRooms) || null,
    city: data.city,
    address: data.address || "Адрес не указан",
    streetType: data.streetType,
    streetName: data.streetName,
    houseNumber: data.houseNumber,
    buildingBlock: data.buildingBlock,
    landmarks: data.landmarks,
    description: data.description,
    pricePerNight: data.pricePerNight ? Number(data.pricePerNight) : 0,
    rooms: Number(data.rooms) || 1,
    bedrooms: Number(data.bedrooms) || 1,
    beds: Number(data.beds) || 1,
    maxGuests: Number(data.maxGuests) || 2,
    area: data.area ? Number(data.area) : null,
    checkIn: data.checkIn || "14:00",
    checkOut: data.checkOut || "12:00",
    smoking: mapSmoking(data.smoking),
    paymentMethod: data.paymentMethods && Array.isArray(data.paymentMethods) 
      ? (data.paymentMethods.includes('card') ? 'CARD_ONLY' : 'CASH_ONLY')
      : mapPayment(data.paymentMethod),
    internet: mapInternet(data.wifi || data.internet), // handle both keys
    parking: mapParking(data.parking),
    isAllInclusive: !!data.isAllInclusive,
    hasReportingDocs: !!data.hasReportingDocs,
    hasTransfer: !!data.hasTransfer,
    cleaningService: mapService(data.cleaningService),
    bedLinen: mapService(data.bedLinen)
  };
};

app.post('/api/properties/draft', async (req, res) => {
  try {
    const data = req.body;
    const prismaData = mapFrontendDraftToPrisma(data);
    let ownerId = data.ownerId;
    
    if (!ownerId) {
      const firstUser = await prisma.user.findFirst();
      ownerId = firstUser?.id || '';
    }

    const property = await prisma.property.upsert({
      where: { id: data.id || 'new-draft-placeholder' },
      update: {
        ...prismaData,
        status: "DRAFT"
      },
      create: {
        ...prismaData,
        ownerId: ownerId,
        status: "DRAFT"
      }
    });
    res.json({ success: true, data: property });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save draft', details: error.message });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const data = req.body;
    const prismaData = mapFrontendDraftToPrisma(data);
    let ownerId = data.ownerId;
    
    if (!ownerId) {
      const firstUser = await prisma.user.findFirst();
      ownerId = firstUser?.id || '';
    }

    const property = await prisma.property.create({
      data: {
        ...prismaData,
        ownerId: ownerId,
        status: data.status || "DRAFT",
        images: {
          create: data.images?.map((url: string) => ({ url })) || []
        },
        amenityIds: data.amenities || []
      } as any
    });
    res.status(201).json({ success: true, data: property });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to create property', 
      details: error.message,
      stack: error.stack,
      code: error.code 
    });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const data = req.body;
    const prismaData = mapFrontendDraftToPrisma(data);
    
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        ...prismaData,
        status: data.status,
        amenityIds: data.amenities || [],
        images: data.images ? {
          deleteMany: {},
          create: data.images.map((url: string) => ({ url }))
        } : undefined
      } as any
    });
    res.json({ success: true, data: property });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update property', details: error.message });
  }
});

// Rooms Endpoints
app.get('/api/properties/:id/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { propertyId: req.params.id },
      include: { images: true }
    });
    res.json({ success: true, data: rooms });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

app.post('/api/properties/:id/rooms', async (req, res) => {
  try {
    const data = req.body;
    const room = await prisma.room.create({
      data: {
        propertyId: req.params.id,
        title: data.title,
        description: data.description,
        price: data.price,
        capacity: data.capacity,
        beds: data.beds,
        size: data.size,
        amenityIds: data.amenityIds || [],
        images: {
          create: data.images?.map((url: string) => ({ url })) || []
        }
      }
    });
    res.json({ success: true, data: room });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to create room', 
      details: error.message,
      stack: error.stack,
      code: error.code
    });
  }
});

// Launch
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  seed().catch(console.error);
});

// Keep-alive
setInterval(() => {}, 1000 * 60 * 60);
