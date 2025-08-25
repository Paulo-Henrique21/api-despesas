import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middlewares/authMiddleware.js';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
      user: null
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };
    next = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token successfully', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'test-secret');
      
      req.cookies.token = token;

      authenticateToken(req, res, next);

      expect(req.user).toMatchObject(payload);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', () => {
      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token não encontrado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
      req.cookies.token = 'invalid-token';

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token inválido ou expirado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is expired', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const expiredToken = jwt.sign(
        payload, 
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' } // Token expirado
      );
      
      req.cookies.token = expiredToken;

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token inválido ou expirado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token has wrong secret', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const tokenWithWrongSecret = jwt.sign(payload, 'wrong-secret');
      
      req.cookies.token = tokenWithWrongSecret;

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token inválido ou expirado'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
