import express from 'express';
import {
  getHabits,
  createHabit,
  getHabitById,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  getDailyProgress,
} from '../controllers/habitController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All habit routes require authentication
router.use(protect);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.get('/daily-progress', getDailyProgress);

router.route('/:id')
  .get(getHabitById)
  .put(updateHabit)
  .delete(deleteHabit);

router.post('/:id/toggle', toggleHabitCompletion);

export default router;
