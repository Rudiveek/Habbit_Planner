import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialThoughts,
  initialHabits,
  initialTodos,
  initialFoodData,
  initialWorkouts,
  initialProfile
} from '../data/initialData';
import habitService from '../services/habitService';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const STORAGE_KEYS = {
  HABITS: 'aura_habits',
  TODOS: 'aura_todos',
  FOOD: 'aura_food',
  WORKOUTS: 'aura_workouts',
  PROFILE: 'aura_profile',
  SETTINGS: 'aura_settings',
  BANNER_QUOTE: 'aura_banner_quote',
  THEME: 'aura_theme'
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id || null;

  const [thoughts] = useState(initialThoughts);
  const [showMotivationModal, setShowMotivationModal] = useState(true);
  
  const [bannerQuote, setBannerQuote] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BANNER_QUOTE);
    return saved ? JSON.parse(saved) : initialThoughts[0];
  });

  // State initialized based on active user
  const [habits, setHabits] = useState([]);
  const [todos, setTodos] = useState(initialTodos);
  const [foodData, setFoodData] = useState(initialFoodData);
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [profile, setProfile] = useState(initialProfile);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : { themeAccent: 'indigo', notifyReminders: true, compactMode: false };
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  });

  // Theme synchronization with HTML class
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User session lifecycle & Per-user data loading
  useEffect(() => {
    if (!userId) {
      // Guest or logged-out: reset to empty state so no data leaks across accounts
      setHabits([]);
      setTodos(initialTodos);
      setFoodData(initialFoodData);
      setWorkouts(initialWorkouts);
      return;
    }

    // 1. Load locally cached per-user data
    const cachedHabits = localStorage.getItem(`${STORAGE_KEYS.HABITS}_${userId}`);
    if (cachedHabits) {
      try {
        setHabits(JSON.parse(cachedHabits));
      } catch (e) {
        console.warn('Failed to parse cached habits:', e);
      }
    }

    const cachedTodos = localStorage.getItem(`${STORAGE_KEYS.TODOS}_${userId}`);
    if (cachedTodos) {
      try {
        setTodos(JSON.parse(cachedTodos));
      } catch (e) {}
    }

    const cachedFood = localStorage.getItem(`${STORAGE_KEYS.FOOD}_${userId}`);
    if (cachedFood) {
      try {
        setFoodData(JSON.parse(cachedFood));
      } catch (e) {}
    }

    const cachedWorkouts = localStorage.getItem(`${STORAGE_KEYS.WORKOUTS}_${userId}`);
    if (cachedWorkouts) {
      try {
        setWorkouts(JSON.parse(cachedWorkouts));
      } catch (e) {}
    }

    // 2. Fetch fresh backend habits for this specific authenticated user
    const fetchUserHabits = async () => {
      try {
        const res = await habitService.getHabits();
        if (res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map(h => ({
            ...h,
            id: h._id || h.id,
            streak: h.currentStreak !== undefined ? h.currentStreak : (h.streak || 0),
          }));
          setHabits(mapped);
          localStorage.setItem(`${STORAGE_KEYS.HABITS}_${userId}`, JSON.stringify(mapped));
        }
      } catch (err) {
        console.warn('[AppContext] Backend habit sync using local cache:', err.message);
      }
    };

    fetchUserHabits();
  }, [userId]);

  // Persist per-user changes to user-scoped LocalStorage
  useEffect(() => {
    if (userId && habits.length > 0) {
      localStorage.setItem(`${STORAGE_KEYS.HABITS}_${userId}`, JSON.stringify(habits));
    }
  }, [habits, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`${STORAGE_KEYS.TODOS}_${userId}`, JSON.stringify(todos));
    }
  }, [todos, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`${STORAGE_KEYS.FOOD}_${userId}`, JSON.stringify(foodData));
    }
  }, [foodData, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`${STORAGE_KEYS.WORKOUTS}_${userId}`, JSON.stringify(workouts));
    }
  }, [workouts, userId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const acceptMotivationQuote = (quoteObj) => {
    setBannerQuote(quoteObj);
    localStorage.setItem(STORAGE_KEYS.BANNER_QUOTE, JSON.stringify(quoteObj));
    setShowMotivationModal(false);
  };

  const toggleHabitCompletion = async (habitId, dateStr) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    // 1. Optimistic UI update
    setHabits(prev => prev.map(h => {
      if (h.id === habitId || h._id === habitId) {
        const completions = { ...(h.completions || {}) };
        if (completions[targetDate]) {
          delete completions[targetDate];
        } else {
          completions[targetDate] = true;
        }
        const newStatus = completions[targetDate] ? 'Completed' : 'In Progress';
        return { ...h, completions, status: newStatus };
      }
      return h;
    }));

    // 2. Persist to Backend API
    const token = localStorage.getItem('aura_token');
    if (token) {
      try {
        const res = await habitService.toggleHabitCompletion(habitId, targetDate);
        if (res?.streakData) {
          setHabits(prev => prev.map(h => {
            if (h.id === habitId || h._id === habitId) {
              return {
                ...h,
                streak: res.streakData.currentStreak,
                currentStreak: res.streakData.currentStreak,
                longestStreak: res.streakData.longestStreak,
                totalCompleted: res.streakData.totalCompleted,
              };
            }
            return h;
          }));
        }
      } catch (err) {
        console.warn('[AppContext] Backend toggle fallback:', err.message);
      }
    }
  };

  const addCustomHabit = async (newHabit) => {
    const tempId = `habit-${Date.now()}`;
    const habitPayload = {
      id: tempId,
      title: newHabit.name || newHabit.title,
      name: newHabit.name || newHabit.title,
      category: newHabit.category || 'Personal Growth',
      target: newHabit.target || 'Daily',
      frequency: newHabit.frequency || 'Daily',
      color: newHabit.color || '#6366f1',
      icon: newHabit.icon || 'Sparkles',
      createdAt: new Date().toISOString().split('T')[0],
      streak: 0,
      currentStreak: 0,
      longestStreak: 0,
      status: 'In Progress',
      notes: [],
      completions: {}
    };

    // Optimistic insert
    setHabits(prev => [habitPayload, ...prev]);

    // Backend sync
    const token = localStorage.getItem('aura_token');
    if (token) {
      try {
        const res = await habitService.createHabit({
          title: habitPayload.title,
          category: habitPayload.category,
          frequency: habitPayload.frequency.toLowerCase(),
          color: habitPayload.color,
          icon: habitPayload.icon,
        });
        if (res?.data?._id) {
          setHabits(prev => prev.map(h => h.id === tempId ? { ...h, id: res.data._id, _id: res.data._id } : h));
        }
      } catch (err) {
        console.warn('[AppContext] Backend createHabit fallback:', err.message);
      }
    }
  };

  const updateHabit = async (habitId, updateData) => {
    // 1. Optimistic update
    setHabits(prev => prev.map(h => {
      if (h.id === habitId || h._id === habitId) {
        return {
          ...h,
          ...updateData,
          title: updateData.title || h.title,
          name: updateData.title || h.name || h.title,
        };
      }
      return h;
    }));

    // 2. Sync to Backend
    const token = localStorage.getItem('aura_token');
    if (token) {
      try {
        await habitService.updateHabit(habitId, updateData);
      } catch (err) {
        console.warn('[AppContext] Backend updateHabit fallback:', err.message);
      }
    }
  };

  const addHabitNote = (habitId, noteText) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === habitId || h._id === habitId) {
        const newNotes = [
          { id: `note-${Date.now()}`, date: today, text: noteText },
          ...(h.notes || [])
        ];
        return { ...h, notes: newNotes };
      }
      return h;
    }));
  };

  const deleteHabit = async (habitId) => {
    // 1. Optimistic delete
    setHabits(prev => prev.filter(h => h.id !== habitId && h._id !== habitId));

    // 2. Sync to Backend
    const token = localStorage.getItem('aura_token');
    if (token) {
      try {
        await habitService.deleteHabit(habitId);
      } catch (err) {
        console.warn('[AppContext] Backend deleteHabit fallback:', err.message);
      }
    }
  };

  const toggleTodo = (todoId) => {
    setTodos(prev => prev.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t));
  };

  const addTodo = (title, category = 'General', priority = 'Medium') => {
    const today = new Date().toISOString().split('T')[0];
    const newTodo = {
      id: `t-${Date.now()}`,
      title,
      completed: false,
      category,
      priority,
      date: today
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const deleteTodo = (todoId) => {
    setTodos(prev => prev.filter(t => t.id !== todoId));
  };

  const addWater = (amountMl) => {
    setFoodData(prev => ({
      ...prev,
      waterCurrentMl: Math.min(prev.waterTargetMl + 2000, prev.waterCurrentMl + amountMl)
    }));
  };

  const addMealItem = (mealType, item) => {
    setFoodData(prev => {
      const updatedMeals = prev.meals.map(m => {
        if (m.type === mealType) {
          return {
            ...m,
            items: [...m.items, { ...item, id: `m-${Date.now()}` }]
          };
        }
        return m;
      });
      return { ...prev, meals: updatedMeals };
    });
  };

  const deleteMealItem = (mealType, itemId) => {
    setFoodData(prev => {
      const updatedMeals = prev.meals.map(m => {
        if (m.type === mealType) {
          return {
            ...m,
            items: m.items.filter(i => i.id !== itemId)
          };
        }
        return m;
      });
      return { ...prev, meals: updatedMeals };
    });
  };

  const logWeight = (weightVal) => {
    const today = new Date().toISOString().split('T')[0];
    setFoodData(prev => {
      const history = [...prev.weightHistory, { date: today, weight: parseFloat(weightVal) }];
      return {
        ...prev,
        currentWeightKg: parseFloat(weightVal),
        weightHistory: history
      };
    });
  };

  const logWorkoutSession = (session) => {
    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...session
    };
    setWorkouts(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs]
    }));
  };

  const addPRRecord = (pr) => {
    const newPR = {
      id: `pr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...pr
    };
    setWorkouts(prev => ({
      ...prev,
      prRecords: [newPR, ...prev.prRecords]
    }));
  };

  const addProgressPhoto = (photo) => {
    const newPhoto = {
      id: `ph-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...photo
    };
    setWorkouts(prev => ({
      ...prev,
      progressPhotos: [newPhoto, ...prev.progressPhotos]
    }));
  };

  const resetAllData = () => {
    setHabits(initialHabits);
    setTodos(initialTodos);
    setFoodData(initialFoodData);
    setWorkouts(initialWorkouts);
    setProfile(initialProfile);
    if (userId) {
      localStorage.removeItem(`${STORAGE_KEYS.HABITS}_${userId}`);
      localStorage.removeItem(`${STORAGE_KEYS.TODOS}_${userId}`);
      localStorage.removeItem(`${STORAGE_KEYS.FOOD}_${userId}`);
      localStorage.removeItem(`${STORAGE_KEYS.WORKOUTS}_${userId}`);
    }
  };

  const value = {
    thoughts,
    showMotivationModal,
    setShowMotivationModal,
    bannerQuote,
    acceptMotivationQuote,
    habits,
    setHabits,
    toggleHabitCompletion,
    addCustomHabit,
    updateHabit,
    addHabitNote,
    deleteHabit,
    todos,
    toggleTodo,
    addTodo,
    deleteTodo,
    foodData,
    addWater,
    addMealItem,
    deleteMealItem,
    logWeight,
    workouts,
    logWorkoutSession,
    addPRRecord,
    addProgressPhoto,
    profile,
    setProfile,
    settings,
    setSettings,
    theme,
    setTheme,
    toggleTheme,
    resetAllData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
