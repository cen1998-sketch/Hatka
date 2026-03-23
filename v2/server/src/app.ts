import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import listingsRoutes from './routes/listings.routes.js';
import locationsRoutes from './routes/locations.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import referralRoutes from './routes/referral.routes.js';
import profileRoutes from './routes/profile.routes.js';
import moderationRoutes from './routes/moderation.routes.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API эндпоинты
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/moderation', moderationRoutes);

// Legacy Aliases for frontend compatibility
app.use('/api/properties', listingsRoutes);
app.use('/api/property', listingsRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/cities', (req, res, next) => {
  req.url = '/cities';
  locationsRoutes(req, res, next);
});
app.use('/api/bookings', bookingsRoutes);
app.use('/api/referral', referralRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
