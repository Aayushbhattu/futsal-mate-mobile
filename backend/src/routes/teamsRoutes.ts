import { Router } from 'express';
import { getAllTeams, joinTeam } from '../controllers/teamsController';
import { authMiddleware } from '../middleware/errorHandler';

const router = Router();

router.get('/', getAllTeams);
router.post('/:id/join', authMiddleware, joinTeam);

export default router;
