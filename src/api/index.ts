import { Router } from 'express';
import authRoutes from '../components/auth/auth.routes';
import userRoutes from '../components/users/users.routes';
import productRoutes from '../components/products/products.routes';
import cartRoutes from '../components/cart/cart.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);

export default router;
