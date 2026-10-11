import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { formatDateStr, calculateStreaks, isDayScheduled } from './streakService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.resolve(DATA_DIR, 'store.json');

class PersistentDB {
  constructor() {
    this.data = {
      users: [],
      habits: [],
      completions: [],
      tasks: [],
      goals: [],
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.seedInitialData();
        this.save();
      }
    } catch (err) {
      console.warn('[PersistentDB] Initialization warning, seeding fresh store:', err.message);
      this.seedInitialData();
      this.save();
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[PersistentDB] Failed to save database to disk:', err.message);
    }
  }

  seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const demoHashedPassword = bcrypt.hashSync('secret123', salt);
    const DEMO_USER_ID = '66a123456789012345678901';

    this.data.users = [
      {
        _id: DEMO_USER_ID,
        name: 'Rudi Vance',
        email: 'demo@habits.local',
        password: demoHashedPassword,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        preferences: { theme: 'dark', accentColor: 'indigo' },
        createdAt: new Date().toISOString(),
      },
    ];

    this.data.habits = [
      {
        _id: 'habit-101',
        userId: DEMO_USER_ID,
        title: 'Morning Deep Reading',
        description: 'Read high-impact chapters from Atomic Habits or Deep Work',
        category: 'Personal Growth',
        frequency: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        scheduledTime: '07:30 AM',
        color: '#8b5cf6',
        icon: 'BookOpen',
        currentStreak: 5,
        longestStreak: 12,
        totalCompleted: 24,
        archived: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'habit-102',
        userId: DEMO_USER_ID,
        title: 'Mindful Box Breathing',
        description: 'Calm the central nervous system with 15 mins of breathwork',
        category: 'Health',
        frequency: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        scheduledTime: '08:00 AM',
        color: '#06b6d4',
        icon: 'Sparkles',
        currentStreak: 8,
        longestStreak: 15,
        totalCompleted: 30,
        archived: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'habit-103',
        userId: DEMO_USER_ID,
        title: 'Full-Stack Architecture & Code',
        description: 'Build portfolio platforms with clean architecture',
        category: 'Productivity',
        frequency: 'custom',
        scheduledDays: [1, 2, 3, 4, 5],
        scheduledTime: '10:00 AM',
        color: '#6366f1',
        icon: 'Code',
        currentStreak: 6,
        longestStreak: 20,
        totalCompleted: 42,
        archived: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'habit-104',
        userId: DEMO_USER_ID,
        title: 'Hydration Target (3 Liters)',
        description: 'Hit continuous hydration checkpoints throughout the day',
        category: 'Health',
        frequency: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        scheduledTime: 'All Day',
        color: '#3b82f6',
        icon: 'Droplet',
        currentStreak: 14,
        longestStreak: 30,
        totalCompleted: 65,
        archived: false,
        createdAt: new Date().toISOString(),
      },
    ];

    this.data.completions = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = formatDateStr(d);

      this.data.habits.forEach((h, hIdx) => {
        if ((i + hIdx) % 3 !== 0) {
          this.data.completions.push({
            _id: `comp-${h._id}-${dStr}`,
            userId: DEMO_USER_ID,
            habitId: h._id,
            completionDate: dStr,
            completed: true,
          });
        }
      });
    }

    this.data.tasks = [
      {
        _id: 'task-1',
        userId: DEMO_USER_ID,
        title: 'Review System Architecture & Database indexes',
        description: 'Ensure performance indexing across models',
        dueDate: formatDateStr(new Date()),
        priority: 'High',
        category: 'Engineering',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'task-2',
        userId: DEMO_USER_ID,
        title: 'Complete 45 min Push Session',
        description: 'Bench press, overhead dumbbell press, tricep dips',
        dueDate: formatDateStr(new Date()),
        priority: 'Medium',
        category: 'Fitness',
        status: 'completed',
        createdAt: new Date().toISOString(),
      },
    ];

    this.data.goals = [
      {
        _id: 'goal-1',
        userId: DEMO_USER_ID,
        title: 'Master Full-Stack Modern Web Engineering',
        description: 'Ship 3 complete portfolio-quality full-stack applications',
        category: 'Engineering',
        targetDate: '2026-12-31',
        progress: 75,
        status: 'in-progress',
        milestones: [
          { title: 'Habit Planner Full-Stack MVP with Auth', completed: true },
          { title: 'Dynamic Calendar and Streak Visualizer', completed: true },
          { title: 'Portfolio Production Documentation', completed: false },
        ],
      },
    ];
  }

  // --- USER AUTHENTICATION & MANAGEMENT ---
  async registerUser({ name, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Please enter a valid email address (e.g. name@gmail.com)');
    }

    const existing = this.data.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const newUser = {
      _id: newUserId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=6366f1,8b5cf6,ec4899`,
      preferences: { theme: 'dark', accentColor: 'indigo' },
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.createStarterHabitsForUser(newUserId);
    this.save();

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  createStarterHabitsForUser(userId) {
    const starterHabits = [
      {
        _id: `habit-${Date.now()}-1`,
        userId,
        title: 'Morning Hydration & Sunlight',
        description: 'Drink 500ml water and get 10 minutes of morning sunlight',
        category: 'Health',
        frequency: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        scheduledTime: '07:00 AM',
        color: '#06b6d4',
        icon: 'Droplet',
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0,
        archived: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: `habit-${Date.now()}-2`,
        userId,
        title: 'Deep Focused Work (45 Mins)',
        description: 'Single-task with zero notifications or distractions',
        category: 'Productivity',
        frequency: 'custom',
        scheduledDays: [1, 2, 3, 4, 5],
        scheduledTime: '09:30 AM',
        color: '#6366f1',
        icon: 'Brain',
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0,
        archived: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: `habit-${Date.now()}-3`,
        userId,
        title: 'Daily Movement & Physical Training',
        description: 'Gym workout, brisk walk, or bodyweight circuit',
        category: 'Fitness',
        frequency: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        scheduledTime: '05:30 PM',
        color: '#10b981',
        icon: 'Dumbbell',
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0,
        archived: false,
        createdAt: new Date().toISOString(),
      },
    ];

    this.data.habits.push(...starterHabits);
  }

  async loginUser({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Please enter a valid email address');
    }

    const user = this.data.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new Error('No account found with this email. Please check your email or create an account.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Incorrect password. Please try again.');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  getUserById(id) {
    const user = this.data.users.find((u) => u._id === id);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  updateUserProfile(id, updates) {
    const userIndex = this.data.users.findIndex((u) => u._id === id);
    if (userIndex === -1) return null;

    const user = this.data.users[userIndex];
    if (updates.name) user.name = updates.name.trim();
    if (updates.avatar) user.avatar = updates.avatar;
    if (updates.preferences) {
      user.preferences = { ...user.preferences, ...updates.preferences };
    }

    this.save();
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // --- HABITS (Strictly filtered per user) ---
  getHabits(userId) {
    const userHabits = this.data.habits.filter((h) => h.userId === userId && !h.archived);

    return userHabits.map((h) => {
      const hComps = this.data.completions.filter(
        (c) => c.userId === userId && c.habitId === h._id && c.completed
      );
      const completionMap = {};
      hComps.forEach((c) => {
        completionMap[c.completionDate] = true;
      });

      const streakData = calculateStreaks(h, Object.keys(completionMap));
      return {
        ...h,
        id: h._id,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        totalCompleted: streakData.totalCompleted,
        streak: streakData.currentStreak,
        completions: completionMap,
      };
    });
  }

  createHabit(userId, data) {
    const newHabit = {
      _id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      category: data.category || 'Productivity',
      frequency: data.frequency || 'daily',
      scheduledDays: data.scheduledDays || [0, 1, 2, 3, 4, 5, 6],
      scheduledTime: data.scheduledTime || '08:00 AM',
      color: data.color || '#6366f1',
      icon: data.icon || 'Target',
      currentStreak: 0,
      longestStreak: 0,
      totalCompleted: 0,
      archived: false,
      createdAt: new Date().toISOString(),
    };

    this.data.habits.unshift(newHabit);
    this.save();
    return { ...newHabit, id: newHabit._id, streak: 0, completions: {} };
  }

  getHabitById(userId, habitId) {
    const habit = this.data.habits.find((h) => h.userId === userId && h._id === habitId);
    if (!habit) return null;

    const hComps = this.data.completions.filter(
      (c) => c.userId === userId && c.habitId === habitId && c.completed
    );
    const completionMap = {};
    hComps.forEach((c) => {
      completionMap[c.completionDate] = true;
    });

    const streakData = calculateStreaks(habit, Object.keys(completionMap));
    return {
      ...habit,
      id: habit._id,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      totalCompleted: streakData.totalCompleted,
      streak: streakData.currentStreak,
      completions: completionMap,
    };
  }

  updateHabit(userId, habitId, data) {
    const habit = this.data.habits.find((h) => h.userId === userId && h._id === habitId);
    if (!habit) return null;

    Object.assign(habit, data);
    this.save();
    return this.getHabitById(userId, habitId);
  }

  deleteHabit(userId, habitId) {
    const habit = this.data.habits.find((h) => h.userId === userId && h._id === habitId);
    if (!habit) return false;

    habit.archived = true;
    this.save();
    return true;
  }

  toggleHabitCompletion(userId, habitId, dateStr) {
    const habit = this.data.habits.find((h) => h.userId === userId && h._id === habitId);
    if (!habit) return null;

    const existingIndex = this.data.completions.findIndex(
      (c) => c.userId === userId && c.habitId === habitId && c.completionDate === dateStr
    );

    let isCompletedNow = false;
    if (existingIndex > -1) {
      this.data.completions.splice(existingIndex, 1);
      isCompletedNow = false;
    } else {
      this.data.completions.push({
        _id: `comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        habitId,
        completionDate: dateStr,
        completed: true,
      });
      isCompletedNow = true;
    }

    const hComps = this.data.completions.filter(
      (c) => c.userId === userId && c.habitId === habitId && c.completed
    );
    const completedDates = hComps.map((c) => c.completionDate);
    const streakData = calculateStreaks(habit, completedDates);
    habit.currentStreak = streakData.currentStreak;
    habit.longestStreak = streakData.longestStreak;
    habit.totalCompleted = streakData.totalCompleted;
    this.save();

    return {
      completed: isCompletedNow,
      streakData,
      habit,
    };
  }

  getDailyProgress(userId, dateStr) {
    const userHabits = this.data.habits.filter((h) => h.userId === userId && !h.archived);
    const queryDate = new Date(`${dateStr}T00:00:00`);
    const scheduled = userHabits.filter((h) => isDayScheduled(queryDate, h.scheduledDays));
    const scheduledIds = scheduled.map((h) => h._id);

    const completed = this.data.completions.filter(
      (c) => c.userId === userId && scheduledIds.includes(c.habitId) && c.completionDate === dateStr && c.completed
    );

    const totalScheduled = scheduled.length;
    const completedCount = completed.length;
    const completionPercentage = totalScheduled > 0 ? Math.round((completedCount / totalScheduled) * 100) : 0;

    return {
      date: dateStr,
      totalScheduled,
      completedCount,
      completionPercentage,
    };
  }

  getAnalyticsSummary(userId) {
    const userHabits = this.data.habits.filter((h) => h.userId === userId && !h.archived);
    const userCompletions = this.data.completions.filter((c) => c.userId === userId && c.completed);

    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;
    userHabits.forEach((h) => {
      if (h.currentStreak > maxCurrentStreak) maxCurrentStreak = h.currentStreak;
      if (h.longestStreak > maxLongestStreak) maxLongestStreak = h.longestStreak;
    });

    const todayStr = formatDateStr(new Date());
    const dailyProgress = this.getDailyProgress(userId, todayStr);

    return {
      totalHabits: userHabits.length,
      totalCompletions: userCompletions.length,
      maxCurrentStreak,
      maxLongestStreak,
      scheduledTodayCount: dailyProgress.totalScheduled,
      completedTodayCount: dailyProgress.completedCount,
      todayCompletionRate: dailyProgress.completionPercentage,
    };
  }

  getWeeklyTrend(userId) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trend = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDateStr(d);
      const dayName = daysOfWeek[d.getDay()];

      const prog = this.getDailyProgress(userId, dateStr);
      trend.push({
        date: dateStr,
        day: dayName,
        completed: prog.completedCount,
        scheduled: prog.totalScheduled,
        rate: prog.completionPercentage,
      });
    }

    return trend;
  }

  getYearlyHeatmap(userId) {
    const map = {};
    const userCompletions = this.data.completions.filter((c) => c.userId === userId && c.completed);
    userCompletions.forEach((c) => {
      map[c.completionDate] = (map[c.completionDate] || 0) + 1;
    });
    return map;
  }

  // --- TASKS (Strictly per user) ---
  getTasks(userId, query = {}) {
    let list = this.data.tasks.filter((t) => t.userId === userId);
    if (query.dueDate) {
      list = list.filter((t) => t.dueDate === query.dueDate);
    }
    if (query.status) {
      list = list.filter((t) => t.status === query.status);
    }
    return list;
  }

  createTask(userId, data) {
    const newTask = {
      _id: `task-${Date.now()}`,
      userId,
      title: data.title,
      description: data.description || '',
      dueDate: data.dueDate || formatDateStr(new Date()),
      priority: data.priority || 'Medium',
      category: data.category || 'General',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.data.tasks.unshift(newTask);
    this.save();
    return newTask;
  }

  updateTask(userId, taskId, data) {
    const task = this.data.tasks.find((t) => t.userId === userId && t._id === taskId);
    if (!task) return null;
    Object.assign(task, data);
    this.save();
    return task;
  }

  toggleTask(userId, taskId) {
    const task = this.data.tasks.find((t) => t.userId === userId && t._id === taskId);
    if (!task) return null;
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    this.save();
    return task;
  }

  deleteTask(userId, taskId) {
    this.data.tasks = this.data.tasks.filter((t) => !(t.userId === userId && t._id === taskId));
    this.save();
    return true;
  }

  // --- GOALS (Strictly per user) ---
  getGoals(userId) {
    return this.data.goals.filter((g) => g.userId === userId);
  }

  createGoal(userId, data) {
    const newGoal = {
      _id: `goal-${Date.now()}`,
      userId,
      title: data.title,
      description: data.description || '',
      category: data.category || 'Personal Growth',
      targetDate: data.targetDate || '',
      progress: 0,
      status: 'in-progress',
      milestones: data.milestones || [],
      createdAt: new Date().toISOString(),
    };
    this.data.goals.unshift(newGoal);
    this.save();
    return newGoal;
  }

  updateGoal(userId, goalId, data) {
    const goal = this.data.goals.find((g) => g.userId === userId && g._id === goalId);
    if (!goal) return null;
    Object.assign(goal, data);
    if (data.milestones && data.milestones.length > 0) {
      const completed = data.milestones.filter((m) => m.completed).length;
      goal.progress = Math.round((completed / data.milestones.length) * 100);
    }
    this.save();
    return goal;
  }

  deleteGoal(userId, goalId) {
    this.data.goals = this.data.goals.filter((g) => !(g.userId === userId && g._id === goalId));
    this.save();
    return true;
  }
}

export const persistentDB = new PersistentDB();
export default persistentDB;
