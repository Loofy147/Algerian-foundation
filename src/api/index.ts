import { Router } from 'express';
import authRoutes from '../components/auth/auth.routes';
import userRoutes from '../components/users/users.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
