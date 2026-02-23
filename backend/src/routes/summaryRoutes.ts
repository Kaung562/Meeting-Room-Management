import { Router } from 'express';
import * as summaryController from '../controllers/summaryController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.get('/', authMiddleware, requireRole('owner', 'admin'), asyncHandler(summaryController.getSummary));

export default router;
