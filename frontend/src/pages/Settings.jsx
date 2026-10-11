import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Palette,
  Target,
  RefreshCw,
  ShieldAlert,
  Check,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

function Settings() {
  const { settings, setSettings, resetAllData, foodData, theme, setTheme } = useApp();
  const [calorieInput, setCalorieInput] = useState(foodData.macroTargets.calories);
  const [proteinInput, setProteinInput] = useState(foodData.macroTargets.protein);
  const [waterInput, setWaterInput] = useState(foodData.waterTargetMl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const themeColors = [
    { id: 'indigo', name: 'Indigo Aura', color: '#6366f1' },
    { id: 'emerald', name: 'Emerald Power', color: '#10b981' },
    { id: 'violet', name: 'Violet Deep', color: '#8b5cf6' },
    { id: 'rose', name: 'Rose Energy', color: '#f43f5e' },
    { id: 'amber', name: 'Amber Focus', color: '#f59e0b' },
    { id: 'terracotta', name: 'Terracotta Flame', color: '#d9531e' },
  ];

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <SettingsIcon className="w-4 h-4" /> System Settings
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-100 mt-1">Platform Configuration</h1>
        <p className="text-sm text-zinc-400">Customize theme aesthetics, daily targets, and system data state.</p>
      </div>

      {/* Theme Mode Selector (Dark vs Light) */}
      <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-400" /> Interface Theme Mode
          </h2>
          <p className="text-xs text-zinc-400">Choose your preferred visual display mode across the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-zinc-900 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700 opacity-80 hover:opacity-100'
            }`}
          >
            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-zinc-900 text-zinc-400'}`}>
              <Moon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-100">Dark Nebula</span>
                {theme === 'dark' && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Deep black and zinc contrast with vivid neon aura glows. Ideal for low-light environments.
              </p>
            </div>
          </button>

          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-200 ${
              theme === 'light'
                ? 'bg-zinc-900 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700 opacity-80 hover:opacity-100'
            }`}
          >
            <div className={`p-3 rounded-xl ${theme === 'light' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-zinc-900 text-zinc-400'}`}>
              <Sun className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-100">Pure Daylight White</span>
                {theme === 'light' && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Clean, pure white cards and surfaces with crisp borders and high-contrast typography.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Accent Color Theme */}
      <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" /> Accent Color Theme
          </h2>
          <p className="text-xs text-zinc-400">Select your preferred accent glow color</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {themeColors.map((t) => {
            const isSelected = settings.themeAccent === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSettings(prev => ({ ...prev, themeAccent: t.id }))}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <span className="w-6 h-6 rounded-full shadow" style={{ backgroundColor: t.color }} />
                <span className="text-xs font-semibold text-zinc-200 text-center">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Parameters */}
      <form onSubmit={handleSaveSettings} className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" /> Daily Target Parameters
          </h2>
          <p className="text-xs text-zinc-400">Update nutrition and hydration targets</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Daily Calorie Target (kcal)</label>
            <input
              type="number"
              value={calorieInput}
              onChange={(e) => setCalorieInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Daily Protein Target (g)</label>
            <input
              type="number"
              value={proteinInput}
              onChange={(e) => setProteinInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Daily Water Goal (ml)</label>
            <input
              type="number"
              value={waterInput}
              onChange={(e) => setWaterInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Settings updated!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Save Target Config
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-[#121216]/80 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> Danger Zone & Data Reset
          </h2>
          <p className="text-xs text-zinc-400">Reset LocalStorage to baseline default demo state</p>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-zinc-400">Clear all local storage records and reload sample data.</p>
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset all data?')) {
                resetAllData();
                window.location.reload();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Reset All Platform Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
