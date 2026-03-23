import { Router } from 'express'
import { listingsController } from '../controllers/listings.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.get('/', listingsController.getAll)
router.get('/search', listingsController.search)
router.get('/my', authMiddleware, listingsController.getMyListings)
router.get('/:id', listingsController.getById)
router.post('/', authMiddleware, listingsController.create)
router.patch('/:id', authMiddleware, listingsController.update)
router.patch('/:id/step/:stepNumber', authMiddleware, listingsController.updateStep)
router.delete('/:id', authMiddleware, listingsController.delete)
router.post('/:id/publish', authMiddleware, listingsController.publish)
router.post('/:id/photos', authMiddleware, upload.single('photo'), listingsController.uploadPhoto)
router.patch('/:id/photos/reorder', authMiddleware, listingsController.reorderPhotos)
router.delete('/:id/photos/:photoId', authMiddleware, listingsController.deletePhoto)

// Rooms
router.get('/:id/rooms', listingsController.getRooms)
router.post('/:id/rooms', authMiddleware, listingsController.addRoom)
router.patch('/rooms/:roomId', authMiddleware, listingsController.updateRoom)
router.post('/:id/rooms/:roomId/photos', authMiddleware, upload.single('photo'), listingsController.uploadRoomPhoto)
router.patch('/:id/rooms/:roomId/photos/reorder', authMiddleware, listingsController.reorderRoomPhotos)
router.delete('/:id/rooms/:roomId/photos/:photoId', authMiddleware, listingsController.deleteRoomPhoto)
router.delete('/rooms/:roomId', authMiddleware, listingsController.deleteRoom)

export default router
