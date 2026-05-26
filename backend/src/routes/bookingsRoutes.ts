import { Router } from 'express';
import { getAllBookings, createBooking, cancelBooking } from '../controllers/bookingsController';
import { authMiddleware } from '../middleware/errorHandler';

const router = Router();

router.get('/', authMiddleware, getAllBookings);
router.post('/', authMiddleware, createBooking);
router.delete('/:id', authMiddleware, cancelBooking);

export default router;
