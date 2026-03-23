import { Router } from 'express'
import { profileController } from '../controllers/profile.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', authMiddleware, profileController.getProfile)
router.patch('/', authMiddleware, profileController.updateProfile)
router.get('/subscription', authMiddleware, profileController.getSubscription)

export default router
