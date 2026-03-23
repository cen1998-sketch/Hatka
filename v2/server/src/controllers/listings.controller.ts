import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { z } from 'zod'
import { ImageService } from '../services/image.service.js'
import { searchSchema, createListingSchema, updateListingSchema, publishListingSchema, stepSchemas, roomSchema } from '../schemas/listing.schema.js'

export const listingsController = {
  search: async (req: Request, res: Response) => {
    try {
      const validation = searchSchema.safeParse(req.query)
      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error.flatten() })
      }

      const { city, type, minPrice, maxPrice, amenities, page, limit } = validation.data
      const skip = (page - 1) * limit

      const where: any = {
        status: 'APPROVED',
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
        ...(type && { type }),
        ...(minPrice && { pricePerDay: { gte: minPrice } }),
        ...(maxPrice && { pricePerDay: { lte: maxPrice } }),
      }

      // Фильтрация по удобствам (amenities в JSON)
      if (amenities) {
        const amenityList = amenities.split(',').map(a => a.trim())
        where.amenities = {
          path: ['items'],
          array_contains: amenityList
        }
      }

      const [listings, total] = await prisma.$transaction([
        (prisma.listing as any).findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            photos: { take: 1, orderBy: { order: 'asc' } },
            host: { select: { id: true, firstName: true, avatarUrl: true } },
          } as any,
        }),
        prisma.listing.count({ where }),
      ])

      res.json({
        success: true,
        data: {
          listings,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, error: 'ID is required' });

      const listing = await (prisma.listing as any).findUnique({
        where: { id: String(id) },
        include: {
          photos: { orderBy: { order: 'asc' } },
          host: { select: { id: true, firstName: true, avatarUrl: true, bio: true } },
        } as any,
      })

      if (!listing) {
        return res.status(404).json({ success: false, error: 'Объявление не найдено' })
      }

      res.json({ success: true, data: listing })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  create: async (req: any, res: Response) => {
    try {
      console.log('[Listings] Creating listing, body:', JSON.stringify(req.body, null, 2));
      const validation = createListingSchema.safeParse(req.body)
      if (!validation.success) {
        console.warn('[Listings] Validation failed:', validation.error.flatten());
        return res.status(400).json({ success: false, error: validation.error.flatten() })
      }

      console.log('[Listings] Validation success, data:', JSON.stringify(validation.data, null, 2));

      const listing = await prisma.listing.create({
        data: {
          type: validation.data.type,
          title: validation.data.title ?? null,
          description: validation.data.description ?? null,
          city: validation.data.city ?? null,
          streetName: validation.data.streetName ?? null,
          houseNumber: validation.data.houseNumber ?? null,
          pricePerDay: validation.data.pricePerDay ?? null,
          amenities: (validation.data.amenities || []) as any,
          details: (validation.data.details || {}) as any,
          hostId: String(req?.user?.id),
          status: 'DRAFT',
          stepsCompleted: validation.data.stepsCompleted || 0,
        },
      })

      console.log('[Listings] Created successfully, ID:', listing.id);
      res.status(201).json({ success: true, data: listing })
    } catch (error: any) {
      console.error('[Listings] Create error:', error);
      res.status(500).json({ success: false, error: error.message })
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const listings = await (prisma.listing as any).findMany({
        where: { status: 'APPROVED' },
        include: {
          photos: { take: 1, orderBy: { order: 'asc' } },
          host: { select: { id: true, firstName: true, avatarUrl: true } },
        } as any,
        orderBy: { createdAt: 'desc' },
      })
      res.json({ success: true, data: listings })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  getMyListings: async (req: any, res: Response) => {
    try {
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

      const listings = await (prisma.listing as any).findMany({
        where: { hostId: userId },
        include: {
          photos: { take: 1, orderBy: { order: 'asc' } },
          rooms: true,
        } as any,
        orderBy: { updatedAt: 'desc' },
      })
      res.json({ success: true, data: listings })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  update: async (req: any, res: Response) => {
    try {
      const { id } = req.params
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

      const validation = updateListingSchema.safeParse(req.body)
      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error.flatten() })
      }

      // Проверяем принадлежность
      const existing = await prisma.listing.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Not found' })
      if (existing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' })

      const updateData: any = {}
      if (validation.data.type !== undefined) updateData.type = validation.data.type
      if (validation.data.title !== undefined) updateData.title = validation.data.title
      if (validation.data.description !== undefined) updateData.description = validation.data.description
      if (validation.data.city !== undefined) updateData.city = validation.data.city
      if (validation.data.streetName !== undefined) updateData.streetName = validation.data.streetName
      if (validation.data.houseNumber !== undefined) updateData.houseNumber = validation.data.houseNumber
      if (validation.data.pricePerDay !== undefined) updateData.pricePerDay = validation.data.pricePerDay
      if (validation.data.amenities !== undefined) updateData.amenities = validation.data.amenities as any
      if (validation.data.details !== undefined) updateData.details = validation.data.details as any
      if (validation.data.stepsCompleted !== undefined) updateData.stepsCompleted = validation.data.stepsCompleted

      const listing = await prisma.listing.update({
        where: { id },
        data: updateData,
      })

      res.json({ success: true, data: listing })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  updateStep: async (req: any, res: Response) => {
    try {
      const { id, stepNumber } = req.params
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

      const step = parseInt(stepNumber)
      const schema = stepSchemas[step]
      
      let updateData = req.body
      if (schema) {
        const validation = schema.safeParse(req.body)
        if (!validation.success) {
          console.warn(`[Listings] Step ${step} validation failed:`, JSON.stringify(validation.error.flatten(), null, 2));
          return res.status(400).json({ success: false, error: validation.error.flatten() })
        }
        updateData = validation.data
      }

      // Проверяем принадлежность
      const existing = await prisma.listing.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Not found' })
      if (existing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' })

      // Обработка вложенных полей в details
      if (updateData.details && existing.details) {
        updateData.details = {
          ...(existing.details as object),
          ...updateData.details
        }
      }

      const listing = await prisma.listing.update({
        where: { id },
        data: {
          ...updateData,
          stepsCompleted: Math.max(existing.stepsCompleted, step)
        },
      })

      res.json({ success: true, data: listing })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  // Rooms Management
  getRooms: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const rooms = await prisma.room.findMany({
        where: { listingId: id } as any,
        orderBy: { createdAt: 'asc' }
      })
      res.json({ success: true, data: rooms })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  addRoom: async (req: any, res: Response) => {
    try {
      const id = String(req.params.id)
      const userId = req.user?.id

      const validation = roomSchema.safeParse(req.body)
      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error.flatten() })
      }

      const listing = await prisma.listing.findUnique({ where: { id } })
      if (!listing) return res.status(404).json({ success: false, error: 'Listing not found' })
      if (listing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' })

      const room = await prisma.room.create({
        data: {
          listingId: id,
          type: validation.data.type,
          title: validation.data.title ?? null,
          pricePerDay: validation.data.pricePerDay,
          priceLongTerm: validation.data.priceLongTerm ?? null,
          area: validation.data.area,
          capacityAdults: validation.data.capacityAdults,
          capacityChildren: validation.data.capacityChildren,
          instantBooking: validation.data.instantBooking,
          quantity: validation.data.quantity,
          beds: (validation.data.beds || []) as any,
          amenities: (validation.data.amenities || []) as any,
        }
      })

      res.status(201).json({ success: true, data: room })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  updateRoom: async (req: any, res: Response) => {
    try {
      const { roomId } = req.params
      const userId = req.user?.id

      const validation = roomSchema.partial().safeParse(req.body)
      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error.flatten() })
      }

      const room = await prisma.room.findUnique({ 
        where: { id: roomId },
        include: { listing: true }
      })
      if (!room) return res.status(404).json({ success: false, error: 'Room not found' })
      if (room.listing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' })

      const updateData: any = {
        ...(validation.data.type !== undefined && { type: validation.data.type }),
        ...(validation.data.title !== undefined && { title: validation.data.title ?? null }),
        ...(validation.data.pricePerDay !== undefined && { pricePerDay: validation.data.pricePerDay }),
        ...(validation.data.priceLongTerm !== undefined && { priceLongTerm: validation.data.priceLongTerm ?? null }),
        ...(validation.data.area !== undefined && { area: validation.data.area }),
        ...(validation.data.capacityAdults !== undefined && { capacityAdults: validation.data.capacityAdults }),
        ...(validation.data.capacityChildren !== undefined && { capacityChildren: validation.data.capacityChildren }),
        ...(validation.data.instantBooking !== undefined && { instantBooking: validation.data.instantBooking }),
        ...(validation.data.quantity !== undefined && { quantity: validation.data.quantity }),
        ...(validation.data.beds !== undefined && { beds: validation.data.beds as any }),
        ...(validation.data.amenities !== undefined && { amenities: validation.data.amenities as any }),
      }

      const updated = await prisma.room.update({
        where: { id: roomId },
        data: updateData
      })

      res.json({ success: true, data: updated })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  deleteRoom: async (req: any, res: Response) => {
    try {
      const { roomId } = req.params
      const userId = req.user?.id

      const room = await prisma.room.findUnique({ 
        where: { id: roomId },
        include: { listing: true }
      })
      if (!room) return res.status(404).json({ success: false, error: 'Room not found' })
      if (room.listing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' })

      await prisma.room.delete({ where: { id: roomId } })
      res.json({ success: true, message: 'Room deleted' })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  delete: async (req: any, res: Response) => {
    try {
      const { id } = req.params
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

      const existing = await prisma.listing.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Not found' })
      if (existing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' })

      await prisma.listing.delete({ where: { id } })
      res.json({ success: true, message: 'Deleted successfully' })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  publish: async (req: any, res: Response) => {
    try {
      const { id } = req.params
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

      const existing = await prisma.listing.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Not found' })
      if (existing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' })

      const validation = publishListingSchema.safeParse(existing)
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: 'Пожалуйста, заполните все обязательные поля перед публикацией',
          details: validation.error.flatten() 
        })
      }

      const listing = await prisma.listing.update({
        where: { id },
        data: { status: 'PENDING' },
      })

      res.json({ success: true, data: listing })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  uploadPhoto: async (req: any, res: Response) => {
    try {
      const { id } = req.params
      const userId = req.user?.id
      const file = req.file

      if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' })
      }

      const listing = await prisma.listing.findUnique({ where: { id } })
      if (!listing) return res.status(404).json({ success: false, error: 'Listing not found' })
      if (listing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' })

      // Validate and process image
      const isValid = await ImageService.validateImage(file.buffer);
      if (!isValid) {
        return res.status(400).json({ success: false, error: 'Неверный формат файла или поддельное расширение' });
      }

      const processed = await ImageService.processImage(file.buffer, file.originalname);

      const maxOrder = await prisma.listingPhoto.aggregate({
        where: { listingId: id },
        _max: { order: true }
      })

      const photo = await prisma.listingPhoto.create({
        data: {
          listingId: id,
          url: processed.url,
          thumbnailUrl: processed.thumbnail,
          order: (maxOrder._max.order ?? -1) + 1
        }
      })

      res.status(201).json({ success: true, data: photo })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  deletePhoto: async (req: any, res: Response) => {
    try {
      const { id, photoId } = req.params;
      const userId = req.user?.id;

      const photo = await prisma.listingPhoto.findUnique({
        where: { id: photoId },
        include: { listing: true }
      });

      if (!photo) return res.status(404).json({ success: false, error: 'Photo not found' });
      if (photo.listing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' });

      await ImageService.deleteImage(photo.url);
      await prisma.listingPhoto.delete({ where: { id: photoId } });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  reorderPhotos: async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const { photos } = req.body; // Array of { id, order }
      const userId = req.user?.id;

      const listing = await prisma.listing.findUnique({ where: { id } });
      if (!listing) return res.status(404).json({ success: false, error: 'Not found' });
      if (listing.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' });

      await prisma.$transaction(
        photos.map((p: any) => 
          prisma.listingPhoto.update({
            where: { id: p.id },
            data: { order: p.order }
          })
        )
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  uploadRoomPhoto: async (req: any, res: Response) => {
    try {
      const { id, roomId } = req.params
      const userId = req.user?.id
      const file = req.file

      if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' })
      }

      const room = await prisma.room.findUnique({ where: { id: roomId } })
      if (!room) return res.status(404).json({ success: false, error: 'Room not found' })
      
      const listing = await prisma.listing.findUnique({ where: { id } })
      if (listing?.hostId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' })

      // Validate and process image
      const isValid = await ImageService.validateImage(file.buffer);
      if (!isValid) {
        return res.status(400).json({ success: false, error: 'Неверный формат файла' });
      }

      const processed = await ImageService.processImage(file.buffer, file.originalname);

      // Current photos
      const currentPhotos = ((room as any).photos as any[]) || [];
      const newPhoto = {
        id: Date.now().toString(),
        url: processed.url,
        thumbnail: processed.thumbnail,
        order: currentPhotos.length
      };

      const updatedPhotos = [...currentPhotos, newPhoto];

      const updatedRoom = await (prisma.room as any).update({
        where: { id: roomId },
        data: { photos: updatedPhotos }
      });

      res.status(201).json({ success: true, data: newPhoto });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  reorderRoomPhotos: async (req: any, res: Response) => {
    try {
      const { id, roomId } = req.params;
      const { photos } = req.body; // Expect array of photos with updated orders

      const room = await (prisma.room as any).findUnique({ where: { id: roomId } });
      if (!room) return res.status(404).json({ success: false, error: 'Room not found' });

      await (prisma.room as any).update({
        where: { id: roomId },
        data: { photos }
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteRoomPhoto: async (req: any, res: Response) => {
    try {
      const { id, roomId, photoId } = req.params;
      const room = await (prisma.room as any).findUnique({ where: { id: roomId } });
      if (!room) return res.status(404).json({ success: false, error: 'Room not found' });

      const currentPhotos = (room.photos as any[]) || [];
      const photoToDelete = currentPhotos.find(p => p.id === photoId);
      
      if (photoToDelete) {
        await ImageService.deleteImage(photoToDelete.url);
      }

      const updatedPhotos = currentPhotos.filter(p => p.id !== photoId);

      await (prisma.room as any).update({
        where: { id: roomId },
        data: { photos: updatedPhotos }
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
}
