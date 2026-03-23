import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

export const referralController = {
  getStats: async (req: any, res: Response) => {
    try {
      const userId = req.user.id
      const referrals = await (prisma as any).referral.findMany({
        where: { referrerId: userId },
        include: { referredUser: { select: { firstName: true, email: true } } }
      })

      const totalEarned = referrals.reduce((sum: number, r: any) => sum + r.daysEarned, 0)

      res.json({
        success: true,
        data: {
          referrals,
          totalEarned,
          referralCode: userId.split('-')[0],
        }
      })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  activate: async (req: any, res: Response) => {
    try {
      const { code } = req.body
      const referredUserId = req.user.id

      // 1. Ищем реферера (пригласившего) по префиксу ID
      // Для MVP допустим, что код - это первые 8 символов ID
      const users = await prisma.user.findMany({
        where: { id: { startsWith: code } }
      })
      const referrer = users[0]

      if (!referrer) {
        return res.status(404).json({ success: false, error: 'Неверный реферальный код' })
      }

      if (referrer.id === referredUserId) {
        return res.status(400).json({ success: false, error: 'Нельзя использовать собственный код' })
      }

      // 2. Проверяем, не активировал ли этот пользователь уже чей-то код
      const existing = await (prisma as any).referral.findFirst({
        where: { referredUserId }
      })
      if (existing) {
        return res.status(400).json({ success: false, error: 'Вы уже активировали реферальный код' })
      }

      // 3. Создаем реферал и начисляем бонусы
      const DAYS_BONUS = 7

      await prisma.$transaction([
        // Создаем запись о реферале
        (prisma as any).referral.create({
          data: {
            referrerId: referrer.id,
            referredUserId,
            referrerRole: referrer.role,
            status: 'ACTIVATED',
            daysEarned: DAYS_BONUS,
            activatedAt: new Date()
          }
        }),
        // Начисляем дни пригласившему (Subscription)
        prisma.subscription.upsert({
          where: { userId: referrer.id },
          update: { daysRemaining: { increment: DAYS_BONUS } },
          create: { userId: referrer.id, daysRemaining: DAYS_BONUS }
        }),
        // Начисляем дни приглашенному
        prisma.subscription.upsert({
          where: { userId: referredUserId },
          update: { daysRemaining: { increment: DAYS_BONUS } },
          create: { userId: referredUserId, daysRemaining: DAYS_BONUS }
        })
      ])

      res.json({ success: true, message: `Бонус ${DAYS_BONUS} дней начислен обоим участникам!` })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
