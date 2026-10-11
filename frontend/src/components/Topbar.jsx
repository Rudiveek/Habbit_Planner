import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AuraLogo from './AuraLogo';
import { Sparkles, Calendar, Clock, Bell, Sun, Moon, User } from 'lucide-react';

export const Topbar = () => {
  const { setShowMotivationModal, profile, theme, toggleTheme } = useApp();
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formattedFullDate = time.toLocaleDateString('en-US', {
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
    <header
      className={`sticky top-0 z-30 h-16 backdrop-blur-xl border-b px-4 sm:px-6 flex items-center justify-between transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-white/85 border-slate-200/80 text-slate-800'
          : 'bg-[#09090b]/80 border-zinc-800/80 text-zinc-100'
      }`}
    >
      {/* Left: Mobile Brand Logo OR Desktop Date & Time */}
      <div className="flex items-center gap-3">
        {/* Mobile Brand (visible only on mobile) */}
        <div className="flex md:hidden items-center gap-2">
          <AuraLogo size="xs" />
          <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AURA
          </span>
        </div>

        {/* Desktop Date & Time Badges (hidden on small phone screens) */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs font-medium">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              theme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">{formattedFullDate}</span>
            <span className="md:hidden">{formattedDate}</span>
          </div>

          <div
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono ${
              theme === 'light'
                ? 'bg-slate-50 border-slate-200 text-indigo-600'
                : 'bg-zinc-900/80 border-zinc-800 text-indigo-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions & Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Thought of the Day Button */}
        <button
          onClick={() => setShowMotivationModal(true)}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 shadow-sm ${
            theme === 'light'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              : 'bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-zinc-900 border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-400'
          }`}
          title="Daily Inspiration Quote"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse-slow" />
          <span className="hidden sm:inline">Thought of the Day</span>
        </button>

        {/* Level XP (Desktop only) */}
        <div
          className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl border text-xs ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-600'
              : 'bg-zinc-900/80 border-zinc-800 text-zinc-400'
          }`}
        >
          <span>Level {profile?.level || 1}</span>
          <div className="w-14 h-1.5 bg-zinc-700/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
              style={{ width: `${((profile?.xp || 120) / (profile?.xpNextLevel || 300)) * 100}%` }}
            />
          </div>
          <span className="text-emerald-500 font-mono text-[11px]">{profile?.xp || 120} XP</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all duration-200 shadow-sm ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-200 text-indigo-600 hover:bg-slate-100'
              : 'bg-zinc-900/80 border-zinc-800 text-amber-400 hover:text-amber-300'
          }`}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* User Profile Avatar Link (on mobile) */}
        <Link
          to="/profile"
          className="md:hidden w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 shrink-0 shadow-sm"
        >
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
            alt={user?.name || "User"}
            className="w-full h-full object-cover rounded-[10px]"
          />
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
