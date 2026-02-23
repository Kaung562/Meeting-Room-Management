import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler(bookingController.getBookings));
router.post('/', asyncHandler(bookingController.createBooking));
router.delete('/:id', asyncHandler(bookingController.deleteBooking));

export default router;
