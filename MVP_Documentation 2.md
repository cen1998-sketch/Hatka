# MVP Недельная Аренда — Полная Документация для разработки

**Версия:** MVP 1.0  
**Статус:** Готово к разработке  
**Дата:** 22 марта 2026

---

## 📋 Оглавление

1. [Обзор проекта и стек](#обзор-проекта-и-стек)
2. [Архитектура системы](#архитектура-системы)
3. [Frontend: FSD + React 19 + RTK](#frontend-архитектура)
4. [Backend: Express + Prisma + PostgreSQL 15](#backend-архитектура)
5. [Аутентификация](#аутентификация)
6. [Создание объявления](#создание-объявления)
7. [Личный кабинет](#личный-кабинет)
8. [Реферальная система](#реферальная-система)
9. [Техническая спецификация](#техническая-спецификация)
10. [Редактор номеров (Отели)](#редактор-номеров-отели)

---

## Обзор проекта и стек

### Суть

Платформа недельной аренды жилья. Пользователи могут выступать в двух ролях:
- **Арендатор** — ищет и бронирует жильё на неделю и больше
- **Арендодатель** — публикует свои объекты и управляет бронированиями

### Технологический стек

| Слой | Технология |
|---|---|
| Frontend фреймворк | React 19 |
| Frontend архитектура | Feature-Sliced Design (FSD) |
| State Management | Redux Toolkit (RTK Query) |
| Роутинг | React Router 7 |
| Стилизация | Vanilla CSS + Glassmorphism |
| Сборка | Vite |
| Backend | Node.js + Express.js |
| ORM | Prisma |
| База данных | PostgreSQL 15 |
| Валидация | Zod |
| Язык | TypeScript (строгий) |
| Хранилище файлов | AWS S3 |
| Email | SendGrid / Mailgun |
| Кеш | RTK Query (Фронт) + Redis (Бэк) |

### MVP Scope

✅ Регистрация и аутентификация  
✅ Создание объявления (квартиры, апартаменты, дома, коттеджи, комнаты)  
✅ Личный кабинет с профилем  
✅ Реферальная система (приглашение друзей)  
✅ Система подписки для арендаторов  
✅ Система без комиссии для арендодателей  
✅ Email-уведомления  
✅ Поиск с фильтрацией (FSD Widget + RTK Query)

❌ Платежи (v1.1)  
❌ Верификация документов (v1.1)  
❌ Страница объявления (v1.1)  
❌ Система сообщений (v1.2)

---

## Архитектура системы

### Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  firstName    String
  lastName     String
  middleName   String?
  phone        String?
  city         String?
  avatarUrl    String?
  bio          String?
  role         Role     @default(GUEST)
  isDeleted    Boolean  @default(false)
  deletedAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  subscription         Subscription?
  commissionFreePeriod CommissionFreePeriod?
  listings             Listing[]
  referralsSent        Referral[] @relation("Referrer")
  referralsReceived    Referral[] @relation("Referred")
}

enum Role {
  GUEST
  HOST
  BOTH
}

model Subscription {
  id           String    @id @default(uuid())
  userId       String    @unique
  user         User      @relation(fields: [userId], references: [id])
  daysRemaining Int      @default(0)
  expiresAt    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model CommissionFreePeriod {
  id           String    @id @default(uuid())
  userId       String    @unique
  user         User      @relation(fields: [userId], references: [id])
  daysRemaining Int      @default(0)
  expiresAt    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Referral {
  id             String         @id @default(uuid())
  referrerId     String
  referrer       User           @relation("Referrer", fields: [referrerId], references: [id])
  referredUserId String
  referredUser   User           @relation("Referred", fields: [referredUserId], references: [id])
  referrerRole   Role
  status         ReferralStatus @default(PENDING)
  daysEarned     Int            @default(0)
  createdAt      DateTime       @default(now())
  activatedAt    DateTime?
}

enum ReferralStatus {
  PENDING
  ACTIVATED
}

model Listing {
  id             String        @id @default(uuid())
  hostId         String
  host           User          @relation(fields: [hostId], references: [id])
  type           ListingType
  status         ListingStatus @default(DRAFT)
  title          String?
  description    String?
  stepsCompleted Int           @default(0)

  // Address
  streetType   String?
  streetName   String?
  houseNumber  String?
  building     String?
  city         String?
  region       String?
  latitude     Float?
  longitude    Float?

  // Details stored as JSON
  details      Json?
  amenities    Json?

  // Price
  pricePerDay  Float?

  photos       ListingPhoto[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  // GIN-индекс на amenities для быстрого поиска
  @@index([city])
  @@index([type])
  @@index([status])
  @@index([pricePerDay])
}

enum ListingType {
  APARTMENT
  HOUSE
  ROOM
}

enum ListingStatus {
  DRAFT
  PENDING
  APPROVED
  REJECTED
}

model ListingPhoto {
  id           String   @id @default(uuid())
  listingId    String
  listing      Listing  @relation(fields: [listingId], references: [id])
  url          String
  thumbnailUrl String
  order        Int
  createdAt    DateTime @default(now())
}
Важно для Бэка: После создания schema выполнить:

bash
npx prisma migrate dev --name init
npx prisma generate
Для GIN-индекса на amenities (быстрый поиск по удобствам) — добавить raw migration:

sql
CREATE INDEX listing_amenities_gin_idx 
ON "Listing" USING GIN ((details->'amenities'));
Frontend Архитектура
Feature-Sliced Design (FSD) — структура проекта
text
src/
├── app/                    # Инициализация приложения, провайдеры
│   ├── store.ts            # Redux store
│   ├── App.tsx
│   └── styles/
│       └── global.css      # Glassmorphism переменные, сброс стилей
│
├── pages/                  # Страницы (роуты)
│   ├── Home/
│   ├── Search/             # Страница выдачи результатов
│   ├── Listing/            # Страница объявления (v1.1)
│   ├── Profile/            # Личный кабинет
│   ├── Host/               # Кабинет арендодателя
│   └── Auth/               # Логин / Регистрация
│
├── widgets/                # Крупные UI-блоки (оркестраторы)
│   ├── SearchPanel/        # Панель поиска (Glassmorphism)
│   ├── ListingCard/        # Карточка объявления
│   └── ProfileHeader/      # Шапка профиля с бейджем
│
├── features/               # Независимые фичи с логикой
│   ├── location-suggest/   # Автокомплит городов (RTK Query)
│   ├── date-picker/        # Выбор дат заезда/выезда
│   ├── guests-selector/    # Попап выбора гостей
│   ├── listing-create/     # Создание объявления (многошаговый флоу)
│   ├── referral/           # Реферальная система
│   └── auth/               # Логин/регистрация формы
│
├── entities/               # Бизнес-сущности
│   ├── user/               # User модель + slice
│   ├── listing/            # Listing модель + карточка
│   └── subscription/       # Subscription логика
│
└── shared/                 # Переиспользуемое
    ├── api/                # baseQuery + RTK Query endpoints
    ├── ui/                 # Button, Input, Modal, Toast
    ├── lib/                # Хелперы, хуки
    └── config/             # Константы, env переменные
Redux Store (RTK)
typescript
// app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { api } from '@/shared/api/baseApi'
import { userSlice } from '@/entities/user'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
Базовый RTK Query API
typescript
// shared/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Listing', 'Referral'],
  endpoints: () => ({}),
})
Widget: SearchPanel (Glassmorphism)
typescript
// widgets/SearchPanel/ui/SearchPanel.tsx
import { useNavigate } from 'react-router-dom'
import { LocationSuggest } from '@/features/location-suggest'
import { DatePicker } from '@/features/date-picker'
import { GuestsSelector } from '@/features/guests-selector'
import styles from './SearchPanel.module.css'

export const SearchPanel = () => {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [checkIn, setCheckIn] = useState<string | null>(null)
  const [checkOut, setCheckOut] = useState<string | null>(null)
  const [adults, setAdults] = useState(1)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('adults', String(adults))

    // Формируем красивый URL: /search?city=Томск&checkIn=2026-06-19&adults=2
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className={styles.panel}>
      <LocationSuggest value={city} onChange={setCity} />
      <DatePicker
        checkIn={checkIn}
        checkOut={checkOut}
        onChangeCheckIn={setCheckIn}
        onChangeCheckOut={setCheckOut}
      />
      <GuestsSelector adults={adults} onChange={setAdults} />
      <button className={styles.searchBtn} onClick={handleSearch}>
        Найти хатку
      </button>
    </div>
  )
}
css
/* widgets/SearchPanel/ui/SearchPanel.module.css */
/* Glassmorphism эффект */
.panel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;

  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Адаптив под мобилки */
@media (max-width: 768px) {
  .panel {
    flex-direction: column;
    width: 100%;
  }
}
Feature: location-suggest (RTK Query + Debounce)
typescript
// features/location-suggest/api/locationApi.ts
import { api } from '@/shared/api/baseApi'

interface LocationSuggestion {
  id: string
  name: string
  region: string
}

export const locationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSuggestions: build.query<LocationSuggestion[], string>({
      query: (q) => `/locations/suggest?q=${encodeURIComponent(q)}`,
      // RTK Query кеширует ответы — повторный ввод "Томск" не вызовет запрос
      keepUnusedDataFor: 300, // 5 минут кеша
    }),
  }),
})

export const { useGetSuggestionsQuery } = locationApi
typescript
// features/location-suggest/ui/LocationSuggest.tsx
import { useState } from 'react'
import { useGetSuggestionsQuery } from '../api/locationApi'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const LocationSuggest = ({ value, onChange }: Props) => {
  const [inputValue, setInputValue] = useState(value)
  const [debouncedValue, setDebouncedValue] = useState(value)

  // Debounce через useEffect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(inputValue), 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  // Запрос не уйдёт, пока не введено 2+ символа
  const { data: suggestions } = useGetSuggestionsQuery(debouncedValue, {
    skip: debouncedValue.length < 2,
  })

  return (
    <div className={styles.wrapper}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Куда едем?"
      />
      {suggestions && suggestions.length > 0 && (
        <ul className={styles.dropdown}>
          {suggestions.map((s) => (
            <li key={s.id} onClick={() => { onChange(s.name); setInputValue(s.name) }}>
              {s.name}, {s.region}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
Page: Search (парсинг URL + RTK Query)
typescript
// pages/Search/ui/SearchPage.tsx
import { useSearchParams } from 'react-router-dom'
import { useGetListingsQuery } from '@/entities/listing'

export const SearchPage = () => {
  const [searchParams] = useSearchParams()

  // Парсим URL: /search?city=Томск&checkIn=2026-06-19&adults=2
  const city = searchParams.get('city') ?? ''
  const checkIn = searchParams.get('checkIn') ?? ''
  const checkOut = searchParams.get('checkOut') ?? ''
  const adults = Number(searchParams.get('adults') ?? 1)

  // RTK Query автоматически рефетчит при изменении параметров
  const { data: listings, isLoading, isError } = useGetListingsQuery({
    city,
    checkIn,
    checkOut,
    adults,
  })

  if (isLoading) return <SearchSkeleton />
  if (isError) return <SearchError />

  return (
    <div className={styles.page}>
      <SearchPanel /> {/* Виджет поиска сверху */}
      <ListingsGrid listings={listings ?? []} />
    </div>
  )
}
Backend Архитектура
Структура проекта
text
src/
├── index.ts               # Entry point, Express app
├── routes/                # Express роуты
│   ├── auth.routes.ts
│   ├── listings.routes.ts
│   ├── locations.routes.ts
│   ├── profile.routes.ts
│   └── referral.routes.ts
├── controllers/           # Бизнес-логика
│   ├── auth.controller.ts
│   ├── listings.controller.ts
│   ├── locations.controller.ts
│   ├── profile.controller.ts
│   └── referral.controller.ts
├── middleware/
│   ├── auth.middleware.ts  # JWT проверка
│   ├── validate.ts         # Zod валидация
│   └── rateLimit.ts
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── jwt.ts
│   ├── email.ts
│   └── s3.ts
├── schemas/               # Zod схемы валидации
│   ├── auth.schema.ts
│   ├── listing.schema.ts
│   └── profile.schema.ts
└── types/                 # TypeScript типы
    └── index.ts
Prisma Client (singleton)
typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
Zod Схемы (валидация)
typescript
// schemas/auth.schema.ts
import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Невалидный email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Za-z]/, 'Пароль должен содержать буквы')
    .regex(/[0-9]/, 'Пароль должен содержать цифры'),
  password_confirm: z.string(),
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  city: z.string().min(1).max(100),
}).refine((data) => data.password === data.password_confirm, {
  message: 'Пароли не совпадают',
  path: ['password_confirm'],
})

// schemas/listing.schema.ts
export const listingStep3ApartmentSchema = z.object({
  apartment_info: z.object({
    area_sqm: z.number().min(1).max(500),
    floor: z.number().min(1),
    total_floors: z.number().min(1).max(150),
    rooms_count: z.number().min(1).max(20),
    kitchen_type: z.enum(['отдельная', 'студия', 'кухня-ниша', 'отсутствует']),
    repair_type: z.enum(['евроремонт', 'косметический', 'дизайнерский', 'без ремонта']),
    has_elevator: z.boolean(),
    is_mansard: z.boolean(),
  }).refine((data) => data.floor <= data.total_floors, {
    message: 'Этаж не может быть выше, чем этажей в доме',
    path: ['floor'],
  }),
  // ... другие поля
})
Middleware: validate (Zod)
typescript
// middleware/validate.ts
import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export const validate = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Невалидные данные',
          details: result.error.flatten(),
        },
      })
    }
    req.body = result.data  // Типизированные данные после валидации
    next()
  }
Middleware: auth (JWT)
typescript
// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token not provided' },
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
    })
  }
}
Route: Автокомплит городов
typescript
// routes/locations.routes.ts
import { Router } from 'express'
import { locationsController } from '../controllers/locations.controller'

