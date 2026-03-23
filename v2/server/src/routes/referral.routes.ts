import { Router } from 'express'
import { referralController } from '../controllers/referral.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/stats', authMiddleware, referralController.getStats)
router.post('/activate', authMiddleware, referralController.activate)

export default router
