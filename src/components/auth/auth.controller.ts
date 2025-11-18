import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

// Helper to check if the error is a Prisma unique constraint violation
function isPrismaP2002Error(error: unknown): error is { code: 'P2002' } {
  return typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2002';
}

export const register = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    if (isPrismaP2002Error(error)) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    res.status(500).json({ error: 'An error occurred during registration' });
  }
};

export const login = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ message: 'User logged in successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login' });
  }
};
