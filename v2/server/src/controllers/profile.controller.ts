import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

export const profileController = {
  getProfile: async (req: any, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          city: true,
          avatarUrl: true,
          bio: true,
          role: true,
        }
      })
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })
      res.json({ success: true, data: user })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  updateProfile: async (req: any, res: Response) => {
    try {
      const { firstName, lastName, phone, city, bio } = req.body
      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          firstName,
          lastName,
          phone,
          city,
          bio,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          city: true,
          avatarUrl: true,
          bio: true,
          role: true,
        }
      })
      res.json({ success: true, data: user })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  getSubscription: async (req: any, res: Response) => {
    try {
      const sub = await prisma.subscription.findUnique({
        where: { userId: req.user.id }
      })

      if (!sub) {
        return res.json({
          success: true,
          data: {
            daysRemaining: 0,
            expiresAt: null,
            status: 'INACTIVE'
          }
        })
      }

      // Расчет дней на лету (On-the-fly)
      let daysRemaining = 0
      if (sub.expiresAt) {
        const now = new Date()
        const diff = sub.expiresAt.getTime() - now.getTime()
        daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
      }

      res.json({
        success: true,
        data: {
          daysRemaining,
          expiresAt: sub.expiresAt,
          status: daysRemaining > 0 ? 'ACTIVE' : 'EXPIRED'
        }
      })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
