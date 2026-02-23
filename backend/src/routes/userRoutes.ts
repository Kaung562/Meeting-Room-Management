import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.get('/me', asyncHandler(userController.getMe));
router.get('/', requireRole('admin'), asyncHandler(userController.getUsers));
router.post('/', requireRole('admin'), asyncHandler(userController.createUser));
router.patch('/:id/role', requireRole('admin'), asyncHandler(userController.updateUserRole));
router.delete('/:id', requireRole('admin'), asyncHandler(userController.deleteUser));

export default router;
