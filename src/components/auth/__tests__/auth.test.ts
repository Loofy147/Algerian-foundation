import { Request, Response } from 'express';
import { register, login } from '../auth.controller';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const prisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
} as unknown as PrismaClient;

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });
      (jwt.sign as jest.Mock).mockReturnValue('testToken');

      await register(prisma)(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully', token: 'testToken' });
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('testToken');

      await login(prisma)(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User logged in successfully', token: 'testToken' });
    });
  });
});
