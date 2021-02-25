import { Router } from 'express';
import controller from '@src/controllers/v1/minecraft'
import validator from '@src/validators/minecraft'

const router = Router();

router.post('/join', validator.join, controller.join)
router.get('/hasJoined', validator.serverVerify, controller.serverVerify)
router.post('/hasJoined', validator.verify, controller.verify)
export default router;
