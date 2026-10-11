import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [150, 'Task title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    dueDate: {
      type: String, // 'YYYY-MM-DD'
      default: () => new Date().toISOString().split('T')[0],
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user tasks by date and status
taskSchema.index({ userId: 1, dueDate: 1, status: 1 });

export const Task = mongoose.model('Task', taskSchema);
export default Task;
