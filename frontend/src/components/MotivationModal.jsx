import React from 'react';
import { useApp } from '../context/AppContext';
import { Quote, Sparkles, Rocket } from 'lucide-react';

export const MotivationModal = () => {
  const { showMotivationModal, thoughts, acceptMotivationQuote } = useApp();

  if (!showMotivationModal) return null;

  const todayQuote = thoughts[Math.floor(Math.sin(new Date().getDate()) * thoughts.length + thoughts.length) % thoughts.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121216] border border-indigo-500/30 rounded-3xl p-8 shadow-2xl shadow-indigo-500/20 overflow-hidden text-center">
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-6 shadow-inner">
            <Quote className="w-7 h-7 animate-pulse-slow" />
          </div>

          <span className="block text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Thought of the Day
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 leading-snug italic mb-4">
            "{todayQuote.quote}"
          </h2>

          <p className="text-sm font-medium text-zinc-400 mb-8">
            — {todayQuote.author} <span className="text-zinc-600 text-xs font-normal">({todayQuote.category})</span>
          </p>

          <button
            onClick={() => acceptMotivationQuote(todayQuote)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>Let's Go</span>
            <Rocket className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
