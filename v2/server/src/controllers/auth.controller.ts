import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  hashToken,
  verifyAccessToken
} from '../lib/jwt.js';

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, first_name, last_name, city } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: { code: 'CONFLICT', message: 'Email уже зарегистрирован' },
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName: first_name,
          lastName: last_name,
          city,
          role: 'GUEST',
        },
      });

      const accessToken = generateAccessToken({ 
        id: user.id, 
        email: user.email, 
        role: user.role 
      });
      const refreshToken = generateRefreshToken();
      const tokenHash = hashToken(refreshToken);

      await prisma.session.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
          deviceInfo: req.headers['user-agent'] as string || 'unknown',
          ipAddress: req.ip || 'unknown'
        }
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_MAX_AGE
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (error: any) {
      console.error('[Auth] Register error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: error.message },
      });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;

      let user = await prisma.user.findUnique({ where: { email } });

      // Если пароль передан - стандартный вход
      if (password) {
        if (!user || !user.passwordHash) {
          return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Неверный email или пароль' },
          });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Неверный email или пароль' },
          });
        }
      } else {
        // Если пароля нет - Magic Link flow
        // 1. Если пользователя нет - создаем (авто-регистрация)
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              role: role === 'landlord' ? 'HOST' : 'GUEST',
            }
          });
        }

        // 2. Генерируем временный токен для ссылки
        // Используем стандартный accessToken как временный носитель данных для верификации
        const magicToken = generateAccessToken({ 
          id: user.id, 
          email: user.email, 
          role: user.role 
        });

        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
        // Ссылка ведет на бэкенд для установки кук
        const magicLink = `${process.env.API_URL || 'http://localhost:3001/api'}/auth/verify?token=${magicToken}`;

        return res.json({
          success: true,
          message: 'Magic link generated',
          magicLink
        });
      }

      // Общая часть для входа по паролю (Sessions & Cookies)
      const accessToken = generateAccessToken({ 
        id: user.id, 
        email: user.email, 
        role: user.role 
      });
      const refreshToken = generateRefreshToken();
      const tokenHash = hashToken(refreshToken);

      await prisma.session.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
          deviceInfo: req.headers['user-agent'] as string || 'unknown',
          ipAddress: req.ip || 'unknown'
        }
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_MAX_AGE
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: error.message },
      });
    }
  },

  verify: async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        return res.status(400).send('Invalid token');
      }

      const payload = verifyAccessToken(token);
      if (!payload) {
        return res.status(401).send('Token expired or invalid');
      }

      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) return res.status(404).send('User not found');

      // Создаем реальную сессию
      const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken();
      const tokenHash = hashToken(refreshToken);

      await prisma.session.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
          deviceInfo: req.headers['user-agent'] as string || 'unknown',
          ipAddress: req.ip || 'unknown'
        }
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_MAX_AGE
      });

      const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
      // Редирект на фронтенд с токеном
      res.redirect(`${CLIENT_URL}/auth-callback?token=${accessToken}`);
    } catch (error: any) {
      console.error('[Auth] Verify error:', error);
      res.status(500).send('Server error');
    }
  },

  refresh: async (req: Request, res: Response) => {
    try {
      console.log('[Auth] Refresh triggered. Cookies:', JSON.stringify(req.cookies));
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        console.warn('[Auth] No refresh token found in cookies');
        return res.status(401).json({ success: false, error: 'No refresh token' });
      }

      const tokenHash = hashToken(refreshToken);
      const session = await prisma.session.findUnique({
        where: { tokenHash },
        include: { user: true }
      });

      if (!session || session.expiresAt < new Date()) {
        if (session) await prisma.session.delete({ where: { id: session.id } });
        return res.status(401).json({ success: false, error: 'Invalid or expired session' });
      }

      // Ротация токенов: старую сессию удаляем, новую создаем
      const user = session.user;
      const newAccessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
      const newRefreshToken = generateRefreshToken();
      const newTokenHash = hashToken(newRefreshToken);

      await prisma.$transaction([
        prisma.session.delete({ where: { id: session.id } }),
        prisma.session.create({
          data: {
            userId: user.id,
            tokenHash: newTokenHash,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
            deviceInfo: req.headers['user-agent'] as string || 'unknown',
            ipAddress: req.ip || 'unknown'
          }
        })
      ]);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: REFRESH_TOKEN_MAX_AGE
      });

      res.json({
        success: true,
        data: { 
          accessToken: newAccessToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl
          }
        }
      });
    } catch (error: any) {
      console.error('[Auth] Refresh error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;
      if (refreshToken) {
        const tokenHash = hashToken(refreshToken);
        await prisma.session.deleteMany({ where: { tokenHash } });
      }

      res.clearCookie('refreshToken');
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  me: async (req: any, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          city: true,
          avatarUrl: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Пользователь не найден' },
        });
      }

      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: error.message },
      });
    }
  },
};
