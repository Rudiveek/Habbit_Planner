import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Heatmap } from '../components/Heatmap';
import HabitCard from '../components/HabitCard';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Flame,
  Target,
  Dumbbell,
  Utensils,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ListTodo,
  Layers
} from 'lucide-react';

function Dashboard() {
  const {
    theme,
    bannerQuote,
    habits,
    toggleHabitCompletion,
    updateHabit,
    deleteHabit,
    todos,
    toggleTodo,
    addTodo,
    deleteTodo,
    foodData,
  } = useApp();

  const { user } = useAuth();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('Mindfulness');

  // Real-time local date string
  const todayStr = new Date().toISOString().split('T')[0];

  const totalHabitsToday = habits.length;
  const completedHabitsToday = habits.filter(
    (h) => h.completions && h.completions[todayStr]
  ).length;
  const habitPercentage =
    totalHabitsToday > 0
      ? Math.round((completedHabitsToday / totalHabitsToday) * 100)
      : 0;

  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const todoPercentage =
    totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const overallDailyScore = Math.round(
    habitPercentage * 0.6 + todoPercentage * 0.4
  );

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const heatmapData = {};
  habits.forEach((h) => {
    if (h.completions) {
      Object.keys(h.completions).forEach((d) => {
        heatmapData[d] = (heatmapData[d] || 0) + 1;
      });
    }
  });

  const handleAddTodoSubmit = (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    addTodo(newTodoTitle, newTodoCategory);
    setNewTodoTitle('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Greeting & Motivation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Overview Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight mt-1">
            {greeting}, {user?.name ? user.name.split(' ')[0] : 'Achiever'}
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            You've completed {completedHabitsToday} of {totalHabitsToday} habits today. Keep the momentum going!
          </p>
        </div>

        <Link
          to="/habits"
          className="px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 text-xs font-semibold flex items-center gap-2 self-start sm:self-center transition-all"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Manage Habits</span>
        </Link>
      </div>

      {bannerQuote && (
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 ${
          theme === 'light'
            ? 'bg-white border border-slate-200/80 shadow-slate-200/50'
            : 'bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-zinc-900 border border-indigo-500/30'
        }`}>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${
                theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
              }`}>
                <Sparkles className="w-4 h-4" /> Active Mindset Banner
              </div>
              <blockquote className={`text-xl sm:text-2xl font-extrabold italic tracking-tight leading-snug ${
                theme === 'light' ? 'text-slate-900' : 'text-zinc-100'
              }`}>
                "{bannerQuote.quote}"
              </blockquote>
              <p className={`text-sm font-semibold ${
                theme === 'light' ? 'text-slate-600' : 'text-indigo-300'
              }`}>
                — {bannerQuote.author}{' '}
                <span className={`text-xs ${
                  theme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                }`}>({bannerQuote.category})</span>
              </p>
            </div>
            <div className={`shrink-0 rounded-2xl px-5 py-3 text-center ${
              theme === 'light'
                ? 'bg-slate-50 border border-slate-200 shadow-sm'
                : 'bg-indigo-600/20 border border-indigo-500/30'
            }`}>
              <div className={`text-xs font-medium ${
                theme === 'light' ? 'text-slate-500' : 'text-zinc-400'
              }`}>Daily Streak</div>
              <div className={`text-2xl font-black flex items-center justify-center gap-1 ${
                theme === 'light' ? 'text-slate-900' : 'text-indigo-400'
              }`}>
                <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
                <span>
                  {habits.length > 0
                    ? Math.max(...habits.map((h) => h.currentStreak || h.streak || 0))
                    : 0}{' '}
                  Days
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Ring Card */}
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl">
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Today's Score
            </div>
            <div className="text-3xl font-black text-zinc-100 mt-1">{overallDailyScore}%</div>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Calculated daily
            </div>
          </div>
          {/* SVG Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${overallDailyScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-indigo-400">
              {overallDailyScore}%
            </span>
          </div>
        </div>

        {/* Habits Stat */}
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl">
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Habits Done
            </div>
            <div className="text-3xl font-black text-zinc-100 mt-1">
              {completedHabitsToday} / {totalHabitsToday}
            </div>
            <div className="text-xs text-indigo-400 font-medium mt-1">
              {habitPercentage}% completed
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Workout Stat */}
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl">
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Workout Session
            </div>
            <div className="text-lg font-bold text-zinc-100 mt-1 truncate max-w-[140px]">
              Push Routine
            </div>
            <div className="text-xs text-emerald-400 font-medium mt-1">Completed • 520 kcal</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Dumbbell className="w-6 h-6" />
          </div>
        </div>

        {/* Nutrition Stat */}
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl">
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Calories & Water
            </div>
            <div className="text-lg font-bold text-zinc-100 mt-1">1,965 / 2,600 kcal</div>
            <div className="text-xs text-cyan-400 font-medium mt-1">
              {foodData.waterCurrentMl} / {foodData.waterTargetMl} ml Water
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Utensils className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Today's Habit Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" /> Today's Habit Routines
            </h2>
            <p className="text-xs text-zinc-400">Mark complete or edit inline to sync with backend</p>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-xl">
            {completedHabitsToday} of {totalHabitsToday} Finished
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id || habit._id}
              habit={habit}
              todayStr={todayStr}
              onToggle={toggleHabitCompletion}
              onEdit={updateHabit}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      </div>

      {/* 4. Middle Section: Current Activity Card + Today's Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Activity Card */}
        <div className="lg:col-span-1 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 animate-pulse" /> Active Focus
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                In Progress
              </span>
            </div>

            <h3 className="text-xl font-bold text-zinc-100 mb-2">Deep Work & System Coding</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Building Personal Growth Platform components. Tracking habits, streaks, and productivity.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Session Duration</span>
                <span className="font-mono text-zinc-200">1h 45m / 2h 00m</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[85%]" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Next Scheduled</span>
            <span className="text-indigo-400 font-semibold flex items-center gap-1">
              Evening Reflection (09:30 PM) <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Today's Action Items */}
        <div className="lg:col-span-2 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-indigo-400" /> Today's Action Items
                </h3>
                <p className="text-xs text-zinc-400">Stay accountable with daily priorities</p>
              </div>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                {completedTodos} / {totalTodos} Done
              </span>
            </div>

            <form onSubmit={handleAddTodoSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="Add a new action item..."
                className="flex-1 bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <select
                value={newTodoCategory}
                onChange={(e) => setNewTodoCategory(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 focus:outline-none"
              >
                <option value="Mindfulness">Mindfulness</option>
                <option value="Fitness">Fitness</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Growth">Growth</option>
                <option value="Mind">Mind</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {todos.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                    t.completed
                      ? 'bg-zinc-900/40 border-zinc-800/40 opacity-60'
                      : 'bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTodo(t.id)}
                      className="text-zinc-400 hover:text-indigo-400 transition-colors"
                    >
                      {t.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <span
                      className={`text-sm font-medium ${
                        t.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-mono">
                      {t.category}
                    </span>
                    <button
                      onClick={() => deleteTodo(t.id)}
                      className="text-zinc-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Year Heatmap Section */}
      <Heatmap data={heatmapData} title="Year Activity & Habit Consistency Heatmap" />
    </div>
  );
}

export default Dashboard;