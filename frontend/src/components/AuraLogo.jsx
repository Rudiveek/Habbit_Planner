import React from 'react';
import { useApp } from '../context/AppContext';

/**
 * AuraLogo Component
 * Renders the official Aura Habit OS icon, automatically adapting
 * to Light Mode and Dark Mode backgrounds.
 */
export default function AuraLogo({
  size = 'md',
  className = '',
  forceTheme = null,
  showBadge = false,
  showText = false
}) {
  let activeTheme = 'dark';
  try {
    const appContext = useApp();
    if (appContext && appContext.theme) {
      activeTheme = appContext.theme;
    }
  } catch (e) {
    // Fallback if rendered outside AppProvider
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('light')) {
      activeTheme = 'light';
    }
  }

  const effectiveTheme = forceTheme || activeTheme;
  const logoSrc = effectiveTheme === 'light' ? '/logo-light.png' : '/logo-dark.png';

  const sizeClasses = {
    xs: 'w-6 h-6 rounded-md',
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl'
  };

  const containerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${containerSize} shrink-0 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
          effectiveTheme === 'light'
            ? 'shadow-indigo-500/10 ring-1 ring-slate-200/80 bg-white'
            : 'shadow-indigo-500/25 ring-1 ring-white/10 bg-[#09090b]'
        }`}
      >
        <img
          src={logoSrc}
          alt="Aura Logo"
          className="w-full h-full object-cover select-none pointer-events-none"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AURA
            </span>
            {showBadge && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                Habit OS
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
