import { Router } from 'express'
import { locationsController } from '../controllers/locations.controller.js'

const router = Router()

router.get('/suggest', locationsController.suggest)
router.get('/cities', locationsController.cities)

export default router
