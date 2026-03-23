import request from 'supertest';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';

describe('Auth API', () => {
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User'
  };

  afterAll(async () => {
    // Очистка после тестов
    await prisma.user.deleteMany({
      where: { email: testUser.email }
    });
    await prisma.$disconnect();
  });

  it('должен успешно зарегистрировать нового пользователя', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.data.user).toHaveProperty('email', testUser.email);
    expect(res.body.data).toHaveProperty('token');
  });

  it('должен успешно авторизовать пользователя', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('email', testUser.email);
  });

  it('должен возвращать ошибку при неверном пароле', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrong_password'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Неверный email или пароль');
  });
});