const router = Router()

// GET /api/locations/suggest?q=Том
router.get('/suggest', locationsController.suggest)

export default router
typescript
// controllers/locations.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

// Топ городов в памяти для мгновенного ответа
const POPULAR_CITIES = [
  { id: '1', name: 'Москва', region: 'Московская область' },
  { id: '2', name: 'Санкт-Петербург', region: 'Ленинградская область' },
  { id: '3', name: 'Томск', region: 'Томская область' },
  { id: '4', name: 'Новосибирск', region: 'Новосибирская область' },
  { id: '5', name: 'Екатеринбург', region: 'Свердловская область' },
  // ... ещё 50 популярных городов
]

export const locationsController = {
  suggest: async (req: Request, res: Response) => {
    const q = String(req.query.q ?? '').trim().toLowerCase()
    
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] })
    }

    // Сначала ищем в памяти — отвечает за ~1ms
    const fromMemory = POPULAR_CITIES
      .filter(c => c.name.toLowerCase().startsWith(q))
      .slice(0, 5)

    if (fromMemory.length >= 3) {
      return res.json({ success: true, data: fromMemory })
    }

    // Если мало — запрашиваем из БД
    // Используем raw query для ILIKE и лимита
    const fromDb = await prisma.$queryRaw`
      SELECT DISTINCT city as name, region
      FROM "Listing"
      WHERE LOWER(city) LIKE ${q + '%'}
        AND status = 'APPROVED'
      LIMIT 5
    `

    return res.json({ success: true, data: fromDb })
  },
}
Controller: Основной поиск (Prisma + GIN индексы)
typescript
// controllers/listings.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const searchSchema = z.object({
  city: z.string().optional(),
  checkIn: z.string().datetime().optional(),
  checkOut: z.string().datetime().optional(),
  adults: z.coerce.number().min(1).max(20).optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'ROOM']).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  amenities: z.string().optional(), // через запятую: "wifi,кондиционер"
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
})

