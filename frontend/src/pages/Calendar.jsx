import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Dumbbell,
  Plus,
  Tag,
  Check,
  Flame,
  Clock
} from 'lucide-react';

function CalendarPage() {
  const { habits, workouts, todos, addTodo, toggleTodo } = useApp();

  // Navigation state for month & year
  const [viewDate, setViewDate] = useState(() => new Date());

  // Real-time today string
  const todayActualStr = new Date().toISOString().split('T')[0];

  const [selectedDateStr, setSelectedDateStr] = useState(todayActualStr);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Mindfulness');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleTodayClick = () => {
    const now = new Date();
    setViewDate(now);
    setSelectedDateStr(now.toISOString().split('T')[0]);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTodo(newTaskTitle, newTaskCategory);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const habitsForDate = habits.filter(
    (h) => h.completions && h.completions[selectedDateStr]
  );
  const workoutForDate = workouts.logs.find((w) => w.date === selectedDateStr);
  const todosForDate = todos.filter(
    (t) => t.date === selectedDateStr || !t.date
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <CalendarIcon className="w-4 h-4" /> Integrated Growth Calendar
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-100 mt-1">{monthName}</h1>
          <p className="text-sm text-zinc-400">
            View unified cross-module logs for habits, gym sessions, and scheduled action items.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl p-1 text-xs">
            {['All', 'Habits', 'Fitness', 'Tasks'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleTodayClick}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs font-semibold transition-colors"
          >
            Today
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
            title="Schedule Task"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Month Calendar & Day Log Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
            <h2 className="text-lg font-bold text-zinc-100">{monthName}</h2>
            <div className="flex items-center gap-2 text-zinc-400">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-zinc-500 py-1 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset cells for start of month */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div
                key={`offset-${idx}`}
                className="min-h-[72px] p-2 rounded-2xl border border-transparent bg-transparent"
              />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const mStr = String(month + 1).padStart(2, '0');
              const dStr = String(dayNum).padStart(2, '0');
              const dateStr = `${year}-${mStr}-${dStr}`;

              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === todayActualStr;

              const habitCount = habits.filter(
                (h) => h.completions && h.completions[dateStr]
              ).length;
              const hasWorkout = workouts.logs.some((w) => w.date === dateStr);
              const taskCount = todos.filter((t) => t.date === dateStr).length;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`min-h-[72px] p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/80 shadow-lg shadow-indigo-500/20'
                      : isToday
                      ? 'bg-zinc-900 border-indigo-400/50 shadow-sm'
                      : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'text-indigo-400 font-extrabold'
                          : isSelected
                          ? 'text-white'
                          : 'text-zinc-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ring-2 ring-indigo-500/30 animate-pulse" />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {(filterCategory === 'All' || filterCategory === 'Habits') &&
                      habitCount > 0 && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-1.5 py-0.5 rounded-md border border-indigo-500/30">
                          {habitCount} H
                        </span>
                      )}
                    {(filterCategory === 'All' || filterCategory === 'Fitness') &&
                      hasWorkout && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                          Gym
                        </span>
                      )}
                    {(filterCategory === 'All' || filterCategory === 'Tasks') &&
                      taskCount > 0 && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded-md border border-amber-500/30">
                          {taskCount} T
                        </span>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Activity Drawer */}
        <div className="lg:col-span-1 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Date Inspector
            </div>
            <h3 className="text-2xl font-black text-zinc-100 mt-1">{selectedDateStr}</h3>
            <p className="text-xs text-zinc-400">All registered activities and tasks for this date.</p>
          </div>

          {(filterCategory === 'All' || filterCategory === 'Habits') && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Completed Habits ({habitsForDate.length})
              </h4>
              {habitsForDate.length > 0 ? (
                <div className="space-y-1.5">
                  {habitsForDate.map((h) => (
                    <div
                      key={h.id || h._id}
                      className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-200 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: h.color || '#6366f1' }}
                        />
                        {h.title || h.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {h.target || 'Daily'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic p-3 rounded-xl bg-zinc-950/40 border border-zinc-900">
                  No habits completed on this date.
                </p>
              )}
            </div>
          )}

          {(filterCategory === 'All' || filterCategory === 'Fitness') && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-emerald-400" /> Fitness Routine
              </h4>
              {workoutForDate ? (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                  <div className="font-bold">{workoutForDate.planName}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    {workoutForDate.durationMins} mins • {workoutForDate.caloriesBurned} kcal burned
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic p-3 rounded-xl bg-zinc-950/40 border border-zinc-900">
                  Rest day / No workout recorded.
                </p>
              )}
            </div>
          )}

          {(filterCategory === 'All' || filterCategory === 'Tasks') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-amber-400" /> Action Items
                </h4>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  + Add
                </button>
              </div>

              {todosForDate.length > 0 ? (
                <div className="space-y-1.5">
                  {todosForDate.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTodo(t.id)}
                      className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {t.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-500 shrink-0" />
                        )}
                        <span className={t.completed ? 'line-through text-zinc-500' : ''}>
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-mono">
                        {t.category}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic p-3 rounded-xl bg-zinc-950/40 border border-zinc-900">
                  No action items scheduled.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-zinc-100">Schedule Task for {selectedDateStr}</h3>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Task Description
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Weekly Retrospective..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Growth">Growth</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
