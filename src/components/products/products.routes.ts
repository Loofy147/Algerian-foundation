import { Router } from 'express';
import * as productController from './products.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { Role }from '@prisma/client';

const router = Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Vendor-only routes
router.post('/', authenticate, authorize([Role.VENDOR]), productController.createProduct);
router.put('/:id', authenticate, authorize([Role.VENDOR]), productController.updateProduct);
router.delete('/:id', authenticate, authorize([Role.VENDOR]), productController.deleteProduct);

export default router;
