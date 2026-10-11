import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import { calculateStreaks, formatDateStr, isDayScheduled } from '../services/streakService.js';
import { isDBConnected } from '../config/db.js';
import devMemoryStore from '../services/devMemoryStore.js';

/**
 * @desc    Get all active habits for authenticated user with completion history & streaks
 * @route   GET /api/habits
 * @access  Private
 */
export const getHabits = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const habits = devMemoryStore.getHabits(req.user._id);
      return res.status(200).json({
        success: true,
        count: habits.length,
        data: habits,
      });
    }

    const habits = await Habit.find({ userId: req.user._id, archived: false }).sort({ createdAt: -1 });
    
    // Fetch all completions for the user
    const habitIds = habits.map(h => h._id);
    const allCompletions = await HabitCompletion.find({
      userId: req.user._id,
      habitId: { $in: habitIds },
      completed: true,
    });

    // Group completions by habitId
    const completionsByHabit = {};
    allCompletions.forEach(c => {
      const hId = c.habitId.toString();
      if (!completionsByHabit[hId]) {
        completionsByHabit[hId] = {};
      }
      completionsByHabit[hId][c.completionDate] = true;
    });

    // Enhance each habit with completion map and verified streaks
    const enhancedHabits = habits.map(habit => {
      const hObj = habit.toObject();
      const completionMap = completionsByHabit[habit._id.toString()] || {};
      const completedDates = Object.keys(completionMap);
      
      const streakData = calculateStreaks(habit, completedDates);
      hObj.currentStreak = streakData.currentStreak;
      hObj.longestStreak = streakData.longestStreak;
      hObj.totalCompleted = streakData.totalCompleted;
      hObj.completions = completionMap;

      return hObj;
    });

    res.status(200).json({
      success: true,
      count: enhancedHabits.length,
      data: enhancedHabits,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new habit
 * @route   POST /api/habits
 * @access  Private
 */
export const createHabit = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      frequency,
      scheduledDays,
      scheduledTime,
      color,
      icon,
    } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Please provide a habit title');
    }

    if (!isDBConnected()) {
      const habit = devMemoryStore.createHabit(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        message: 'Habit created successfully (Dev Mode)',
        data: habit,
      });
    }

    const habit = await Habit.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Productivity',
      frequency: frequency || 'daily',
      scheduledDays: scheduledDays || [0, 1, 2, 3, 4, 5, 6],
      scheduledTime: scheduledTime || '',
      color: color || '#6366f1',
      icon: icon || 'Sparkles',
    });

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: {
        ...habit.toObject(),
        completions: {},
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single habit with history
 * @route   GET /api/habits/:id
 * @access  Private
 */
export const getHabitById = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const habits = devMemoryStore.getHabits(req.user._id);
      const habit = habits.find(h => h._id === req.params.id || h.id === req.params.id);
      if (!habit) {
        res.status(404);
        throw new Error('Habit not found');
      }
      return res.status(200).json({
        success: true,
        data: habit,
      });
    }

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      res.status(404);
      throw new Error('Habit not found');
    }

    const completions = await HabitCompletion.find({
      habitId: habit._id,
      userId: req.user._id,
      completed: true,
    });

    const completionMap = {};
    completions.forEach(c => {
      completionMap[c.completionDate] = true;
    });

    const streakData = calculateStreaks(habit, Object.keys(completionMap));

    res.status(200).json({
      success: true,
      data: {
        ...habit.toObject(),
        completions: completionMap,
        ...streakData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a habit
 * @route   PUT /api/habits/:id
 * @access  Private
 */
export const updateHabit = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const updated = devMemoryStore.updateHabit(req.user._id, req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Habit updated successfully (Dev Mode)',
        data: updated,
      });
    }

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      res.status(404);
      throw new Error('Habit not found');
    }

    const {
      title,
      description,
      category,
      frequency,
      scheduledDays,
      scheduledTime,
      color,
      icon,
      archived,
    } = req.body;

    if (title !== undefined) habit.title = title.trim();
    if (description !== undefined) habit.description = description.trim();
    if (category !== undefined) habit.category = category;
    if (frequency !== undefined) habit.frequency = frequency;
    if (scheduledDays !== undefined) habit.scheduledDays = scheduledDays;
    if (scheduledTime !== undefined) habit.scheduledTime = scheduledTime;
    if (color !== undefined) habit.color = color;
    if (icon !== undefined) habit.icon = icon;
    if (archived !== undefined) habit.archived = archived;

    await habit.save();

    res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a habit & its completion history
 * @route   DELETE /api/habits/:id
 * @access  Private
 */
