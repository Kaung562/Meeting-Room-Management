import { Router } from 'express';
import * as authController from '../controllers/authController';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.post('/login', asyncHandler(authController.login));

export default router;
