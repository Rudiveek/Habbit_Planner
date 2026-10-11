export const initialThoughts = [
  {
    id: 1,
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    category: "Mastery"
  },
  {
    id: 2,
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    category: "Atomic Growth"
  },
  {
    id: 3,
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    category: "Focus"
  },
  {
    id: 4,
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Action"
  },
  {
    id: 5,
    quote: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    category: "Consistency"
  }
];

export const initialHabits = [
  {
    id: 'habit-1',
    title: 'Reading',
    category: 'Mind',
    target: '30 mins/day',
    frequency: 'Daily',
    color: '#8b5cf6',
    icon: 'BookOpen',
    createdAt: '2026-01-01',
    streak: 14,
    status: 'Completed',
    notes: [
      { id: 'n1', date: '2026-07-30', text: 'Finished Chapter 4 of Atomic Habits. Great takeaways on environment design.' },
      { id: 'n2', date: '2026-07-28', text: 'Read 25 pages of Deep Work before sleep.' }
    ],
    completions: generateHabitHistory(0.85)
  },
  {
    id: 'habit-2',
    title: 'Meditation',
    category: 'Mindfulness',
    target: '15 mins/day',
    frequency: 'Daily',
    color: '#06b6d4',
    icon: 'Sparkles',
    createdAt: '2026-01-01',
    streak: 20,
    status: 'Completed',
    notes: [
      { id: 'n3', date: '2026-07-31', text: 'Morning box breathing session. Felt clear and refreshed.' }
    ],
    completions: generateHabitHistory(0.75)
  },
  {
    id: 'habit-3',
    title: 'Coding',
    category: 'Skills',
    target: '2 hours/day',
    frequency: 'Mon-Fri',
    color: '#6366f1',
    icon: 'Code',
    createdAt: '2026-01-01',
    streak: 8,
    status: 'In Progress',
    notes: [
      { id: 'n4', date: '2026-07-31', text: 'Built custom React state manager & Tailwind dark mode components.' }
    ],
    completions: generateHabitHistory(0.9)
  },
  {
    id: 'habit-4',
    title: 'Journaling',
    category: 'Reflection',
    target: '1 entry/day',
    frequency: 'Daily',
    color: '#ec4899',
    icon: 'PenTool',
    createdAt: '2026-01-01',
    streak: 5,
    status: 'In Progress',
    notes: [
      { id: 'n5', date: '2026-07-29', text: 'Reflected on monthly progress and physical training personal records.' }
    ],
    completions: generateHabitHistory(0.7)
  },
  {
    id: 'habit-5',
    title: 'No Sugar',
    category: 'Health',
    target: 'Zero refined sugar',
    frequency: 'Daily',
    color: '#10b981',
    icon: 'ShieldCheck',
    createdAt: '2026-01-01',
    streak: 12,
    status: 'Completed',
    notes: [],
    completions: generateHabitHistory(0.8)
  }
];

export const initialTodos = [
  { id: 't1', title: 'Complete Morning Meditation & Box Breathing', completed: true, category: 'Mindfulness', priority: 'High', date: '2026-07-31' },
  { id: 't2', title: 'Log Push Workout Routine (Bench, Incline, Triceps)', completed: true, category: 'Fitness', priority: 'High', date: '2026-07-31' },
  { id: 't3', title: 'Track Lunch & Hit 150g Protein Target', completed: true, category: 'Nutrition', priority: 'Medium', date: '2026-07-31' },
  { id: 't4', title: 'Review Weekly Growth Analytics & Heatmap', completed: false, category: 'Growth', priority: 'Medium', date: '2026-07-31' },
  { id: 't5', title: 'Read 30 Pages of System Architecture', completed: false, category: 'Mind', priority: 'Low', date: '2026-07-31' },
];

export const initialFoodData = {
  waterTargetMl: 3000,
  waterCurrentMl: 2250,
  macroTargets: {
    calories: 2600,
    protein: 180,
    carbs: 260,
    fat: 70
  },
  currentWeightKg: 78.4,
  targetWeightKg: 75.0,
  weightHistory: [
    { date: '2026-07-01', weight: 81.0 },
    { date: '2026-07-08', weight: 80.2 },
    { date: '2026-07-15', weight: 79.6 },
    { date: '2026-07-22', weight: 79.0 },
    { date: '2026-07-29', weight: 78.5 },
    { date: '2026-07-31', weight: 78.4 }
  ],
  meals: [
    {
      type: 'Breakfast',
      time: '08:30 AM',
      items: [
        { id: 'm1', name: 'Oatmeal with Blueberries & Whey Protein', calories: 480, protein: 38, carbs: 62, fat: 8 },
        { id: 'm2', name: 'Black Coffee & Almond Milk', calories: 35, protein: 1, carbs: 3, fat: 2 }
      ]
    },
    {
      type: 'Lunch',
      time: '01:15 PM',
      items: [
        { id: 'm3', name: 'Grilled Chicken Breast with Quinoa & Asparagus', calories: 650, protein: 55, carbs: 58, fat: 14 },
        { id: 'm4', name: 'Greek Yogurt (0% Fat)', calories: 120, protein: 18, carbs: 6, fat: 0 }
      ]
    },
    {
      type: 'Dinner',
      time: '07:45 PM',
      items: [
        { id: 'm5', name: 'Pan-seared Salmon Fillet with Brown Rice & Broccoli', calories: 680, protein: 46, carbs: 50, fat: 22 }
      ]
    }
  ]
};

