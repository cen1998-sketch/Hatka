import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Невалидный email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Za-z]/, 'Пароль должен содержать буквы')
    .regex(/[0-9]/, 'Пароль должен содержать цифры'),
  password_confirm: z.string(),
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  city: z.string().min(1).max(100).optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: 'Пароли не совпадают',
  path: ['password_confirm'],
})

export const loginSchema = z.object({
  email: z.string().email('Невалидный email'),
  password: z.string().optional(),
})
