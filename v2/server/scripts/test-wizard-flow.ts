import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockProperties = [
  {
    title: 'Отель "Звезда" (Тест)',
    subType: 'Отель',
    type: 'HOTEL_ROOM',
    city: 'Москва',
    address: 'ул. Тверская, 1',
    registryNumber: 'REG-111222',
    starRating: 5,
    description: 'Великолепный пятизвездочный отель в самом центре Москвы. Разнообразные номера и высочайший уровень сервиса.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'
    ],
    hotelRooms: [
      {
        title: 'Люкс с видом на Кремль',
        description: 'Просторный номер с панорамными окнами.',
        price: 25000,
        capacity: 2,
        beds: 1,
        size: 60,
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32']
      },
      {
        title: 'Стандартный двухместный',
        description: 'Уютный номер для двоих.',
        price: 8000,
        capacity: 2,
        beds: 2,
        size: 25,
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427']
      }
    ]
  },
  {
    title: 'Хостел "Уют" (Тест)',
    subType: 'Хостел',
    type: 'HOTEL_ROOM',
    city: 'Санкт-Петербург',
    address: 'Невский пр., 10',
    registryNumber: 'REG-333444',
    starRating: 2,
    description: 'Чистый и уютный хостел для бюджетных путешественников.',
    images: [
      'https://images.unsplash.com/photo-1555854877-abab0e134d63',
      'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5',
      'https://images.unsplash.com/photo-1521783988139-89397d761dce'
    ],
    hotelRooms: [
      {
        title: 'Место в 8-местном номере',
        description: 'Кровать со шторкой и розеткой.',
        price: 800,
        capacity: 1,
        beds: 1,
        size: 5,
        images: ['https://images.unsplash.com/photo-1555854877-abab0e134d63']
      }
    ]
  },
  {
    title: 'Гостевой дом "Лесной" (Тест)',
    subType: 'Гостевой дом',
    type: 'HOTEL_ROOM',
    city: 'Сочи',
    address: 'ул. Лесная, 45',
    registryNumber: 'REG-555666',
    starRating: 3,
    description: 'Тихий гостевой дом в окружении природы.',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
      'https://images.unsplash.com/photo-1549294413-26f195200c16',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2'
    ],
    hotelRooms: [
      {
        title: 'Семейный номер',
        description: 'Две комнаты и мини-кухня.',
        price: 4500,
        capacity: 4,
        beds: 3,
        size: 40,
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf']
      }
    ]
  }
];

async function main() {
  console.log('🚀 Starting Wizard Flow Test...');

  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('❌ No user found. Please run seed first.');
    return;
  }

  for (const propertyData of mockProperties) {
    console.log(`\n📦 Creating: ${propertyData.title}...`);
    
    try {
      const property = await prisma.property.create({
        data: {
          title: propertyData.title,
          subType: propertyData.subType,
          type: propertyData.type as any,
          city: propertyData.city,
          address: propertyData.address,
          registryNumber: propertyData.registryNumber,
          starRating: propertyData.starRating,
          description: propertyData.description,
          pricePerNight: propertyData.hotelRooms[0].price, // Fallback price
          ownerId: user.id,
          status: 'PENDING',
          images: {
            create: propertyData.images.map(url => ({ url }))
          },
          hotelRooms: {
            create: propertyData.hotelRooms.map(room => ({
              title: room.title,
              description: room.description,
              price: room.price,
              capacity: room.capacity,
              beds: room.beds,
              size: room.size,
              images: {
                create: room.images.map(url => ({ url }))
              }
            }))
          }
        }
      });
      console.log(`✅ Success: ${property.id} [Status: ${property.status}]`);
    } catch (error) {
      console.error(`❌ Failed to create ${propertyData.title}:`, error);
    }
  }

  console.log('\n✨ Wizard Flow Test Completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
