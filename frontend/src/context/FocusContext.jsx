import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import soundService from '../services/soundService';
import { useApp } from './AppContext';

const FocusContext = createContext();

export const FOCUS_PRESETS = {
  pomodoro: { name: 'Pomodoro', duration: 25 * 60, type: 'focus' },
  deepWork: { name: 'Deep Focus', duration: 50 * 60, type: 'focus' },
  shortBreak: { name: 'Short Break', duration: 5 * 60, type: 'break' },
  longBreak: { name: 'Long Break', duration: 15 * 60, type: 'break' },
  stopwatch: { name: 'Open Stopwatch', duration: 0, type: 'stopwatch' },
};

export const FocusProvider = ({ children }) => {
  const { habits, toggleHabitCompletion, setProfile } = useApp();

  const [mode, setMode] = useState('pomodoro');
  const [duration, setDuration] = useState(FOCUS_PRESETS.pomodoro.duration);
  const [timeLeft, setTimeLeft] = useState(FOCUS_PRESETS.pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [linkedHabitId, setLinkedHabitId] = useState('');
  const [ambientSound, setAmbientSound] = useState('none');
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [showCelebration, setShowCelebration] = useState(false);

  // Local storage history
  const [sessionHistory, setSessionHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_focus_sessions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const timerRef = useRef(null);

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (mode === 'stopwatch') {
            return prev + 1;
          }
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  // Ambient sound management
  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      soundService.startAmbient(ambientSound, ambientVolume);
    } else {
      soundService.stopAmbient();
    }
    return () => soundService.stopAmbient();
  }, [isRunning, ambientSound, ambientVolume]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    soundService.stopAmbient();
    soundService.playCompletionChime();
    setShowCelebration(true);

    const todayStr = new Date().toISOString().split('T')[0];
    const habit = habits.find((h) => (h.id || h._id) === linkedHabitId);
    const habitTitle = habit ? (habit.title || habit.name) : null;

    // Award XP
    setProfile((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 30,
    }));

    // If linked to a habit, register completion for today
    if (linkedHabitId && habit) {
      if (!habit.completions || !habit.completions[todayStr]) {
        toggleHabitCompletion(linkedHabitId, todayStr);
      }
    }

    const sessionRecord = {
      id: Date.now(),
      mode,
      durationMinutes: Math.max(1, Math.round(duration / 60)),
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: todayStr,
      habitTitle: habitTitle || 'Unassigned Session',
    };

    setSessionHistory((prev) => {
      const updated = [sessionRecord, ...prev].slice(0, 50);
      try {
        localStorage.setItem('aura_focus_sessions_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setTimeout(() => {
      setShowCelebration(false);
    }, 5000);
  };

  const switchMode = (newMode, customSec = null) => {
    setIsRunning(false);
    setMode(newMode);
    const targetDuration = customSec !== null ? customSec : FOCUS_PRESETS[newMode]?.duration || 1500;
    setDuration(targetDuration);
    setTimeLeft(newMode === 'stopwatch' ? 0 : targetDuration);
  };

  const startTimer = () => {
    soundService.init();
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'stopwatch' ? 0 : duration);
  };

  const currentHabit = habits.find((h) => (h.id || h._id) === linkedHabitId);

  const totalMinutesFocusedToday = sessionHistory
    .filter((s) => s.date === new Date().toISOString().split('T')[0])
    .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

  const value = {
    mode,
    duration,
    timeLeft,
    isRunning,
    linkedHabitId,
    setLinkedHabitId,
    currentHabit,
    ambientSound,
    setAmbientSound,
    ambientVolume,
    setAmbientVolume,
    showCelebration,
    setShowCelebration,
    sessionHistory,
    totalMinutesFocusedToday,
    switchMode,
    startTimer,
    pauseTimer,
    resetTimer,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

export default FocusContext;
