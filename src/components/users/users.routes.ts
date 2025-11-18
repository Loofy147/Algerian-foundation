import { Router } from 'express';
import * as userController from './users.controller';
import { authenticate } from '../../middleware/authenticate';
import { prisma } from '../../config/prisma';

const router = Router();

router.get('/:id', authenticate, userController.getUserById(prisma));

export default router;
