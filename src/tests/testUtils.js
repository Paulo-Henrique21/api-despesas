import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const createTestUser = async (userData = {}) => {
  const defaultUserData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  const mergedData = { ...defaultUserData, ...userData };
  const hashedPassword = await bcrypt.hash(mergedData.password, 10);

  return await User.create({
    ...mergedData,
    password: hashedPassword
  });
};

export const generateTestUserId = () => {
  return new mongoose.Types.ObjectId();
};

export const generateAuthToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret');
};

export const createAuthCookie = (user) => {
  const token = generateAuthToken({
    userId: user._id,
    email: user.email
  });
  return `token=${token}; Path=/; HttpOnly`;
};

export const mockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    cookies: {},
    headers: {},
    user: null,
    ...overrides
  };
};

export const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

export const expectValidationError = (response, field) => {
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith(
    expect.objectContaining({
      message: expect.stringContaining(field)
    })
  );
};
