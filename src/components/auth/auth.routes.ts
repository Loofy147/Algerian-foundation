import { Router } from 'express';
import * as authController from './auth.controller';
import { prisma } from '../../config/prisma';

const router = Router();

router.post('/register', authController.register(prisma));
router.post('/login', authController.login(prisma));

export default router;