export const initialWorkouts = {
  plans: [
    {
      id: 'p1',
      name: 'Push (Chest, Shoulders, Triceps)',
      focus: 'Hypertrophy & Strength',
      estimatedTime: '60 mins',
      exercises: [
        { name: 'Barbell Bench Press', defaultSets: 4, defaultReps: '8-10', targetWeight: 90 },
        { name: 'Incline Dumbbell Press', defaultSets: 3, defaultReps: '10-12', targetWeight: 32 },
        { name: 'Overhead DB Shoulder Press', defaultSets: 3, defaultReps: '8-10', targetWeight: 26 },
        { name: 'Cable Tricep Pushdown', defaultSets: 4, defaultReps: '12-15', targetWeight: 35 }
      ]
    },
    {
      id: 'p2',
      name: 'Pull (Back, Biceps, Rear Delt)',
      focus: 'Back Width & Arm Thickness',
      estimatedTime: '65 mins',
      exercises: [
        { name: 'Barbell Deadlift', defaultSets: 4, defaultReps: '5', targetWeight: 140 },
        { name: 'Lat Pulldown (Neutral Grip)', defaultSets: 4, defaultReps: '10-12', targetWeight: 75 },
        { name: 'Seated Cable Row', defaultSets: 3, defaultReps: '10-12', targetWeight: 68 },
        { name: 'Incline DB Bicep Curls', defaultSets: 3, defaultReps: '12', targetWeight: 16 }
      ]
    },
    {
      id: 'p3',
      name: 'Legs (Quads, Hamstrings, Calves)',
      focus: 'Lower Body Power',
      estimatedTime: '70 mins',
      exercises: [
        { name: 'Barbell Back Squat', defaultSets: 4, defaultReps: '6-8', targetWeight: 115 },
        { name: 'Romanian Deadlift', defaultSets: 3, defaultReps: '10', targetWeight: 95 },
        { name: 'Leg Press Machine', defaultSets: 3, defaultReps: '12-15', targetWeight: 210 },
        { name: 'Standing Calf Raises', defaultSets: 4, defaultReps: '15', targetWeight: 80 }
      ]
    }
  ],
  prRecords: [
    { id: 'pr1', exercise: 'Barbell Bench Press', weight: '105 kg', reps: '3 reps', date: '2026-07-20', category: 'Chest' },
    { id: 'pr2', exercise: 'Barbell Back Squat', weight: '135 kg', reps: '5 reps', date: '2026-07-18', category: 'Legs' },
    { id: 'pr3', exercise: 'Conventional Deadlift', weight: '175 kg', reps: '2 reps', date: '2026-07-10', category: 'Back' },
    { id: 'pr4', exercise: 'Overhead Press', weight: '70 kg', reps: '4 reps', date: '2026-07-25', category: 'Shoulders' }
  ],
  logs: [
    {
      id: 'log-1',
      date: '2026-07-31',
      planName: 'Push (Chest, Shoulders, Triceps)',
      durationMins: 58,
      caloriesBurned: 520,
      totalVolumeKg: 8450,
      exercises: []
    },
    {
      id: 'log-2',
      date: '2026-07-29',
      planName: 'Pull (Back, Biceps)',
      durationMins: 62,
      caloriesBurned: 560,
      totalVolumeKg: 9200,
      exercises: []
    },
    {
      id: 'log-3',
      date: '2026-07-27',
      planName: 'Legs (Quads, Hamstrings)',
      durationMins: 65,
      caloriesBurned: 610,
      totalVolumeKg: 11400,
      exercises: []
    }
  ],
  progressPhotos: [
    { id: 'ph1', date: '2026-07-30', label: 'Current Physique - 78.4 kg', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80' },
    { id: 'ph2', date: '2026-06-01', label: 'Day 1 Baseline - 82.5 kg', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' }
  ]
};

export const initialProfile = {
  name: 'Rudi Vance',
  handle: '@rudivance',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  level: 14,
  xp: 3850,
  xpNextLevel: 5000,
  bio: 'Relentless optimizer. Building high-performance systems for mind, body, and craft.',
  badges: [
    { id: 'b1', name: 'Streak Master', desc: 'Maintained 30-day streak on core habits', icon: 'Flame', color: 'from-amber-500 to-rose-500' },
    { id: 'b2', name: 'Iron Lifter', desc: 'Logged 50+ Heavy Gym Sessions', icon: 'Dumbbell', color: 'from-indigo-500 to-purple-500' },
    { id: 'b3', name: 'Macro Wizard', desc: 'Hit protein target for 14 straight days', icon: 'Apple', color: 'from-emerald-500 to-teal-500' },
    { id: 'b4', name: 'Deep Work Monk', desc: 'Logged over 100 hours of coding', icon: 'Zap', color: 'from-cyan-500 to-blue-500' }
  ]
};

function generateHabitHistory(probability) {
  const history = {};
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const seed = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + i;
    const rand = (Math.sin(seed) + 1) / 2;
    if (rand < probability) {
      history[dateStr] = true;
    }
  }
  return history;
}
