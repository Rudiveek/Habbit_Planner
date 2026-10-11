import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFocus } from '../context/FocusContext';
import { Play, Pause, Maximize2, Flame, Volume2 } from 'lucide-react';

export const FloatingTimerWidget = () => {
  const { timeLeft, isRunning, mode, currentHabit, startTimer, pauseTimer, ambientSound } = useFocus();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide widget if user is already on the dedicated /focus page, or if timer isn't running and has not started
  if (location.pathname === '/focus' || (!isRunning && timeLeft === 0)) {
    return null;
  }

  // Only show if running or active session in progress
  if (!isRunning && timeLeft === 25 * 60) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-slide-up select-none">
      <div className="bg-[#121216]/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5 ring-1 ring-white/10 hover:border-indigo-400 transition-all duration-200">
        <button
          onClick={() => navigate('/focus')}
          className="flex items-center gap-2.5 text-left group"
          title="Open Focus Zen Mode"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-indigo-400/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black font-mono tracking-tight text-white">
                {timeFormatted}
              </span>
              {ambientSound !== 'none' && (
                <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              )}
            </div>
            <p className="text-[10px] font-medium text-zinc-400 truncate max-w-[120px]">
              {currentHabit ? (currentHabit.title || currentHabit.name) : mode}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1 border-l border-zinc-800 pl-2">
          {isRunning ? (
            <button
              onClick={pauseTimer}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              title="Pause Session"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              title="Resume Session"
            >
              <Play className="w-4 h-4 fill-white" />
            </button>
          )}

          <button
            onClick={() => navigate('/focus')}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Expand Full Focus Page"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingTimerWidget;
