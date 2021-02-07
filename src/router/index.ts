import { Router } from 'express';

import authRoutes from './v1/auth';
import cors from 'cors'

const router = Router();
router.use(cors({
    origin: "*"
}))

router.use('/v1/auth', authRoutes);
export default router;