import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Heatmap } from '../components/Heatmap';
import analyticsService from '../services/analyticsService';
import {
  BarChart3,
  TrendingUp,
  Target,
  Utensils,
  Dumbbell,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function Progress() {
  const { habits, foodData, workouts } = useApp();
  const [timeframe, setTimeframe] = useState('Weekly');
  const [moduleFilter, setModuleFilter] = useState('Overall');
  const [weeklyTrend, setWeeklyTrend] = useState([]);

  // Fetch backend weekly analytics if available
  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('aura_token');
      if (token) {
        try {
          const res = await analyticsService.getWeeklyTrend();
          if (res?.data && res.data.length > 0) {
            setWeeklyTrend(res.data);
          }
        } catch (err) {
          console.warn('[Progress] Weekly analytics fallback to local:', err.message);
        }
      }
    };
    fetchAnalytics();
  }, []);

  // Compute habit completion rates
  const habitCompletionRates = habits.map((h) => {
    const completions = h.completions || {};
    const count = Object.values(completions).filter(Boolean).length;
    const streak = h.currentStreak !== undefined ? h.currentStreak : (h.streak || 0);
    const longest = h.longestStreak !== undefined ? h.longestStreak : streak;
    return {
      name: h.title || h.name,
      rate: Math.min(100, Math.round((count / 365) * 100)),
      color: h.color || '#6366f1',
      streak,
      longest,
      category: h.category || 'Productivity',
    };
  });

  const avgHabitRate = Math.round(
    habitCompletionRates.reduce((acc, curr) => acc + curr.rate, 0) /
      (habitCompletionRates.length || 1)
  );

  const maxStreak = habits.length > 0
    ? Math.max(...habits.map((h) => h.currentStreak || h.streak || 0))
    : 0;

  const totalCompletionsAcrossHabits = habits.reduce((acc, h) => {
    return acc + Object.keys(h.completions || {}).length;
  }, 0);

  // Generate fallback 7-day trend if backend trend isn't loaded yet
  const displayWeeklyTrend = weeklyTrend.length > 0
    ? weeklyTrend
    : Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
        const dateStr = d.toISOString().split('T')[0];
        const completedCount = habits.filter((h) => h.completions && h.completions[dateStr]).length;
        const rate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
        return {
          day: dayName,
          date: dateStr,
          rate,
          completed: completedCount,
          scheduled: habits.length,
        };
      });

  const heatmapData = {};
  habits.forEach((h) => {
    if (h.completions) {
      Object.keys(h.completions).forEach((d) => {
        heatmapData[d] = (heatmapData[d] || 0) + 1;
      });
    }
  });

  const weightPoints = foodData.weightHistory || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <BarChart3 className="w-4 h-4" /> Growth Intelligence & Analytics
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-100 mt-1">
            Consistency & Progress Dashboard
          </h1>
          <p className="text-sm text-zinc-400">
            Deep analytics across habits, streak milestones, and weekly momentum.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-1 text-xs">
            {['Overall', 'Habits', 'Food', 'Workouts'].map((m) => (
              <button
                key={m}
                onClick={() => setModuleFilter(m)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  moduleFilter === m
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-1 text-xs">
            {['Weekly', 'Monthly', 'Yearly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  timeframe === tf
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Highest Active Streak
          </div>
          <div className="text-3xl font-black text-amber-400 mt-1 flex items-center gap-2">
            <Flame className="w-7 h-7 fill-amber-400" />
            <span>{maxStreak} Days</span>
          </div>
          <div className="text-xs text-amber-400/80 font-medium mt-1">
            Consistency Milestone Active
          </div>
        </div>

        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Habit Consistency
          </div>
          <div className="text-3xl font-black text-indigo-400 mt-1">{avgHabitRate}%</div>
          <div className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Calculated across active routines
          </div>
        </div>

        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Total Check-ins Logged
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            {totalCompletionsAcrossHabits}
          </div>
          <div className="text-xs text-zinc-400 font-medium mt-1">
            Cumulative across all habits
          </div>
        </div>

        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Body Weight
          </div>
          <div className="text-3xl font-black text-zinc-100 mt-1">
            {foodData.currentWeightKg || 78.4} kg
          </div>
          <div className="text-xs text-cyan-400 font-medium mt-1">
            Target: 76.0 kg (-2.4 kg left)
          </div>
        </div>
      </div>

      {/* LeetCode-style Streak Milestones Bar */}
      <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-zinc-100">Streak Tier Milestones (LeetCode Style)</h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">Current: {maxStreak} Days</span>
        </div>

        {/* Milestone Bar */}
        <div className="space-y-2">
          <div className="w-full h-3.5 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800 flex items-center">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 transition-all duration-1000 shadow-md"
              style={{ width: `${Math.min(100, Math.max(5, (maxStreak / 30) * 100))}%` }}
            />
          </div>

          <div className="grid grid-cols-4 text-center pt-2">
            <div className="flex flex-col items-center">
              <span className={`text-xs font-bold ${maxStreak >= 3 ? 'text-amber-400' : 'text-zinc-600'}`}>
                3 Days
              </span>
              <span className="text-[10px] text-zinc-500">Spark</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-xs font-bold ${maxStreak >= 7 ? 'text-amber-400' : 'text-zinc-600'}`}>
                7 Days
              </span>
              <span className="text-[10px] text-zinc-500">Bronze</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-xs font-bold ${maxStreak >= 14 ? 'text-amber-400' : 'text-zinc-600'}`}>
                14 Days
              </span>
              <span className="text-[10px] text-zinc-500">Silver</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-xs font-bold ${maxStreak >= 30 ? 'text-amber-400' : 'text-zinc-600'}`}>
                30 Days
              </span>
              <span className="text-[10px] text-zinc-500">Gold Master</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Interactive Weekly Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Past 7 Days Completion Velocity
                </h3>
                <p className="text-xs text-zinc-400">Daily completion percentage across scheduled habits</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                Weekly Active
              </span>
            </div>

            <div className="h-48 flex items-end gap-3 pt-6 pb-2 border-b border-zinc-800">
              {displayWeeklyTrend.map((dayItem, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {dayItem.rate}%
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-700 via-indigo-600 to-purple-500 rounded-t-xl transition-all duration-500 hover:from-indigo-600 hover:to-purple-400 min-h-[8px]"
                    style={{ height: `${Math.max(6, dayItem.rate)}%` }}
                  />
                  <div className="text-[11px] font-bold text-zinc-400 uppercase">
                    {dayItem.day}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-zinc-500">
            <span>Minimum: 0%</span>
            <span>Optimal Target: 80%+ consistency</span>
            <span>Maximum: 100%</span>
          </div>
        </div>

        {/* Overall Completion Ratio Donut/Stats Card */}
        <div className="lg:col-span-1 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100 mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Completion Ratio
            </h3>
            <p className="text-xs text-zinc-400 mb-6">Completed vs Pending today</p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Scheduled Today</span>
                <span className="text-base font-bold text-zinc-200">{habits.length} Habits</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs text-emerald-300">Marked Completed</span>
                <span className="text-base font-bold text-emerald-400">
                  {habits.filter((h) => h.completions && h.completions[new Date().toISOString().split('T')[0]]).length} Habits
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                <span className="text-xs text-indigo-300">Pending Actions</span>
                <span className="text-base font-bold text-indigo-400">
                  {habits.length - habits.filter((h) => h.completions && h.completions[new Date().toISOString().split('T')[0]]).length} Habits
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <span className="text-[11px] text-zinc-500">
              Updated automatically upon daily check-in
            </span>
          </div>
        </div>
      </div>

      {/* Habit Breakdown Section */}
      {(moduleFilter === 'Overall' || moduleFilter === 'Habits') && (
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" /> Habit Consistency Breakdown ({timeframe})
              </h2>
              <p className="text-xs text-zinc-400">Completion rate and streak per custom habit</p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {habitCompletionRates.length} Tracked Routines
            </span>
          </div>

          <div className="space-y-4">
            {habitCompletionRates.map((item) => (
              <div key={item.name} className="space-y-1.5 p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/40">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-200 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                    <span className="text-[10px] text-zinc-500 uppercase font-mono px-2 py-0.5 rounded bg-zinc-800">
                      {item.category}
                    </span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-mono flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-amber-400" /> {item.streak}d streak
                    </span>
                    <span className="font-mono text-indigo-400 font-bold">{item.rate}%</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.rate}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yearly Activity Heatmap */}
      <Heatmap data={heatmapData} title="365-Day Consistency & Activity Heatmap" />

      {/* Cross-Module: Nutrition & Fitness */}
      {(moduleFilter === 'Overall' || moduleFilter === 'Food') && (
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-400" /> Body Weight Progression Trend
            </h2>
            <p className="text-xs text-zinc-400">Recorded weigh-in entries over time</p>
          </div>

          <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-zinc-800">
            {weightPoints.map((pt, i) => {
              const heightPercent = Math.max(20, Math.round(((pt.weight - 70) / 15) * 100));
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  <div className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {pt.weight}kg
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl transition-all duration-500 hover:from-emerald-500 hover:to-teal-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <div className="text-[10px] font-mono text-zinc-500 truncate w-full text-center">
                    {pt.date.split('-')[2] || i} Day
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(moduleFilter === 'Overall' || moduleFilter === 'Workouts') && (
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" /> Workout Training Analytics
            </h2>
            <p className="text-xs text-zinc-400">Total volume & calories burned per session</p>
          </div>

          <div className="space-y-2">
            {workouts.logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-zinc-200">{log.planName}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {log.date} • {log.durationMins} mins
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400">
                    {log.totalVolumeKg} kg volume
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono">
                    {log.caloriesBurned} kcal
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}