import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a habit title'],
      trim: true,
      maxlength: [120, 'Habit title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    category: {
      type: String,
      trim: true,
      enum: ['Productivity', 'Health', 'Fitness', 'Learning', 'Mindfulness', 'Personal', 'Routine'],
      default: 'Productivity',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily',
    },
    scheduledDays: {
      type: [Number], // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      default: [0, 1, 2, 3, 4, 5, 6],
    },
    scheduledTime: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#6366f1', // Indigo accent
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying active habits per user efficiently
habitSchema.index({ userId: 1, archived: 1 });

export const Habit = mongoose.model('Habit', habitSchema);
export default Habit;
