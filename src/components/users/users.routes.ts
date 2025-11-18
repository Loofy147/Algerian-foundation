import { Router } from 'express';
import * as userController from './users.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

router.get('/:id', authenticate, userController.getUserById);

export default router;
