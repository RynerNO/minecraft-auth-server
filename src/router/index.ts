import { Router } from 'express';

import authRoutes from './v1/auth';
import minecraftRoutes from './v1/minecraft';
import cors from 'cors'

const router = Router();
router.use(cors({
    origin: "*"
}))

router.use('/v1/auth', authRoutes);
router.use('/v1/minecraft', minecraftRoutes);
export default router;