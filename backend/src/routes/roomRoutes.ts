import { Router } from 'express';
import * as roomController from '../controllers/roomController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(roomController.getRooms));

export default router;
