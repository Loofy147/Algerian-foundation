import { Request, Response } from 'express';
import { getUserById } from '../users.controller';
import { PrismaClient } from '@prisma/client';

const prisma = {
  user: {
    findUnique: jest.fn(),
  },
} as unknown as PrismaClient;

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { id: '1' },
    };
    (req as any).userId = '1';
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return a user if the requesting user is the same as the requested user', async () => {
      const user = { id: 1, email: 'test@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      await getUserById(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return a 403 error if the requesting user is not the same as the requested user', async () => {
      (req as any).userId = '2';
      await getUserById(prisma)(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
