import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export const validate = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Невалидные данные',
          details: result.error.flatten(),
        },
      })
    }
    req.body = result.data
    next()
  }
