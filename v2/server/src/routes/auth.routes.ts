import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.get('/verify', authController.verify)
router.get('/me', authMiddleware, authController.me)

export default router
