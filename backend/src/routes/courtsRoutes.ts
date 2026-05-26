import { Router } from 'express';
import { getAllCourts, getCourtById } from '../controllers/courtsController';

const router = Router();

router.get('/', getAllCourts);
router.get('/:id', getCourtById);

export default router;
