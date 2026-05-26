import { Router } from 'express';
import { getAllOffers } from '../controllers/offersController';

const router = Router();

router.get('/', getAllOffers);

export default router;
