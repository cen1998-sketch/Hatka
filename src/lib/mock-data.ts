import { Property, PropertyDetail, UserProfile, UserRole } from "./types";

export const MOCK_USERS: UserProfile[] = [
  {
    id: "user-1",
    email: "valentina@example.com",
    fullName: "Валентина Оземпик",
    role: "landlord",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    bookedIds: [],
    likedIds: ["prop-0", "prop-1"],
    listingIds: ["1", "2", "3", "4", "173897"],
    telegramConnected: false,
    joinedDate: "апреля 2024 г.",
  }
];

export const getUserByEmail = (email: string): UserProfile | undefined => {
  return MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const loginUser = async (email: string, role: UserRole): Promise<{ success: boolean; isNewUser: boolean }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = getUserByEmail(email);
  if (user) {
    return { success: true, isNewUser: false };
  }
  
  // If user doesn't exist, we'll "create" them in a real app
  return { success: true, isNewUser: true };
};

const images = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80",
  "https://images.unsplash.com/photo-1536376074432-8f6424629675?w=800&q=80",
];

const locations = ["Кировский р-н", "Советский р-н", "Ленинский р-н", "Октябрьский р-н"];
const streets = ["пр-т Ленина", "ул. Савиных", "ул. Кирова", "Комсомольский пр-т", "ул. Вершинина", "Иркутский тракт"];

export const MOCK_PROPERTIES: Property[] = Array.from({ length: 50 }).map((_, i) => {
  const street = streets[i % streets.length];
  const house = Math.floor(Math.random() * 150) + 1;
  const price = (Math.floor(Math.random() * 80) + 20) * 100; // 2000 - 10000
  const rating = (Math.random() * 1 + 9).toFixed(1); // 9.0 - 10.0
  
  return {
    id: `prop-${i}`,
    image: images[i % images.length],
    title: `Томск, ${street}, ${house}А`,
    price: price.toLocaleString("ru-RU"),
    rating,
    reviews: (Math.floor(Math.random() * 200) + 10).toString(),
    location: locations[i % locations.length],
    specs: {
      guests: `${Math.floor(Math.random() * 4) + 1} гостя`,
      beds: `${Math.floor(Math.random() * 2) + 1} кровать`,
      area: `${Math.floor(Math.random() * 40) + 18}м2`,
    },
    // Random coordinates around Tomsk center
    lat: 56.45 + (Math.random() * 0.1 - 0.05),
    lng: 84.95 + (Math.random() * 0.1 - 0.05),
  };
});

export const MOCK_PROPERTY_DETAIL: any = {
  ...MOCK_PROPERTIES[0],
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
  ],
  description: `Cдaётся чистaя, уютная квaртира в ленинском рaйоне. 
Kвapтиpa нa 100% соотвeтcтвует фoто. 
Отличное оснащение: 
К услугам гостей двуспальная кровать, диван-кровать, диван односпальный, детская кроватка, телевизор в каждой комнате, полностью оборудованная кухонная зона со всей необходимой посудой, микроволновая печь, холодильник, варочная панель, духовой шкаф, посудомоечная машина, кондиционер, чайник, принадлежности для душа (гель, шампунь, мыло), фен, стиральная машина, сушилка для белья, утюг и гладильная доска. 

У нас приятно жить: 
Мы внимательно следим за чистотой и состоянием наших апартаментов, проводим тщательную уборку. 

Условия: 
- Стандартное время заезда - после 14. 00 
- Стандартное время выезда - до 12. 00 
- Залог 2000 руб., возвращается в день выезда после уборки 
- Ранний заезд/ поздний выезд только по предварительному согласованию при наличии возможности. 
- Для регистрации заезда нужен документ, удостоверяющий личность. Фото паспорта отправляется при заселении. 
- Мы заботимся о покое наших гостей и состоянии апартаментов, поэтому проведение вечеринок и увеселительных мероприятий не допускается. 
- Отчетные документы! 

Ждем вас в гости! Мы сделаем все, чтобы ваш отдых или командировка оставили только положительные эмоции и приятные впечатления!`,
  tags: [
    "2 гостя",
    "1 кровать",
    "18м2",
    "Кухонная зона",
    "Этаж 4 из 5",
    "1 ванная комната",
    "Бесплатная парковка",
  ],
  host: {
    name: "Валентина Оземпик",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    lastSeen: "был 3 часа назад",
    languages: ["Русский", "English"],
    responseTime: "3 минуты",
    joinedDate: "апреля 2024 г.",
  },
  sleepingPlaces: {
    summary: "3 кровати, 5 основных спальных места",
    items: [
      { type: "double-bed", title: "Двух спальная кровать", count: 1 },
      { type: "sofa-bed", title: "двуспальный диван-кровать", count: 1 },
      { type: "single-bed", title: "односпальная кровать", count: 1 },
    ],
  },
  amenities: {
    main: ["Wi-Fi", "Телевизор", "Электрочайник", "Фен", "Микроволновка", "Стиральная машина", "Шкаф", "Холодильник"],
    groups: [
      {
        title: "Кухонная зона",
        items: ["Микроволновка", "Посуда и принадлежности", "Столовые приборы", "Электрочайник", "Холодильник", "Кухонный гарнитур", "Обеденный стол"],
      },
      {
        title: "Ванная комната",
        items: ["1 ванная комната", "1 туалет", "1 ванная комната с туалетом", "Полотенца", "Туалетные принадлежности", "Фен", "Душ", "Ванна"],
      },
      {
        title: "Оснащение",
        items: ["Постельное белье", "Стиральная машина", "wi-fi", "Сушилка для белья", "Центральное отопление", "Утюг с гладильной доской", "Водонагреватель", "Домофон", "Раскладная кровать", "Шкаф", "Гардеробная", "Обогреватель"],
      },
    ],
  },
  rules: {
    checkIn: "14:00",
    checkOut: "12:00",
    summary: "Заезд с 14:00 — Выезд до 12:00",
    items: [
      { icon: "no-smoking", text: "Курение запрещено" },
      { icon: "pets", text: "Можно с питомцами" },
      { icon: "no-parties", text: "Без вечеринок и мероприятий" },
      { icon: "no-docs", text: "Владелец не предоставляет отчётные документы" },
      { icon: "children", text: "Можно с детьми любого возраста" },
    ],
  },
  detailedReviews: {
    rating: "9,8",
    count: 120,
    items: [
      {
        userName: "Павел",
        avatarLetter: "П",
        avatarColor: "bg-red-400",
        date: "Февраль, 2026",
        stayDuration: "2 суток",
        timeAgo: "2 дня назад",
        pros: "Бесконтактное заселение, администратор постоянно на связи, в квартире есть бесплатный чай и кофе...",
        cons: "На кровати очень тонкий матрас, кажется что спишь на полу...",
      },
    ],
  },
  basePrice: 13000,
  price: "13 000 ₽",
  cancelationPolicy: {
    title: "Бесплатная отмена",
    deadline: "до 16 апреля 2026, 14:00",
    description: "После этого оплата будет возвращена частично.",
  },
};

