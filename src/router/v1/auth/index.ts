import { Router } from 'express';
import controller from '@src/controllers/v1/auth'
import validator from '@src/validators/auth'

const router = Router();

router.post('/login', validator.login, controller.login)

router.post('/register', validator.register, controller.register)
router.post('/verify', validator.verify, controller.verify)
router.post('/join', validator.join, controller.join)

router.get('/verify', validator.serverVerify, controller.serverVerify)
export default router;
