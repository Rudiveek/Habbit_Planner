import express from 'express';
import {
  getAnalyticsSummary,
  getWeeklyTrend,
  getYearlyHeatmap,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getAnalyticsSummary);
router.get('/weekly', getWeeklyTrend);
router.get('/heatmap', getYearlyHeatmap);

export default router;
