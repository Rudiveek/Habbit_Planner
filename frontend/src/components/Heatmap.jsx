import React from 'react';

export const Heatmap = ({ data = {}, color = '#6366f1', title = 'Activity Heatmap' }) => {
  const today = new Date('2026-07-31');
  const days = [];

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const val = data[dateStr] ? (typeof data[dateStr] === 'number' ? data[dateStr] : 1) : 0;
    days.push({ date: dateStr, count: val });
  }

  const weeks = [];
  let currentWeek = [];
  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getColorClass = (count) => {
    if (!count) return 'bg-zinc-900 border border-zinc-800/80';
    if (count === 1) return 'bg-indigo-950/80 border border-indigo-700/60 shadow-[0_0_8px_rgba(99,102,241,0.2)]';
    if (count === 2) return 'bg-indigo-700/80 border border-indigo-500/80 shadow-[0_0_10px_rgba(99,102,241,0.4)]';
    if (count === 3) return 'bg-indigo-500 border border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]';
    return 'bg-emerald-400 border border-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.8)]';
  };

  const totalCompletions = Object.values(data).filter(Boolean).length;

  return (
    <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 tracking-wide">{title}</h3>
          <p className="text-xs text-zinc-400">Past 365 Days • <span className="text-indigo-400 font-medium">{totalCompletions} total active days</span></p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-sm bg-indigo-950/80 border border-indigo-700/60" />
          <div className="w-2.5 h-2.5 rounded-sm bg-indigo-700/80 border border-indigo-500/80" />
          <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 border border-indigo-400" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-300" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex gap-1 min-w-[700px]">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count > 0 ? 'Active' : 'No Activity'}`}
                  className={`w-2.5 h-2.5 rounded-sm transition-all duration-150 hover:scale-125 cursor-pointer ${getColorClass(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
