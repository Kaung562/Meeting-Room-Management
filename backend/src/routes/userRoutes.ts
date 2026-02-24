import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.get('/me', asyncHandler(userController.getMe));
router.get('/', requireRole('ADMIN'), asyncHandler(userController.getUsers));
router.post('/', requireRole('ADMIN'), asyncHandler(userController.createUser));
router.patch('/:id/role', requireRole('ADMIN'), asyncHandler(userController.updateUserRole));
router.delete('/:id', requireRole('ADMIN'), asyncHandler(userController.deleteUser));

export default router;
