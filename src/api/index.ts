import { Router } from 'express';
import authRoutes from '../components/auth/auth.routes';
import userRoutes from '../components/users/users.routes';
import productRoutes from '../components/products/products.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);

export default router;
