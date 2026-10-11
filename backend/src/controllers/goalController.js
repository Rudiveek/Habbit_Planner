import Goal from '../models/Goal.js';
import { isDBConnected } from '../config/db.js';
import devMemoryStore from '../services/devMemoryStore.js';

/**
 * @desc    Get all goals for authenticated user
 * @route   GET /api/goals
 * @access  Private
 */
export const getGoals = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const goals = devMemoryStore.getGoals(req.user._id);
      return res.status(200).json({
        success: true,
        count: goals.length,
        data: goals,
      });
    }

    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
export const createGoal = async (req, res, next) => {
  try {
    const { title, description, category, targetDate, milestones } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Please provide a goal title');
    }

    if (!isDBConnected()) {
      const goal = devMemoryStore.createGoal(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        message: 'Goal created successfully (Dev Mode)',
        data: goal,
      });
    }

    const goal = await Goal.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Personal Growth',
      targetDate: targetDate || '',
      milestones: milestones || [],
      progress: 0,
      status: 'in-progress',
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
export const updateGoal = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const goal = devMemoryStore.updateGoal(req.user._id, req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Goal updated successfully (Dev Mode)',
        data: goal,
      });
    }

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });

    if (!goal) {
      res.status(404);
      throw new Error('Goal not found');
    }

    const { title, description, category, targetDate, status, progress, milestones } = req.body;

    if (title !== undefined) goal.title = title.trim();
    if (description !== undefined) goal.description = description.trim();
    if (category !== undefined) goal.category = category;
    if (targetDate !== undefined) goal.targetDate = targetDate;
    if (status !== undefined) goal.status = status;
    if (progress !== undefined) goal.progress = progress;
    if (milestones !== undefined) {
      goal.milestones = milestones;
      if (milestones.length > 0) {
        const completedMilestones = milestones.filter(m => m.completed).length;
        goal.progress = Math.round((completedMilestones / milestones.length) * 100);
      }
    }

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
export const deleteGoal = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      devMemoryStore.deleteGoal(req.user._id, req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Goal removed successfully (Dev Mode)',
        id: req.params.id,
      });
    }

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });

    if (!goal) {
      res.status(404);
      throw new Error('Goal not found');
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Goal removed successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
