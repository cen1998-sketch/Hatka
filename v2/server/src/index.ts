import app from './app.js';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

// Запуск
app.listen(PORT, () => {
  console.log(`[Server] Hatka API started on http://localhost:${PORT}`);
});

// Обработка необработанных ошибок
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
