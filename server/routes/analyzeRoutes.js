import express from 'express';
import { handleAnalyze } from '../controllers/analyzeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', requireAuth, handleAnalyze);
export default router;
