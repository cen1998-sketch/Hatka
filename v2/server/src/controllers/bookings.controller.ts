import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

export const bookingsController = {
  getOwnerBookings: async (req: any, res: Response) => {
    try {
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

      // В нашей схеме Booking связан с Property, а не с Listing пока что.
      // Но фронтенд может ожидать данные. Возвращаем пока пустой массив или ищем по Property.
      const bookings = await prisma.booking.findMany({
        where: {
          property: {
            ownerId: userId
          }
        },
        include: {
          property: true,
          user: {
            select: { id: true, firstName: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      res.json({ success: true, data: bookings })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
