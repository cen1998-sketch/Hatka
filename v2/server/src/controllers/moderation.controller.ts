import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

export const moderationController = {
  getPending: async (req: Request, res: Response) => {
    try {
      // 1. Получаем листинги-одиночки (Апартаменты и т.д.)
      const listings = await prisma.listing.findMany({
        where: { 
          status: 'PENDING',
          type: { not: 'HOTEL_ROOM' } 
        },
        include: {
          photos: { orderBy: { order: 'asc' } },
          host: { select: { id: true, firstName: true, email: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });

      // 2. Получаем отдельные комнаты отелей
      const rooms = await (prisma.room as any).findMany({
        where: { status: 'PENDING' } as any,
        include: {
          listing: {
            include: {
              host: { select: { id: true, firstName: true, email: true } },
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
      });

      // Формируем единый список "Юнитов"
      const units = [
        ...listings.map(l => ({ 
          ...l, 
          unitType: 'listing',
          displayTitle: l.title || 'Без названия'
        })),
        ...rooms.map((r: any) => ({ 
          ...r, 
          unitType: 'room', 
          displayTitle: `${r.listing?.title || 'Отель'} — ${r.title || 'Номер'}`,
          host: r.listing?.host,
          address: r.listing?.address,
          city: r.listing?.city
        }))
      ];

      res.json({ success: true, data: units });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  getPublished: async (req: Request, res: Response) => {
    try {
      const listings = await prisma.listing.findMany({
        where: { status: 'APPROVED' },
        include: {
          photos: { orderBy: { order: 'asc' } },
          host: { select: { id: true, firstName: true, email: true } },
        },
        orderBy: { updatedAt: 'desc' },
      })
      res.json({ success: true, data: listings })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  approve: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const type = req.query.type as string; // Принудительное приведение

      if (type === 'room') {
        const room = await (prisma.room as any).update({
          where: { id },
          data: { 
            status: 'PUBLISHED',
            moderationComment: null,
            moderationDetails: null
          },
        })
        return res.json({ success: true, data: room })
      }

      const listing = await prisma.listing.update({
        where: { id },
        data: { 
          status: 'APPROVED',
          moderationComment: null,
          moderationDetails: null
        },
      })
      res.json({ success: true, data: listing })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  reject: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { comment, details } = req.body
      const type = req.query.type as string;

      if (type === 'room') {
        const room = await (prisma.room as any).update({
          where: { id },
          data: { 
            status: 'REJECTED',
            moderationComment: comment,
            moderationDetails: details || {}
          },
        })
        return res.json({ success: true, data: room })
      }

      const listing = await prisma.listing.update({
        where: { id },
        data: { 
          status: 'REJECTED',
          moderationComment: comment,
          moderationDetails: details || {}
        },
      })
      res.json({ success: true, data: listing })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },
}