export const deleteHabit = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      devMemoryStore.deleteHabit(req.user._id, req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Habit and related records removed successfully (Dev Mode)',
        id: req.params.id,
      });
    }

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      res.status(404);
      throw new Error('Habit not found');
    }

    // Cascade delete completion records
    await HabitCompletion.deleteMany({ habitId: habit._id, userId: req.user._id });
    await habit.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Habit and related records removed successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle habit completion status for a date
 * @route   POST /api/habits/:id/toggle
 * @access  Private
 */
export const toggleHabitCompletion = async (req, res, next) => {
  try {
    const dateStr = req.body.date || formatDateStr(new Date());

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      res.status(400);
      throw new Error('Date must be in YYYY-MM-DD format');
    }

    if (!isDBConnected()) {
      const result = devMemoryStore.toggleHabitCompletion(req.user._id, req.params.id, dateStr);
      return res.status(200).json({
        success: true,
        completed: result.completed,
        date: dateStr,
        streakData: result.streakData,
        habit: result.habit,
      });
    }

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      res.status(404);
      throw new Error('Habit not found');
    }

    const existingCompletion = await HabitCompletion.findOne({
      userId: req.user._id,
      habitId: habit._id,
      completionDate: dateStr,
    });

    let isCompletedNow = false;

    if (existingCompletion) {
      // Toggle off: Delete existing record
      await existingCompletion.deleteOne();
      isCompletedNow = false;
    } else {
      // Toggle on: Create record
      await HabitCompletion.create({
        userId: req.user._id,
        habitId: habit._id,
        completionDate: dateStr,
        completed: true,
        completedAt: new Date(),
        notes: req.body.notes || '',
      });
      isCompletedNow = true;
    }

    // Fetch all current completions to update cached streak totals on Habit
    const completions = await HabitCompletion.find({
      userId: req.user._id,
      habitId: habit._id,
      completed: true,
    });
    const completedDates = completions.map(c => c.completionDate);

    const streakData = calculateStreaks(habit, completedDates);
    habit.currentStreak = streakData.currentStreak;
    habit.longestStreak = streakData.longestStreak;
    habit.totalCompleted = streakData.totalCompleted;
    await habit.save();

    res.status(200).json({
      success: true,
      completed: isCompletedNow,
      date: dateStr,
      streakData,
      habit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get daily summary statistics for today (or requested date)
 * @route   GET /api/habits/daily-progress
 * @access  Private
 */
export const getDailyProgress = async (req, res, next) => {
  try {
    const dateStr = req.query.date || formatDateStr(new Date());

    if (!isDBConnected()) {
      const prog = devMemoryStore.getDailyProgress(req.user._id, dateStr);
      return res.status(200).json({
        success: true,
        ...prog,
      });
    }

    const queryDate = new Date(`${dateStr}T00:00:00`);
    const habits = await Habit.find({ userId: req.user._id, archived: false });
    
    // Filter habits scheduled for this day
    const scheduledHabits = habits.filter(h => isDayScheduled(queryDate, h.scheduledDays));
    const scheduledIds = scheduledHabits.map(h => h._id);

    const completions = await HabitCompletion.find({
      userId: req.user._id,
      habitId: { $in: scheduledIds },
      completionDate: dateStr,
      completed: true,
    });

    const totalScheduled = scheduledHabits.length;
    const completedCount = completions.length;
    const completionPercentage = totalScheduled > 0 
      ? Math.round((completedCount / totalScheduled) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      date: dateStr,
      totalScheduled,
      completedCount,
      completionPercentage,
    });
  } catch (error) {
    next(error);
  }
};