export const MOCK_DASHBOARD_LISTINGS: PropertyDetail[] = [
  {
    ...MOCK_PROPERTY_DETAIL,
    id: "1",
    title: "Квартира",
    location: "Ленина, д. 2",
    status: "pending",
    lastModified: "19 марта 2026, 13:47",
    propertyType: "Квартира",
  },
  {
    ...MOCK_PROPERTY_DETAIL,
    id: "2",
    title: "Квартира",
    location: "Ленина, д. 2",
    status: "pending",
    lastModified: "19 марта 2026, 13:59",
    propertyType: "Квартира",
  },
  {
    ...MOCK_PROPERTY_DETAIL,
    id: "3",
    title: "Квартира",
    location: "Мира, д. 15",
    status: "active",
    lastModified: "20 марта 2026, 10:20",
    propertyType: "Квартира",
  },
  {
    ...MOCK_PROPERTY_DETAIL,
    id: "4",
    title: "Квартира",
    location: "Советская, д. 5",
    status: "draft",
    lastModified: "20 марта 2026, 09:15",
    propertyType: "Квартира",
  },
  {
    ...MOCK_PROPERTY_DETAIL,
    id: "173897",
    title: "Отель 'Гранд Томск'",
    location: "пр-т Ленина, д. 1",
    status: "pending",
    propertyType: "Гостиница",
    stars: 4,
    registryNumber: "7723456789",
    addressDetails: {
      streetType: "пр-т",
      streetName: "Ленина",
      house: "1",
      city: "Томск"
    },
    infrastructure: {
      internet: "Free",
      parking: "Paid",
      yearBuilt: 2020,
      roomCount: 45,
      paymentMethods: ["Cash", "Card"],
      smokingPolicy: "Запрещено"
    },
    additionalServices: {
      cleaning: "Да, бесплатно",
      bedding: "Да, бесплатно",
      shuttle: true,
      reports: true
    },
    lastModified: "20 марта 2026, 11:30",
  },
  {
    ...MOCK_PROPERTY_DETAIL,
    id: "173899",
    title: "Глэмпинг 'Сибирский Лес'",
    location: "Кировский р-н",
    status: "pending",
    propertyType: "Глэмпинг",
    lastModified: "20 марта 2026, 11:45",
  }
];

export const getPropertyById = (id: string): PropertyDetail | undefined => {
  // First check specific dashboard listings (already has full details)
  const dashboardItem = MOCK_DASHBOARD_LISTINGS.find(p => p.id === id);
  if (dashboardItem) return dashboardItem;

  // Then check general properties and merge with MOCK_PROPERTY_DETAIL as default template
  const baseItem = MOCK_PROPERTIES.find(p => p.id === id);
  if (baseItem) {
    return {
      ...MOCK_PROPERTY_DETAIL,
      ...baseItem,
      id: baseItem.id, // Ensure ID is preserved
    };
  }

  // Handle 'detail' fallback
  if (id === "detail") return MOCK_PROPERTY_DETAIL;

  return undefined;
};
