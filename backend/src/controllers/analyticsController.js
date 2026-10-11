import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import { formatDateStr, isDayScheduled } from '../services/streakService.js';
import { isDBConnected } from '../config/db.js';
import devMemoryStore from '../services/devMemoryStore.js';

/**
 * @desc    Get aggregated analytics summary
 * @route   GET /api/analytics/summary
 * @access  Private
 */
export const getAnalyticsSummary = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const summary = devMemoryStore.getAnalyticsSummary(req.user._id);
      return res.status(200).json({
        success: true,
        summary,
      });
    }

    const habits = await Habit.find({ userId: req.user._id, archived: false });
    const habitIds = habits.map(h => h._id);

    const totalCompletionsCount = await HabitCompletion.countDocuments({
      userId: req.user._id,
      habitId: { $in: habitIds },
      completed: true,
    });

    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;
    habits.forEach(h => {
      if ((h.currentStreak || 0) > maxCurrentStreak) maxCurrentStreak = h.currentStreak || 0;
      if ((h.longestStreak || 0) > maxLongestStreak) maxLongestStreak = h.longestStreak || 0;
    });

    const todayStr = formatDateStr(new Date());
    const todayDate = new Date();
    const scheduledToday = habits.filter(h => isDayScheduled(todayDate, h.scheduledDays));
    const completedTodayCount = await HabitCompletion.countDocuments({
      userId: req.user._id,
      habitId: { $in: scheduledToday.map(h => h._id) },
      completionDate: todayStr,
      completed: true,
    });

    const todayCompletionRate = scheduledToday.length > 0 
      ? Math.round((completedTodayCount / scheduledToday.length) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      summary: {
        totalHabits: habits.length,
        totalCompletions: totalCompletionsCount,
        maxCurrentStreak,
        maxLongestStreak,
        scheduledTodayCount: scheduledToday.length,
        completedTodayCount,
        todayCompletionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get 7-day weekly completion trend
 * @route   GET /api/analytics/weekly
 * @access  Private
 */
export const getWeeklyTrend = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const trend = devMemoryStore.getWeeklyTrend(req.user._id);
      return res.status(200).json({
        success: true,
        data: trend,
      });
    }

    const habits = await Habit.find({ userId: req.user._id, archived: false });
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trend = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDateStr(d);
      const dayName = daysOfWeek[d.getDay()];

      const scheduledOnDay = habits.filter(h => isDayScheduled(d, h.scheduledDays));
      const scheduledIds = scheduledOnDay.map(h => h._id);

      const completedCount = await HabitCompletion.countDocuments({
        userId: req.user._id,
        habitId: { $in: scheduledIds },
        completionDate: dateStr,
        completed: true,
      });

      const totalScheduled = scheduledOnDay.length;
      const rate = totalScheduled > 0 ? Math.round((completedCount / totalScheduled) * 100) : 0;

      trend.push({
        date: dateStr,
        day: dayName,
        completed: completedCount,
        scheduled: totalScheduled,
        rate,
      });
    }

    res.status(200).json({
      success: true,
      data: trend,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get yearly heatmap activity counts
 * @route   GET /api/analytics/heatmap
 * @access  Private
 */
export const getYearlyHeatmap = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const map = devMemoryStore.getYearlyHeatmap(req.user._id);
      return res.status(200).json({
        success: true,
        data: map,
      });
    }

    const completions = await HabitCompletion.aggregate([
      {
        $match: {
          userId: req.user._id,
          completed: true,
        },
      },
      {
        $group: {
          _id: '$completionDate',
          count: { $sum: 1 },
        },
      },
    ]);

    const heatmapMap = {};
    completions.forEach(item => {
      heatmapMap[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: heatmapMap,
    });
  } catch (error) {
    next(error);
  }
};
