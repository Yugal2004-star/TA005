import express from 'express';
import { fetchHistory, fetchOne, removeOne, fetchStats } from '../controllers/historyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(requireAuth);
router.get('/stats', fetchStats);
router.get('/',      fetchHistory);
router.get('/:id',   fetchOne);
router.delete('/:id', removeOne);
export default router;
