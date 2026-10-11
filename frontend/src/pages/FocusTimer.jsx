import React, { useState } from 'react';
import { useFocus, FOCUS_PRESETS } from '../context/FocusContext';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Target,
  Maximize2,
  Minimize2,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  Coffee,
  Brain,
  Sliders,
  Check
} from 'lucide-react';

function FocusTimer() {
  const {
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
    sessionHistory,
    totalMinutesFocusedToday,
    switchMode,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useFocus();

  const { habits } = useApp();
  const [zenMode, setZenMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate percentage for circular progress ring
  const progressPercent = mode === 'stopwatch'
    ? Math.min(100, (timeLeft / 3600) * 100)
    : Math.max(0, Math.min(100, ((duration - timeLeft) / duration) * 100));

  const strokeDashoffset = 100 - progressPercent;

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setAmbientVolume(val);
    if (val > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setAmbientVolume(0.3);
      setIsMuted(false);
    } else {
      setAmbientVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className={`space-y-8 max-w-5xl mx-auto transition-all duration-300 ${zenMode ? 'fixed inset-0 z-50 p-6 md:p-12 overflow-y-auto bg-slate-50 text-slate-900' : ''}`}>
      {/* 1. Header & Quick Stats */}
      {!zenMode && (
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Brain className="w-4 h-4" /> Focus & Pomodoro Engine
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-100 mt-1">Deep Work Session Hub</h1>
            <p className="text-sm text-zinc-400">Time-block your habit routines with ambient acoustic resonance and flow states.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-zinc-400">Focused Today:</span>
              <strong className="text-zinc-100 font-mono text-sm">{totalMinutesFocusedToday} mins</strong>
            </div>

            <button
              onClick={() => setZenMode(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Enter Fullscreen Zen Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zen Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Zen Mode Exit Button */}
      {zenMode && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Immersive Flow State Active</span>
          </div>
          <button
            onClick={() => setZenMode(false)}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Minimize2 className="w-4 h-4" /> Exit Zen Mode
          </button>
        </div>
      )}

      {/* 2. Main Focus Console Card */}
      <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Preset Mode Selection Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {Object.entries(FOCUS_PRESETS).map(([key, config]) => {
            const isSelected = mode === key;
            return (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800/80'
                }`}
              >
                {key === 'pomodoro' && <Brain className="w-3.5 h-3.5" />}
                {key === 'deepWork' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                {(key === 'shortBreak' || key === 'longBreak') && <Coffee className="w-3.5 h-3.5 text-emerald-400" />}
                {key === 'stopwatch' && <Clock className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{config.name}</span>
                {config.duration > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-indigo-700' : 'bg-zinc-800 text-zinc-500'}`}>
                    {config.duration / 60}m
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Central Circular Progress Timer */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-zinc-800/80"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className={`${
                  mode === 'shortBreak' || mode === 'longBreak'
                    ? 'text-emerald-500'
                    : 'text-indigo-500'
                } transition-all duration-1000 ease-linear`}
                strokeWidth="4.5"
                strokeDasharray="264"
                strokeDashoffset={(strokeDashoffset * 264) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-1">
                {currentHabit ? (currentHabit.title || currentHabit.name) : FOCUS_PRESETS[mode]?.name}
              </span>
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-zinc-100">
                {timeFormatted}
              </span>
              <span className="text-xs text-zinc-400 mt-2 font-medium flex items-center gap-1">
                {isRunning ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Session Running
                  </>
                ) : (
                  <>Ready to Focus</>
                )}
              </span>
            </div>
          </div>

          {/* Timer Playback Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={resetTimer}
              className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-sm"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {isRunning ? (
              <button
                onClick={pauseTimer}
                className="px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-base shadow-xl shadow-amber-600/25 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
              >
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause Session</span>
              </button>
            ) : (
              <button
                onClick={startTimer}
                className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Link Habit & Soundscapes Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/80">
          {/* Habit Linker Box */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" /> Link to Habit
              </span>
              {linkedHabitId && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  +30 XP on Complete
                </span>
              )}
            </div>

            <select
              value={linkedHabitId}
              onChange={(e) => setLinkedHabitId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">No linked habit (Free session)</option>
              {habits.map((h) => (
                <option key={h.id || h._id} value={h.id || h._id}>
                  {h.title || h.name} ({h.category || 'Routine'})
                </option>
              ))}
            </select>

            <p className="text-[11px] text-zinc-400">
              When this session completes, progress is automatically recorded for your selected habit.
            </p>
          </div>

          {/* Ambient Soundscape Box */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" /> Ambient Soundscape
              </span>
              <button
                onClick={toggleMute}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isMuted ? 'Muted' : `${Math.round(ambientVolume * 100)}%`}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAmbientSound('none')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  ambientSound === 'none'
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Off
              </button>
              <button
                onClick={() => setAmbientSound('rain')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  ambientSound === 'rain'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🌧️ Rain
              </button>
              <button
                onClick={() => setAmbientSound('waves')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  ambientSound === 'waves'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🌊 Alpha
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-zinc-500 font-mono">Vol</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Completion Milestone Notification Banner */}
      {showCelebration && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-zinc-900 border border-emerald-500/50 rounded-3xl p-6 shadow-2xl animate-fade-in flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Session Completed! 🎉 <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">+30 XP</span>
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Awesome momentum! Your focus block has been logged and synchronized.
              </p>
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
        </div>
      )}

      {/* 5. Recent Completed Focus Sessions Log */}
      {!zenMode && (
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" /> Focus Session History
              </h3>
              <p className="text-xs text-zinc-400">Completed deep work intervals recorded today</p>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-xl">
              {sessionHistory.length} Total Sessions
            </span>
          </div>

          {sessionHistory.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl">
              <Brain className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-zinc-400 font-medium">No sessions logged yet today.</p>
              <p className="text-[11px] text-zinc-500 mt-1">Start a 25-minute Pomodoro session above to build your daily log.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sessionHistory.slice(0, 6).map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/70 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-zinc-200">{s.habitTitle}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {s.date} • {s.completedAt}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold font-mono text-[11px]">
                      {s.durationMinutes}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FocusTimer;
