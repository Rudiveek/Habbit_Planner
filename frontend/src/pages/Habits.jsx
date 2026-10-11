import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heatmap } from '../components/Heatmap';
import {
  Target,
  Plus,
  Flame,
  CheckCircle2,
  Circle,
  FileText,
  Trash2
} from 'lucide-react';

function Habits() {
  const { habits, toggleHabitCompletion, addCustomHabit, addHabitNote, deleteHabit } = useApp();
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Personal Growth');
  const [target, setTarget] = useState('30 mins/day');
  const [frequency, setFrequency] = useState('Daily');
  const [color, setColor] = useState('#6366f1');

  const todayStr = new Date().toISOString().split('T')[0];

  const selectedHabit = habits.find(h => h.id === selectedHabitId) || habits[0];

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCustomHabit({ name, category, target, frequency, color });
    setName('');
    setShowAddModal(false);
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedHabit) return;
    addHabitNote(selectedHabit.id, newNoteText);
    setNewNoteText('');
  };

  const getHabitStats = (habit) => {
    if (!habit || !habit.completions) return { total: 0, streak: 0, rate: 0 };
    const total = Object.values(habit.completions).filter(Boolean).length;
    let streak = habit.currentStreak !== undefined ? habit.currentStreak : (habit.streak || 0);
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (habit.completions[dateStr]) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    const rate = Math.round((total / 365) * 100);
    return { total, streak, rate };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <Target className="w-4 h-4" /> Habit Engine
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-100 mt-1">Custom Habits & Performance</h1>
          <p className="text-sm text-zinc-400">Track streaks, log notes, and inspect yearly consistency heatmaps.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Custom Habit
        </button>
      </div>

      {/* Main Grid: Habit Selector List & Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Habits List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">Your Custom Habits</h3>
          {habits.map((h) => {
            const isSelected = h.id === selectedHabit?.id;
            const isCompletedToday = h.completions && h.completions[todayStr];
            const stats = getHabitStats(h);

            return (
              <div
                key={h.id}
                onClick={() => setSelectedHabitId(h.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'bg-[#121216]/80 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHabitCompletion(h.id, todayStr);
                    }}
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    {isCompletedToday ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color || '#6366f1' }} />
                      {h.title || h.name}
                    </h4>
                    <p className="text-xs text-zinc-400">{h.target || 'Daily'} • {h.frequency || 'Daily'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{stats.streak}d</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Habit Inspector */}
        {selectedHabit && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedHabit.color || '#6366f1' }} />
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">{selectedHabit.category || 'Personal'}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-zinc-100 mt-1">{selectedHabit.title || selectedHabit.name}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Target: {selectedHabit.target || 'Daily'} | Schedule: {selectedHabit.frequency || 'Daily'}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabitCompletion(selectedHabit.id, todayStr)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                      selectedHabit.completions && selectedHabit.completions[todayStr]
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {selectedHabit.completions && selectedHabit.completions[todayStr] ? 'Done Today' : 'Mark Done Today'}
                  </button>

                  <button
                    onClick={() => deleteHabit(selectedHabit.id)}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/60">
                <div className="bg-zinc-900/60 rounded-xl p-3.5 border border-zinc-800/60 text-center">
                  <div className="text-[11px] text-zinc-400 uppercase font-semibold">Current Streak</div>
                  <div className="text-xl font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 fill-amber-400" /> {getHabitStats(selectedHabit).streak} Days
                  </div>
                </div>

                <div className="bg-zinc-900/60 rounded-xl p-3.5 border border-zinc-800/60 text-center">
                  <div className="text-[11px] text-zinc-400 uppercase font-semibold">Total Days</div>
                  <div className="text-xl font-black text-indigo-400 mt-1">
                    {getHabitStats(selectedHabit).total} Days
                  </div>
                </div>

                <div className="bg-zinc-900/60 rounded-xl p-3.5 border border-zinc-800/60 text-center">
                  <div className="text-[11px] text-zinc-400 uppercase font-semibold">Yearly Rate</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    {getHabitStats(selectedHabit).rate}%
                  </div>
                </div>
              </div>
            </div>

            <Heatmap
              data={selectedHabit.completions || {}}
              color={selectedHabit.color || '#6366f1'}
              title={`${selectedHabit.title || selectedHabit.name} Consistency Heatmap`}
            />

            <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> Habit Notes & Reflections
                </h3>
                <span className="text-xs text-zinc-500">Log realizations & journal logs</span>
              </div>

              <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder={`Write a note for ${selectedHabit.title || selectedHabit.name}...`}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                >
                  Add Note
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedHabit.notes && selectedHabit.notes.length > 0 ? (
                  selectedHabit.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/60 text-xs">
                      <div className="text-zinc-400 font-mono text-[10px] mb-1">{note.date}</div>
                      <p className="text-zinc-200 leading-relaxed">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic py-2">No notes logged for this habit yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-zinc-100">Create Custom Habit</h3>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Deep Work, Cold Shower..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Target Goal</label>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Habits;