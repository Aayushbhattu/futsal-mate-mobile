import { Router } from 'express';
import { getAllFavorites, addFavorite, removeFavorite } from '../controllers/favoritesController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getAllFavorites);
router.post('/', authMiddleware, addFavorite);
router.delete('/:court_id', authMiddleware, removeFavorite);

export default router;
