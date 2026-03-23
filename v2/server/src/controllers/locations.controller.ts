import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

const POPULAR_CITIES = [
  { id: '1', name: 'Москва', region: 'Московская область' },
  { id: '2', name: 'Санкт-Петербург', region: 'Ленинградская область' },
  { id: '3', name: 'Томск', region: 'Томская область' },
  { id: '4', name: 'Новосибирск', region: 'Новосибирская область' },
  { id: '5', name: 'Екатеринбург', region: 'Свердловская область' },
]

export const locationsController = {
  suggest: async (req: Request, res: Response) => {
    try {
      const q = String(req.query.q ?? '').trim().toLowerCase()
      
      if (!q || q.length < 2) {
        return res.json({ success: true, data: [] })
      }

      const fromMemory = POPULAR_CITIES
        .filter(c => c.name.toLowerCase().startsWith(q))
        .slice(0, 5)

      if (fromMemory.length >= 3) {
        return res.json({ success: true, data: fromMemory })
      }

      // Используем raw query для регистронезависимого поиска в Listing
      const fromDb = await prisma.$queryRaw<any[]>`
        SELECT DISTINCT city as name, region
        FROM "Listing"
        WHERE LOWER(city) LIKE ${q + '%'}
          AND status = 'APPROVED'
        LIMIT 5
      `

      const combined = [...fromMemory, ...fromDb]
      // Убираем дубликаты по имени
      const unique = Array.from(new Map(combined.map(item => [item.name, item])).values())

      return res.json({ success: true, data: unique.slice(0, 5) })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  cities: async (req: Request, res: Response) => {
     try {
      const cities = await prisma.listing.findMany({
        select: { city: true },
        distinct: ['city'],
        where: { city: { not: null }, status: 'APPROVED' }
      });
      res.json({ success: true, data: cities.map(c => c.city).filter(Boolean) });
    } catch (error) { res.status(500).json({ error: 'Failed to fetch cities' }); }
  }
}
