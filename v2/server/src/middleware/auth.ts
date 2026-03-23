import type { Request, Response, NextFunction } from 'express';
import type { TokenPayload } from '../lib/jwt.js';
import { verifyAccessToken } from '../lib/jwt.js';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'UNAUTHORIZED', message: 'Token not provided' } 
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'UNAUTHORIZED', message: 'Invalid token format' } 
    });
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } 
    });
  }

  req.user = decoded;
  next();
};
