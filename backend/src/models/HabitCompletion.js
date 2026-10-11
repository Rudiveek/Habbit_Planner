import mongoose from 'mongoose';

const habitCompletionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
      index: true,
    },
    completionDate: {
      type: String, // Stored as 'YYYY-MM-DD' format for timezone consistency
      required: [true, 'Completion date string is required (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Completion date must be formatted as YYYY-MM-DD'],
    },
    completed: {
      type: Boolean,
      default: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Enforce single completion entry per habit per user per date
habitCompletionSchema.index(
  { userId: 1, habitId: 1, completionDate: 1 },
  { unique: true }
);

// Query optimization index for user's completions in a date range (heatmap / history)
habitCompletionSchema.index({ userId: 1, completionDate: 1 });

export const HabitCompletion = mongoose.model('HabitCompletion', habitCompletionSchema);
export default HabitCompletion;
