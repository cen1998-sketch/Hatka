import { Router } from 'express'
import { bookingsController } from '../controllers/bookings.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/owner', authMiddleware, bookingsController.getOwnerBookings)

export default router
