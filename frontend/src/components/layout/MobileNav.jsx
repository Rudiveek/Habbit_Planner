import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Target,
  Timer,
  Calendar,
  MoreHorizontal,
  Apple,
  Dumbbell,
  BarChart3,
  User,
  Settings,
  LogOut,
  X,
  Sparkles
} from 'lucide-react';

const primaryTabs = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Habits', path: '/habits', icon: Target },
  { name: 'Focus', path: '/focus', icon: Timer },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
];

const drawerLinks = [
  { name: 'Food & Nutrition', path: '/food', icon: Apple, color: 'text-emerald-400' },
  { name: 'Physical Fitness', path: '/fitness', icon: Dumbbell, color: 'text-amber-400' },
  { name: 'Analytics & Streaks', path: '/progress', icon: BarChart3, color: 'text-indigo-400' },
  { name: 'Profile & Level', path: '/profile', icon: User, color: 'text-purple-400' },
  { name: 'Settings', path: '/settings', icon: Settings, color: 'text-zinc-400' },
];

export default function MobileNav() {
  const { user, logout } = useAuth();
  const { theme } = useApp();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
    navigate('/');
  };

  const handleNavigate = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* 1. Mobile Bottom Navigation Bar */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 transition-colors duration-200 ${
          theme === 'light'
            ? 'bg-white/95 border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'
            : 'bg-[#09090b]/95 border-zinc-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]'
        }`}
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? theme === 'light'
                        ? 'text-indigo-600 bg-indigo-50 font-bold scale-105'
                        : 'text-indigo-400 bg-indigo-500/15 font-bold scale-105'
                      : theme === 'light'
                      ? 'text-slate-500 hover:text-slate-900 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 font-medium'
                  }`
                }
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] tracking-tight">{tab.name}</span>
              </NavLink>
            );
          })}

          {/* More / Menu Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
              drawerOpen
                ? theme === 'light'
                  ? 'text-indigo-600 bg-indigo-50 font-bold'
                  : 'text-indigo-400 bg-indigo-500/15 font-bold'
                : theme === 'light'
                ? 'text-slate-500 hover:text-slate-900 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* 2. Slide-up Mobile Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Sheet */}
          <div
            className={`relative z-10 rounded-t-3xl border-t p-6 pb-8 transition-transform transform duration-300 max-h-[85vh] overflow-y-auto ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-900 shadow-2xl'
                : 'bg-[#121216] border-zinc-800 text-zinc-100 shadow-2xl'
            }`}
          >
            {/* Drawer Handle */}
            <div className="w-12 h-1.5 rounded-full bg-zinc-600/40 mx-auto mb-4" />

            {/* Header & User Card */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/40 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 shadow-md">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt={user?.name || "User"}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold truncate max-w-[180px]">{user?.name || "Aura Member"}</h3>
                  <p className="text-xs text-indigo-400 font-mono truncate max-w-[180px]">{user?.email || "Pro Plan"}</p>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="space-y-1.5 mb-6">
              {drawerLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-colors ${
                      theme === 'light'
                        ? 'hover:bg-slate-100 text-slate-700'
                        : 'hover:bg-zinc-800/60 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-zinc-800/40 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">→</span>
                  </button>
                );
              })}
            </div>

            {/* Log Out Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-sm border border-rose-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Aura</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
