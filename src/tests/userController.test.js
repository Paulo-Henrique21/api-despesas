import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { register, login } from '../controllers/userController.js';

// Configurar app de teste
const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);

describe('User Controller', () => {
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        registerPassword: process.env.REGISTER_PASSWORD || 'admin123'
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', userData.name);
      expect(response.body).toHaveProperty('email', userData.email);
      expect(response.body).not.toHaveProperty('password');

      // Verificar se o usuário foi criado no banco
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });

    it('should return 400 if register password is missing', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Senha de registro é obrigatória');
    });

    it('should return 401 if register password is incorrect', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        registerPassword: 'wrongpassword'
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Senha de registro incorreta');
    });

    it('should return 400 if email already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        registerPassword: process.env.REGISTER_PASSWORD || 'admin123'
      };

      // Criar usuário primeiro
      await User.create({
        name: userData.name,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10)
      });

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Email já cadastrado');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      // Criar um usuário para testes de login
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', loginData.email);
      expect(response.body).toHaveProperty('message', 'Login realizado com sucesso');
    });

    it('should return 404 with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
    });

    it('should return 401 with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Senha incorreta');
    });
  });
});
