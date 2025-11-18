import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export const authorize = (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};
