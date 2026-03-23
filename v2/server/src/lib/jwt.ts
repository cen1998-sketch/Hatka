import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'hatka-secret-key-2026';
const ACCESS_TOKEN_EXPIRES_IN = '15m';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

export const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};
