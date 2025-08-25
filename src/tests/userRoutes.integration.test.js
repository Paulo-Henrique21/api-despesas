import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Configurar app de teste
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);

describe('User Routes Integration', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user and return user data', async () => {
      const userData = {
        name: 'Integration Test User',
        email: 'integration@example.com',
        password: 'password123',
        registerPassword: process.env.REGISTER_PASSWORD || 'admin123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      
      // Verificar se o usuário foi realmente criado no banco
      const createdUser = await User.findOne({ email: userData.email });
      expect(createdUser).toBeTruthy();
    });
  });

  describe('POST /api/users/login', () => {
    let testUser;

    beforeEach(async () => {
      // Criar usuário para teste de login
      const hashedPassword = await bcrypt.hash('password123', 10);
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });
    });

    it('should login successfully and set cookie', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login realizado com sucesso');
      expect(response.body.user.email).toBe(loginData.email);
      
      // Verificar se o cookie foi definido
      expect(response.headers['set-cookie']).toBeDefined();
      const cookieHeader = response.headers['set-cookie'][0];
      expect(cookieHeader).toMatch(/token=/);
    });

    it('should fail login with wrong password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Senha incorreta');
    });
  });

  describe('GET /api/users/profile', () => {
    let testUser, authCookie;

    beforeEach(async () => {
      // Criar usuário e fazer login para obter cookie de autenticação
      const hashedPassword = await bcrypt.hash('password123', 10);
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });

      // Fazer login para obter cookie
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      authCookie = loginResponse.headers['set-cookie'][0];
    });

    it('should return user data when authenticated', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.name).toBe('Test User');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.message).toBe('Token não encontrado');
    });
  });
});
