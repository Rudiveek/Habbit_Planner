import Task from '../models/Task.js';
import { isDBConnected } from '../config/db.js';
import devMemoryStore from '../services/devMemoryStore.js';

/**
 * @desc    Get all tasks for authenticated user
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const tasks = devMemoryStore.getTasks(req.user._id, req.query);
      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    }

    const query = { userId: req.user._id };
    if (req.query.dueDate) {
      query.dueDate = req.query.dueDate;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, category } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Please provide a task title');
    }

    if (!isDBConnected()) {
      const task = devMemoryStore.createTask(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        message: 'Task created successfully (Dev Mode)',
        data: task,
      });
    }

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      priority: priority || 'Medium',
      category: category || 'General',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const task = devMemoryStore.updateTask(req.user._id, req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Task updated successfully (Dev Mode)',
        data: task,
      });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const { title, description, dueDate, priority, status, category } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (category !== undefined) task.category = category;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle task completion status
 * @route   POST /api/tasks/:id/toggle
 * @access  Private
 */
export const toggleTask = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const task = devMemoryStore.toggleTask(req.user._id, req.params.id);
      return res.status(200).json({
        success: true,
        completed: task?.status === 'completed',
        data: task,
      });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();

    res.status(200).json({
      success: true,
      completed: task.status === 'completed',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      devMemoryStore.deleteTask(req.user._id, req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Task removed successfully (Dev Mode)',
        id: req.params.id,
      });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task removed successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
