import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Flame,
  CheckCircle2,
  Circle,
  Pencil,
  Check,
  X,
  Trash2,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

export function HabitCard({
  habit,
  todayStr,
  onToggle,
  onEdit,
  onDelete,
}) {
  const { theme } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(habit?.title || habit?.name || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const navigate = useNavigate();

  const isCompletedToday = Boolean(
    habit?.completions && habit.completions[todayStr]
  );

  const streak = habit?.currentStreak !== undefined 
    ? habit.currentStreak 
    : (habit?.streak || 0);

  const handleSaveEdit = (e) => {
    e?.stopPropagation();
    if (editedTitle.trim() && editedTitle !== (habit.title || habit.name)) {
      onEdit?.(habit.id || habit._id, { title: editedTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e) => {
    e?.stopPropagation();
    setEditedTitle(habit?.title || habit?.name || '');
    setIsEditing(false);
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    onDelete?.(habit.id || habit._id);
    setShowConfirmDelete(false);
  };

  return (
    <div
      onClick={() => navigate(`/habit/${habit.id || habit._id}`)}
      className={`group relative rounded-2xl border transition-all duration-300 p-5 cursor-pointer shadow-lg overflow-hidden ${
        theme === 'light'
          ? (isCompletedToday
              ? 'bg-white border-emerald-500/60 shadow-md shadow-emerald-500/5'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-0.5')
          : (isCompletedToday
              ? 'bg-gradient-to-br from-[#121b16] to-[#0d1210] border-emerald-500/40 shadow-emerald-950/20'
              : 'bg-[#121216]/90 border-zinc-800/80 hover:border-zinc-700 hover:shadow-xl hover:-translate-y-0.5')
      }`}
    >
      {/* Accent corner glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20 transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: habit.color || '#6366f1' }}
      />

      <div className="relative z-10">
        {/* Header: Category & Streak */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full ring-2 ring-zinc-800 shrink-0"
              style={{ backgroundColor: habit.color || '#6366f1' }}
            />
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${
              theme === 'light' ? 'text-slate-500' : 'text-zinc-400'
            }`}>
              {habit.category || 'Productivity'}
            </span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-mono text-xs font-bold shadow-sm ${
            theme === 'light'
              ? 'bg-amber-50 border border-amber-200 text-amber-800'
              : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
          }`}>
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{streak}d</span>
          </div>
        </div>

        {/* Title / Inline Edit */}
        <div className="mb-4">
          {isEditing ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                className="flex-1 bg-zinc-950 border border-indigo-500 rounded-xl px-3 py-1.5 text-sm text-zinc-100 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                title="Save"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between group/title">
              <h3 className={`text-base font-bold transition-colors line-clamp-1 ${
                theme === 'light'
                  ? 'text-slate-900 hover:text-indigo-600'
                  : 'text-zinc-100 hover:text-indigo-400'
              }`}>
                {habit.title || habit.name}
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className={`opacity-0 group-hover:opacity-100 p-1 rounded-md transition-opacity ${
                  theme === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Edit Habit Title"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {habit.description && (
            <p className={`text-xs mt-1 line-clamp-1 ${
              theme === 'light' ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              {habit.description}
            </p>
          )}
        </div>

        {/* Schedule & Timing Info */}
        <div className={`flex items-center gap-3 text-xs mb-4 font-mono ${
          theme === 'light' ? 'text-slate-500' : 'text-zinc-500'
        }`}>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{habit.frequency || 'Daily'}</span>
          </div>
          {habit.scheduledTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{habit.scheduledTime}</span>
            </div>
          )}
        </div>

        {/* Footer Actions: Complete Toggle & Delete */}
        <div className={`flex items-center justify-between pt-3 border-t ${
          theme === 'light' ? 'border-slate-100' : 'border-zinc-800/60'
        }`} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(habit.id || habit._id, todayStr);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              isCompletedToday
                ? (theme === 'light'
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-sm shadow-emerald-500/10')
                : (theme === 'light'
                    ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    : 'bg-zinc-800/60 text-zinc-300 border border-zinc-700/60 hover:bg-zinc-800 hover:text-white')
            }`}
          >
            {isCompletedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white fill-white/20" />
                <span>Done</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-400" />
                <span>Mark Done</span>
              </>
            )}
          </button>

          {showConfirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleDelete}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded-lg"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(false);
                }}
                className={`px-2 py-1 text-[10px] rounded-lg ${
                  theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(true);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  : 'text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10'
              }`}
              title="Delete Habit"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HabitCard;