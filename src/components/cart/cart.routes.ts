import { Router } from 'express';
import * as cartController from './cart.controller';
import { authenticate } from '../../middleware/authenticate';
import { prisma } from '../../config/prisma';

const router = Router();

router.use(authenticate); // All cart routes require authentication

router.get('/', cartController.getCart(prisma));
router.post('/items', cartController.addCartItem(prisma));
router.put('/items/:id', cartController.updateCartItem(prisma));
router.delete('/items/:id', cartController.removeCartItem(prisma));

export default router;