export const listingsController = {
  search: async (req: Request, res: Response) => {
    const params = searchSchema.safeParse(req.query)
    
    if (!params.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: params.error.flatten() },
      })
    }

    const { city, checkIn, checkOut, adults, type, minPrice, maxPrice, amenities, page, limit } = params.data

    const amenityList = amenities?.split(',').map(a => a.trim()).filter(Boolean) ?? []
    const skip = (page - 1) * limit

    // Prisma query с GIN-индексами PostgreSQL 15
    // Строгая типизация TypeScript — если ошибиться в имени поля, проект не соберётся в Vite
    const where: any = {
      status: 'APPROVED',
      isDeleted: false,
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(type && { type }),
      ...(minPrice && { pricePerDay: { gte: minPrice } }),
      ...(maxPrice && { pricePerDay: { ...( minPrice ? { gte: minPrice } : {}), lte: maxPrice } }),
    }

    // Фильтр по удобствам через GIN-индекс (raw query)
    // GIN позволяет искать по массиву amenities внутри JSON за O(log n)
    let listingIds: string[] | undefined
    if (amenityList.length > 0) {
      const result = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Listing"
        WHERE status = 'APPROVED'
          AND details->'amenities' @> ${JSON.stringify(amenityList)}::jsonb
      `
      listingIds = result.map(r => r.id)
      if (listingIds.length === 0) {
        return res.json({ success: true, data: { listings: [], total: 0, page, limit } })
      }
      where.id = { in: listingIds }
    }

    // Отсекаем занятые даты через связанные бронирования (на v1.1 с бронями)
    // Пока без броней — просто фильтруем по параметрам
    if (checkIn && checkOut) {
      where.NOT = {
        // bookings: { some: { ... overlapping dates } }
        // Будет реализовано в v1.1
      }
    }

    const [listings, total] = await prisma.$transaction([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          photos: { take: 1, orderBy: { order: 'asc' } },
          host: { select: { id: true, firstName: true, avatarUrl: true } },
        },
      }),
      prisma.listing.count({ where }),
    ])

    return res.json({
      success: true,
      data: {
        listings,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  },
}
Аутентификация
POST /api/auth/register
Request:

json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "first_name": "Иван",
  "last_name": "Иванов",
  "city": "Томск"
}
Контроллер (Prisma):

typescript
// controllers/auth.controller.ts
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

export const authController = {
  register: async (req: Request, res: Response) => {
    const { email, password, first_name, last_name, city } = req.body

    // Проверка на существующий email
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: 'Email уже зарегистрирован' },
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Транзакция: создать пользователя + подписку одновременно
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName: first_name,
          lastName: last_name,
          city,
          role: 'GUEST',
        },
      })

      // Создать пустую подписку для арендатора
      await tx.subscription.create({
        data: {
          userId: newUser.id,
          daysRemaining: 0,
          expiresAt: null,
        },
      })

      return newUser
    })

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )

    // Отправить welcome email
    await sendWelcomeEmail(user.email, user.firstName)

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
        accessToken,
        refreshToken,
      },
    })
  },
}
Error Cases:

409 — Email уже зарегистрирован

400 — Пароли не совпадают (Zod)

400 — Невалидные данные (Zod)

POST /api/auth/login
typescript
login: async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email, isDeleted: false }
  })
  
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Email или пароль неверны' },
    })
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' })

  return res.json({ success: true, data: { accessToken, refreshToken } })
}
Создание объявления
Общие принципы
Все типы объявлений используют многошаговый флоу с автосохранением.

Состояния объявления:

DRAFT — черновик

PENDING — на модерации

APPROVED — одобрено

REJECTED — отклонено (с причиной)

POST /api/listings — Создать черновик
typescript
create: async (req: AuthRequest, res: Response) => {
  const listing = await prisma.listing.create({
    data: {
      hostId: req.userId!,
      type: req.body.type, // APARTMENT | HOUSE | ROOM
      status: 'DRAFT',
      stepsCompleted: 0,
    },
  })
  return res.status(201).json({ success: true, data: listing })
}
PATCH /api/listings/:id/step/:step — Автосохранение шага
typescript
updateStep: async (req: AuthRequest, res: Response) => {
  const { id, step } = req.params
  const stepNum = parseInt(step)

  // Проверить, что объявление принадлежит пользователю
  const listing = await prisma.listing.findFirst({
    where: { id, hostId: req.userId!, isDeleted: false }
  })
  if (!listing) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } })
  }

  // Обновить данные шага
  const updated = await prisma.listing.update({
    where: { id },
    data: {
      ...req.body, // Данные шага
      stepsCompleted: Math.max(listing.stepsCompleted, stepNum),
      updatedAt: new Date(),
    },
  })

  return res.json({ success: true, data: updated })
}
Логика автосохранения:

Фронт делает PATCH каждые 5 секунд или при blur инпута

Бэк обновляет только переданные поля через Prisma

stepsCompleted инкрементируется только если передан полный набор полей для данного шага

Если шаг не завершён, поле всё равно сохраняется в details JSON

POST /api/listings/:id/photos — Загрузка фото
typescript
uploadPhoto: async (req: AuthRequest, res: Response) => {
  const file = req.file // multer обрабатывает multipart
  
  // Загрузить на S3
  const key = `listings/${req.params.id}/photo_${uuid()}.jpg`
  const url = await uploadToS3(file.buffer, key, file.mimetype)
  const thumbnailUrl = await generateThumbnail(file.buffer, key)

  const photo = await prisma.listingPhoto.create({
    data: {
      listingId: req.params.id,
      url,
      thumbnailUrl,
      order: await getNextPhotoOrder(req.params.id),
    },
  })

  return res.status(201).json({ success: true, data: photo })
}
Валидация:

Форматы: JPG, PNG, HEIC

Максимум 10 MB

Минимум разрешение 900×900 px

Минимум 3 фото для отправки на модерацию

POST /api/listings/:id/submit — Отправка на модерацию
typescript
submit: async (req: AuthRequest, res: Response) => {
  const listing = await prisma.listing.findFirst({
    where: { id: req.params.id, hostId: req.userId! },
    include: { photos: true },
  })

  // Проверки
  if (!listing) return res.status(404).json({ ... })
  if (listing.stepsCompleted < 16) return res.status(400).json({
    success: false,
    error: { code: 'INCOMPLETE', message: 'Не все шаги заполнены' }
  })
  if (listing.photos.length < 3) return res.status(400).json({
    success: false,
    error: { code: 'INSUFFICIENT_PHOTOS', message: 'Минимум 3 фотографии' }
  })

  const updated = await prisma.listing.update({
    where: { id: listing.id },
    data: { status: 'PENDING' },
  })

  // Уведомить модератора (email)
  await sendModerationEmail(listing.title)

  return res.json({
    success: true,
    data: {
      id: updated.id,
      status: 'PENDING',
      message: 'Объявление отправлено на модерацию. Обычно проверка занимает 24 часа.',
    },
  })
}
Дома и Коттеджи — отличия от квартиры
Поля details JSON для домов:

json
{
  "house_info": {
    "area_sqm": 250,
    "area_sotka": 15,
    "total_floors": 2,
    "rooms_count": 4,
    "kitchen_type": "отдельная",
    "repair_type": "евроремонт"
  }
}
Нет полей: floor, has_elevator, is_mansard — они не актуальны для домов.

Удобства территории (расширенный список для домов):

json
{
  "amenities": {
    "territory": [
      "баня_сауна", "бассейн", "беседка", "барбекю_мангал",
      "детская_площадка", "гараж", "летняя_кухня", "огород",
      "теплица", "колодец", "забор_ограждение", "видеонаблюдение"
    ]
  }
}
Отдельные комнаты — отличия
Поля details JSON для комнат:

json
{
  "room_info": {
    "area_sqm": 20,
    "floor": 2,
    "total_floors": 5,
    "has_elevator": true,
    "is_mansard": false,
    "repair_type": "косметический"
  },
  "guest_access": {
    "kitchen_access": true,
    "bathroom_type": "отдельная",
    "other_rooms_access": "только_комната"
  }
}
Нет полей: rooms_count, kitchen_type — комната одна, кухня общая.

Zod валидация:

typescript
bathroom_type: z.enum(['отдельная', 'общая_с_хозяином', 'общая_с_гостями'])
other_rooms_access: z.enum(['только_комната', 'общие_зоны'])
Личный кабинет
GET /api/profile
typescript
getProfile: async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId!, isDeleted: false },
    include: {
      subscription: true,
      commissionFreePeriod: true,
    },
  })

  if (!user) return res.status(404).json({ ... })

  // Вычислить актуальные дни подписки
  const subDays = calcRemainingDays(user.subscription?.expiresAt)
  const commDays = calcRemainingDays(user.commissionFreePeriod?.expiresAt)

  return res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      phone: user.phone,
      city: user.city,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      subscription: {
        daysRemaining: subDays,
        expiresAt: user.subscription?.expiresAt,
      },
      commissionFreePeriod: {
        daysRemaining: commDays,
        expiresAt: user.commissionFreePeriod?.expiresAt,
        commissionPercentage: commDays > 0 ? 0 : 5,
      },
    },
  })
}

// Хелпер
function calcRemainingDays(expiresAt?: Date | null): number {
  if (!expiresAt) return 0
  const diff = expiresAt.getTime() - Date.now()
  return diff > 0 ? Math.ceil(diff / 86400000) : 0
}
Бейдж подписки — логика для Фронта
typescript
// entities/subscription/ui/SubscriptionBadge.tsx
type BadgeState = 'active' | 'warning' | 'expired'

function getBadgeState(days: number): BadgeState {
  if (days > 3) return 'active'
  if (days > 0) return 'warning'    // пульсация CSS
  return 'expired'
}

// Для арендатора: "🟡 14 дней подписки"
// Для хоста:     "🟢 8 дней без комиссии"
// Истекло:       "🔴 Подписка истекла" / "🔴 Комиссия активна (5%)"
css
/* Пульсация при days <= 3 */
.badge--warning {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
PATCH /api/profile — Обновить профиль
Zod схема:

typescript
export const updateProfileSchema = z.object({
  first_name: z.string().min(1).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),
  middle_name: z.string().max(50).optional(),
  phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/).optional(),
  city: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
})
typescript
updateProfile: async (req: AuthRequest, res: Response) => {
  const data = req.body // Zod уже провалидировал

  const updated = await prisma.user.update({
    where: { id: req.userId! },
    data: {
      firstName: data.first_name,
      lastName: data.last_name,
      middleName: data.middle_name,
      phone: data.phone,
      city: data.city,
      bio: data.bio,
    },
  })

  return res.json({ success: true, data: updated })
}
DELETE /api/profile — Удалить аккаунт
typescript
deleteAccount: async (req: AuthRequest, res: Response) => {
  // Проверить нет ли активных броней (v1.1)
  // const activeBookings = await prisma.booking.count({...})
  // if (activeBookings > 0) return res.status(400).json({...})

  // Soft delete: сохраняем данные, просто помечаем как удалённого
  await prisma.user.update({
    where: { id: req.userId! },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      email: `deleted_${req.userId}@deleted.com`, // освобождаем email для повторной регистрации
    },
  })

  return res.json({ success: true, data: { message: 'Аккаунт удалён' } })
}
Реферальная система
Таблица Referrals (Prisma — см. schema выше)
Ключевая логика:

Для арендаторов: активация при регистрации нового пользователя по ссылке → +4 дня обоим

Для арендодателей: активация при публикации первого объявления → +4 дня обоим

Защита от фрода: один email = одна регистрация; повторные не начисляют дни

GET /api/referral/link
typescript
getLink: async (req: AuthRequest, res: Response) => {
  const baseUrl = process.env.FRONTEND_URL
  const referralLink = `${baseUrl}/register?ref=${req.userId}`

  return res.json({
    success: true,
    data: {
      referralLink,
      referralCode: req.userId,
    },
  })
}
GET /api/referral/stats
typescript
getStats: async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    include: { subscription: true, commissionFreePeriod: true },
  })

  const referrals = await prisma.referral.findMany({
    where: { referrerId: req.userId! },
    include: {
      referredUser: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          listings: { select: { id: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalDaysEarned = referrals.reduce((sum, r) => sum + r.daysEarned, 0)

  return res.json({
    success: true,
    data: {
      totalReferrals: referrals.length,
      activeReferrals: referrals.filter(r => r.status === 'ACTIVATED').length,
      pendingReferrals: referrals.filter(r => r.status === 'PENDING').length,
      totalDaysEarned,
      daysRemaining: calcRemainingDays(
        user?.role === 'HOST'
          ? user?.commissionFreePeriod?.expiresAt
          : user?.subscription?.expiresAt
      ),
      referrals: referrals.map(r => ({
        referredUserId: r.referredUser.id,
        referredUserName: `${r.referredUser.firstName} ${r.referredUser.lastName[0]}.`,
        registrationDate: r.referredUser.createdAt,
        status: r.status,
        daysEarned: r.daysEarned,
        listingsCount: r.referredUser.listings.length,
      })),
    },
  })
}
Функция начисления дней (реиспользуется)
typescript
// lib/referral.ts
import { prisma } from './prisma'

export async function activateReferral(
  referrerId: string,
  referredUserId: string,
  type: 'GUEST' | 'HOST',
  days: number = 4
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Обновить статус реферраля
    await tx.referral.updateMany({
      where: {
        referrerId,
        referredUserId,
        status: 'PENDING',
      },
      data: {
        status: 'ACTIVATED',
        daysEarned: days,
        activatedAt: new Date(),
      },
    })

    // Начислить дни реферреру
    await addDays(tx, referrerId, type, days)

    // Начислить дни приглашённому
    await addDays(tx, referredUserId, type, days)
  })

  // Отправить email обоим
  await sendReferralActivatedEmail(referrerId, referredUserId, days)
}

async function addDays(tx: any, userId: string, type: 'GUEST' | 'HOST', days: number) {
  const now = new Date()
  
  if (type === 'GUEST') {
    const sub = await tx.subscription.findUnique({ where: { userId } })
    const currentExpiry = sub?.expiresAt && sub.expiresAt > now ? sub.expiresAt : now
    const newExpiry = new Date(currentExpiry.getTime() + days * 86400000)
    
    await tx.subscription.upsert({
      where: { userId },
      update: { expiresAt: newExpiry, daysRemaining: { increment: days } },
      create: { userId, expiresAt: newExpiry, daysRemaining: days },
    })
  } else {
    const period = await tx.commissionFreePeriod.findUnique({ where: { userId } })
    const currentExpiry = period?.expiresAt && period.expiresAt > now ? period.expiresAt : now
    const newExpiry = new Date(currentExpiry.getTime() + days * 86400000)
    
    await tx.commissionFreePeriod.upsert({
      where: { userId },
      update: { expiresAt: newExpiry, daysRemaining: { increment: days } },
      create: { userId, expiresAt: newExpiry, daysRemaining: days },
    })
  }
}
Хук в регистрации — автоматическая активация для гостей
typescript
// В controllers/auth.controller.ts, register endpoint, после создания юзера:

const refCode = req.query.ref as string | undefined
if (refCode) {
  // Создать pending реферраль
  await prisma.referral.create({
    data: {
      referrerId: refCode,
      referredUserId: user.id,
      referrerRole: 'GUEST',
      status: 'PENDING',
      daysEarned: 0,
    },
  })
  
  // Для гостей активируем сразу
  await activateReferral(refCode, user.id, 'GUEST', 4)
}
Хук в публикации объявления — активация для хостов
typescript
// В controllers/listings.controller.ts, submit endpoint, после обновления статуса:

// Проверить первое ли это объявление у пользователя
const listingsCount = await prisma.listing.count({
  where: { hostId: req.userId!, status: 'APPROVED' }
})

if (listingsCount === 1) {
  // Это первое объявление — активировать реферраль
  const pendingReferral = await prisma.referral.findFirst({
    where: { referredUserId: req.userId!, status: 'PENDING' }
  })
  
  if (pendingReferral) {
    await activateReferral(pendingReferral.referrerId, req.userId!, 'HOST', 4)
  }
}
Техническая спецификация
Stack
Компонент	Технология	Версия
Runtime	Node.js	20+ LTS
Language	TypeScript	5.x (strict mode)
Framework	Express.js	4.x
ORM	Prisma	5.x
Database	PostgreSQL	15
Cache	Redis	7.x
Validation	Zod	3.x
Auth	JWT (jsonwebtoken)	9.x
Hashing	bcrypt	5.x
File Upload	Multer + AWS SDK v3	—
Email	SendGrid / Mailgun	—
Frontend	React 19 + Vite	—
State	Redux Toolkit	2.x
Router	React Router	7.x
Type safety	TypeScript strict	—
Безопасность
HTTPS для всех запросов

CORS: только разрешённые домены (не *)

Rate limiting: 100 req/мин на IP, 5 попыток login/мин

JWT: access token 15 минут, refresh token 7 дней

bcrypt: salt 12+

Zod: валидировать ВСЕ входные данные на Бэке

SQL injection: только Prisma (параметризованные запросы)

XSS: экранировать output

Helmet.js: HTTP security headers

1400. Логировать все критические действия (login, создание объявления, удаление аккаунта)
1401. Шифрование чувствительных данных в покое (GDPR compliance)

---

### Обработка ошибок

**Все endpoints должны возвращать стандартный формат:**

**Success (2xx):**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email уже зарегистрирован",
    "details": {
      "field": "email",
      "value": "user@example.com"
    }
  }
}
```

**Коды ошибок:**
- `VALIDATION_ERROR` — Невалидные данные
- `UNAUTHORIZED` — Не авторизован (401)
- `FORBIDDEN` — Нет прав доступа (403)
- `NOT_FOUND` — Ресурс не найден (404)
- `CONFLICT` — Конфликт (например, email уже существует) (409)
- `INTERNAL_ERROR` — Внутренняя ошибка сервера (500)

---

### Кеширование

**Что кешировать в Redis:**
- Данные профиля пользователя (TTL: 1 час)
- Подписки и реферальные данные (TTL: 30 минут)
- Список удобств (справочник) (TTL: 24 часа)
- Данные объявлений в драфте (TTL: 2 часа)

**Инвалидировать кеш при:**
- Обновлении профиля
- Изменении подписки
- Добавлении реферраля

---

### Email шаблоны

Все email должны быть в HTML и plain text версиях.

**Email при регистрации:**
```
Тема: Добро пожаловать на {site_name}!

Привет, {first_name}!

Спасибо за регистрацию. Теперь ты можешь:
- Ищи уютное жильё на недели
- Или публикуй свои объекты в аренду
- Приглашай друзей и получай дни премиума!

[Кнопка: Начать]

Если это не ты, просто проигнорируй письмо.

Спасибо,
Команда {site_name}
```

**Email при активации реферраля:**
```
(см. выше в разделе Реферальная система)
```

**Email при отправке объявления на модерацию:**
```
Тема: Ваше объявление отправлено на модерацию

Привет, {first_name}!

Мы получили ваше объявление "{listing_title}".

Обычно проверка занимает 24 часа.
Мы отправим вам письмо, когда оно будет одобрено.

[Кнопка: Посмотреть объявление]

Спасибо,
Команда {site_name}
```

---

### Мониторинг и логирование

**Обязательно логировать:**
- Все попытки входа (успешные и неудачные)
- Создание, обновление, удаление объявлений
- Активации рефералов
- Удаления аккаунтов
- Ошибки 4xx и 5xx

**Использовать:**
- Winston / Bunyan для логирования
- Sentry для отслеживания ошибок
- Datadog / New Relic для мониторинга производительности

---

### Testing

**Минимальные требования:**
- Unit tests для всех бизнес-логики (минимум 80% покрытие)
- Integration tests для всех endpoints
- Load testing перед production (как минимум 1000 одновременных пользователей)

```bash
# Примеры команд для запуска тестов
npm test                    # Unit + Integration
npm run test:load          # Load testing
npm run test:coverage      # Code coverage report
```

---

### Deploy и DevOps

**CI/CD Pipeline:**
1. Push → GitHub
2. GitHub Actions запускает тесты
3. Если тесты пройдены → deploy на staging
4. Ручной deploy на production

**Environment variables:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mvp_rental
DB_USER=postgres
DB_PASSWORD=xxx

REDIS_URL=redis://localhost:6379

JWT_SECRET=xxx
JWT_REFRESH_SECRET=xxx

AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=mvp-rental-photos
AWS_REGION=us-east-1

SENDGRID_API_KEY=xxx
SENDGRID_FROM_EMAIL=noreply@example.com

NODE_ENV=production
```

---

### Performance targets

- Время ответа API: < 200ms для 95% запросов
- Загрузка фото: < 5 секунд для 10 MB файла
- Кешируемые запросы: < 50ms
- Page load time: < 2 секунд

---

### Roadmap для v1.1 и позже

**v1.1 (апрель 2026):**
- Платёжная система (Stripe, Yandex Kassa)
- Страница поиска и фильтрация
- Страница объявления с бронированием
- Система рейтингов и отзывов

**v### Якорь 3 — Фото (Расширенная спецификация)

#### Принципы работы и лимиты
- **Количество**: Минимум 3 фото, максимум 50 фото на номер.
- **Допустимые форматы**: JPG, JPEG, PNG, WEBP, HEIC.
- **Размер файла**: от 10 КБ до 10 МБ.
- **Разрешение**: Минимум 900×900 px.
- **Первое фото в сетке** = главное фото номера (обложка).

#### 1. Зона загрузки (Dropzone UI)
Пустое состояние или блок добавления новых фото (когда уже есть загруженные, этот блок висит последним в сетке или над ней).
```text
┌───────────────────────────────────────────────────────────┐
│                           [ 📷 ]                          │
│                Перетащите фотографии сюда                 │
│               или нажмите для выбора файлов               │
│                                                           │
│   Форматы: JPG, PNG, WEBP, HEIC. Максимальный вес: 10 МБ  │
│               Минимальное разрешение 900×900 px           │
└───────────────────────────────────────────────────────────┘
```
- **Поведение при Drag-over**: Подсветка зоны, курсор `copy`, предотвращение открытия файла в браузере.

#### 2. Жизненный цикл загрузки и состояния (UI)
- **Состояние «Чтение файла» (Client-side)**: Серый скелетон. Валидация размера, типа и разрешения (через `new Image()`).
- **Состояние «Загрузка на сервер»**: Блюр-превью + круговой прогресс-бар (или надпись «Загрузка...»). Кнопка (×) отменяет запрос.
- **Состояние «Успех»**: Четкое фото, иконка (☰) для сортировки и (×) для удаления.
- **Состояние «Локальная ошибка»**: Красная плашка с текстом ошибки + кнопка (×) для закрытия.

#### 3. Corner Cases и Валидация
- **Битый файл**: Ошибка «Файл поврежден».
- **Подмена расширения**: Проверка сигнатуры ("Magic numbers") на бэкенде.
- **Тяжелый файл**: Превышение 10 МБ.
- **Маленькое разрешение**: Менее 900x900 px.
- **Дубликаты**: Игнорирование по `name + size + lastModified`.

#### 4. Требования к Бэкенду (Security & Processing)
- **Проверка сигнатур**: Использование `file-type`.
- **Санитизация EXIF**: Удаление GPS и метаданных.
- **Авто-конвертация**: Все в WEBP/Optimized JPEG.
- **Thumbnails**: Генерация миниатюр (400×300 px).

#### 5. Эндпоинты
- `POST /api/listings/:listingId/rooms/:roomId/photos` (multipart)
- `PATCH /api/listings/:listingId/rooms/:roomId/photos/reorder` (body: { photos: [{ id, order }] })
- `DELETE /api/listings/:listingId/rooms/:roomId/photos/:photoId`
**v1.2 (май 2026):**
- Система чатов между арендатором и хозяином
- Уведомления в реал-тайме (WebSocket)
- Личный календарь доступности

**v2.0 (июнь 2026 и далее):**
- Мобильное приложение (iOS/Android)
- AI рекомендации
- Программа лояльности
- Интеграция с социальными сетями

---

### Часто задаваемые вопросы для Бэк-разработчика

### Q: Как обрабатывать автосохранение при создании объявления?

**A:** Каждый PATCH /api/listings/{id}/step-N должен:
1. Валидировать данные
2. Обновлять только измененные поля в БД
3. Обновлять timestamp updated_at
4. Инкрементировать steps_completed только если шаг полностью заполнен
5. Возвращать весь объект с новым состоянием

Фронтенд может делать autosave каждые 5 секунд во время редактирования.

---

### Q: Как обрабатывать загрузку фото?

**A:**
1. Генерировать уникальный ID для фото: `photo_{uuid}`
2. Загружать файл на S3 с путём: `listings/{listing_id}/photo_{uuid}.jpg`
3. Генерировать thumbnail (300×300) параллельно
4. Сохранять метаданные в БД (URL, order)
5. Возвращать URL для отображения на Фронте

Используйте AWS SDK для Node.js или эквивалент.

---

### Q: Как отслеживать активацию реферраля для хоста?

**A:**
1. При создании Listing, если это первое объявление пользователя:
   - Получить из сессии user_id (пригласившего)
   - Найти запись Referral где referred_user_id = current_user
   - Проверить статус = 'pending'
   - При approve объявления → активировать реферраль

2. Вызвать функцию `activate_referral(referrer_id, referred_user_id, days=4)`

---

### Q: Как считать дни подписки?

**A:**
```javascript
// Сохранять в БД expires_at как timestamp
// При каждом запросе к профилю:

let days_remaining = 0
if (subscription.expires_at > NOW) {
  days_remaining = Math.ceil((subscription.expires_at - NOW) / 86400)
}

// Если days <= 0, считать подписка истекшей
```

---

### Q: Как защитить endpoints от неавторизованных пользователей?

**A:**
```javascript
// Express middleware для проверки JWT
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token not provided' }
    })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user_id = decoded.user_id
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token' }
    })
  }
}

