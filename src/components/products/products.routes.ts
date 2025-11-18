import { Router } from 'express';
import * as productController from './products.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { Role }from '@prisma/client';
import { prisma } from '../../config/prisma';

const router = Router();

// Public routes
router.get('/', productController.getAllProducts(prisma));
router.get('/:id', productController.getProductById(prisma));

// Vendor-only routes
router.post('/', authenticate, authorize([Role.VENDOR]), productController.createProduct(prisma));
router.put('/:id', authenticate, authorize([Role.VENDOR]), productController.updateProduct(prisma));
router.delete('/:id', authenticate, authorize([Role.VENDOR]), productController.deleteProduct(prisma));

export default router;
