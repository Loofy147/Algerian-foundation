import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export const getUserById = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUserId = (req as any).userId; // from authenticate middleware

    // Basic authorization: ensure the authenticated user is the one they are requesting
    if (parseInt(requestingUserId, 10) !== parseInt(id, 10)) {
      // Note: In a real-world scenario, you might have admin roles that can bypass this check.
      return res.status(403).json({ error: "Forbidden: You can only access your own user data." });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the user' });
  }
};