// Использование
app.get('/api/profile', authMiddleware, (req, res) => {
  // req.user_id доступен
})
```

---

### Q: Как обрабатывать soft delete при удалении аккаунта?

**A:**
```sql
-- Добавить колонку в users таблицу
ALTER TABLE users ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;

-- При удалении:
UPDATE users 
SET is_deleted = true, deleted_at = NOW() 
WHERE id = $1;

-- При выборке:
SELECT * FROM users WHERE id = $1 AND is_deleted = false;
```

---

### Q: Какой максимальный размер данных объявления в JSON?

**A:**
- Примерно 50–100 KB на одно объявление в максимальном случае
- Храните в отдельной колонке `details JSON` или разбейте на несколько таблиц
- Индексируйте часто используемые поля отдельными колонками для быстрого поиска (type, price, rooms_count и т.д.)

---

### Контрольный список для запуска MVP

- [ ] База данных PostgreSQL создана и мигрирована
- [ ] Redis сервер запущен
- [ ] AWS S3 бакет создан и настроен
- [ ] SendGrid аккаунт создан и API ключ сохранён
- [ ] JWT секреты сгенерированы
- [ ] CORS настроен для домена Фронта
- [ ] Все endpoints покрыты unit & integration тестами
- [ ] Load test пройден успешно (>1000 одновременных пользователей)
- [ ] SSL сертификат установлен
- [ ] Логирование и мониторинг настроены
- [ ] Backup стратегия определена
- [ ] Документация API готова (Swagger/OpenAPI)
- [ ] Все email шаблоны отправляются корректно
- [ ] Фронтенд интегрирован с Бэком (тестирование E2E)
- [ ] Production deploy выполнен
- [ ] Мониторинг в production запущен

---

### Заключение

Этот документ охватывает **полный MVP** для платформы недельной аренды жилья.

---

## Редактор номеров (Отели)

### Общая структура страницы /host/listings/:id/rooms/new

Страница редактирования номера — это не многошаговый wizard, а одностраничный редактор с якорным меню (sidebar navigation). Все секции видны одновременно, пользователь скроллит или кликает по якорям в левом меню.

#### Левый сайдбар (якоря):
*   Описание и цены
*   Удобства номера
*   Фото
*   Настройки бронирования
*   Привилегии (пост-MVP)
*   Договор (пост-MVP)
*   Календарь и сезонные цены (ссылка-переход, иконка стрелки)

**Для Бэка и Фронта**: Заголовок страницы берётся из названия номера (room.title). Кнопка «← Назад к отелю» — это Maps(-1) или ссылка на /host/listings/:id.
Кнопок «Отмена» и «Сохранить изменения» в интерфейсе нет. Каждая секция сохраняется автоматически при изменении данных (используется автосохранение PATCH запросами с debounce 1500ms).

### Якорь 1 — Описание и цены

#### Блок «Описание номера»
| Поле | Тип | Детали |
| :--- | :--- | :--- |
| Название номера (уникальное) | Text input | Публичное название — видно гостям. Обязательное, 3–100 символов |
| Своё название | Text input | Внутреннее название — видно только хозяину. Необязательное, макс 100 символов |

#### Блок «Основная информация»
| Поле | Тип | Детали |
| :--- | :--- | :--- |
| Количество комнат | Stepper (−/+) | Целое число ≥ 1 |
| Площадь номера | Number input + « м²» | Обязательное, > 0 |
| Кол-во номеров этого типа | Number input | Обязательное, ≥ 1 — сколько идентичных номеров в объекте |
| Этаж номера | Дропдаун | Выбор из 1–50+, необязательное |
| Всего этажей в здании | Number input | Обязательное |

**Для Бэка**: Поле «Кол-во номеров этого типа» — это `room.quantity`. Важно для логики доступности.

#### Блок «Подробное описание»
*   Textarea с placeholder «Посмотрите наши рекомендации и добавьте описание объекта».
*   Макс 5000 символов. Счётчик символов под полем.

#### Блок «Вместимость (спальные места)»
*   **Вместимость номера**: Number input «Максимум взрослых гостей на основных местах» — обязательное, ≥ 1.
*   **Основные спальные места**: Дропдаун «Тип кровати» + Number input «Количество».
*   **Дополнительные спальные места**: Аналогичный интерфейс.

**Для Бэка**: Хранить в PostgreSQL как JSONB массивы: `primary_beds: [{type, quantity}]`, `extra_beds: [{type, quantity}]`. Поле `max_guests` = сумма всех quantity в primary_beds.

#### Блок «Базовая стоимость»
| Поле | Тип | Детали |
| :--- | :--- | :--- |
| Валюта для расчётов | Дропдаун | По умолчанию RUB — Российский рубль |
| Минимальный срок проживания | Дропдаун | 1 сутки, 2, 3... |
| Цена за сутки | Number input + « ₽» | Обязательное, > 0 |
| За сколько гостей | Дропдаун | 1, 2, 3... |

#### Блок «Дополнительные сборы»
*   **Страховой депозит**: Number input + « ₽», по умолчанию 0.
*   **Плата за уборку**: Radio: «Включена в стоимость» / «Оплачивается отдельно» (появляется Number input + « ₽»).

### Якорь 2 — Удобства номера
Все удобства делятся на смысловые блоки. В UI это чекбоксы, сгруппированные в 2 колонки.
**Для Бэка**: Все чекбоксы удобств хранятся в одном плоском массиве `amenities: String[]` на уровне комнаты.

### Якорь 3 — Фото
*   **Лимиты**: Минимум 3 фото, максимум 50 фото. Форматы: JPG, PNG, HEIC. До 10 МБ. Минимум 900×900 px.
*   **Интерфейс**: Зона drag-and-drop. Галерея сеткой.
*   **Эндпоинты**:
    *   POST /api/listings/:listingId/rooms/:roomId/photos
    *   PATCH /api/listings/:listingId/rooms/:roomId/photos/reorder
    *   DELETE /api/listings/:listingId/rooms/:roomId/photos/:photoId

### Якорь 4 — Настройки бронирования
*   **Тип бронирования**: Radio: «Бронируют мгновенно» / «Отправляют запрос».
*   **Заезд и выезд**: Дропдаун «Заезд после» и «Выезд до».
*   **Правила размещения**: Животные, курение, вечеринки (Разрешено, Запрещено, По запросу).

### Финальные действия
*   **Предварительный просмотр**: Сохраняет изменения и открывает /listing/:listingId/room/:roomId/preview.
*   **Опубликовать**: Финальная проверка и сабмит.
*   **Эндпоинт**: POST /api/listings/:listingId/rooms/:roomId/submit
