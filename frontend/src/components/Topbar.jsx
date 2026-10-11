import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Clock, Bell, Sun, Moon } from 'lucide-react';

export const Topbar = () => {
  const { setShowMotivationModal, profile, theme, toggleTheme } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/80 px-6 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
        <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-300">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-zinc-800 text-indigo-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowMotivationModal(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-zinc-900 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-400 text-xs font-medium transition-all duration-200 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse-slow" />
          <span className="hidden sm:inline">Thought of the Day</span>
        </button>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
          <span className="text-zinc-400">Level {profile.level}</span>
          <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
              style={{ width: `${(profile.xp / profile.xpNextLevel) * 100}%` }}
            />
          </div>
          <span className="text-emerald-400 font-mono text-[11px]">{profile.xp} XP</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-200 shadow-sm"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500 transition-transform hover:-rotate-12" />
          )}
        </button>

        <button className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
