import { Router } from 'express'
import { moderationController } from '../controllers/moderation.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// Only moderators and admins should access these (though we haven't implemented role check yet, 
// let's at least use authMiddleware)
router.get('/pending', authMiddleware, moderationController.getPending)
router.get('/published', authMiddleware, moderationController.getPublished)
router.patch('/approve/:id', authMiddleware, moderationController.approve)
router.patch('/reject/:id', authMiddleware, moderationController.reject)

export default router
