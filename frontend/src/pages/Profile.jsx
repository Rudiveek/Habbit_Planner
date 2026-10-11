import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Sparkles,
  Download,
  Upload,
  Edit3,
  Check
} from 'lucide-react';

function Profile() {
  const { profile, setProfile, habits, workouts, foodData } = useApp();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(profile.bio);

  const handleSaveBio = () => {
    setProfile(prev => ({ ...prev, bio: bioInput }));
    setIsEditingBio(false);
  };

  const handleExportJSON = () => {
    const fullState = {
      profile,
      habits,
      workouts,
      foodData,
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_growth_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.profile) setProfile(parsed.profile);
          alert('Profile data successfully imported!');
        } catch (err) {
          alert('Invalid JSON file.');
        }
      };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Profile Banner */}
      <div className="relative overflow-hidden bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="relative w-28 h-28 rounded-3xl p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-indigo-400 shadow">
              LVL {profile.level}
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-zinc-100">{profile.name}</h1>
                <p className="text-xs text-indigo-400 font-mono">{profile.handle} • High-Performance Growth Architect</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-indigo-400" /> Export Backup
                </button>
                <label className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs cursor-pointer transition-colors flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-400" /> Import
                  <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                </label>
              </div>
            </div>

            <div className="pt-2">
              {isEditingBio ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100"
                  />
                  <button
                    onClick={handleSaveBio}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-zinc-300 italic flex items-center gap-2">
                  "{profile.bio}"
                  <button onClick={() => setIsEditingBio(true)} className="text-zinc-500 hover:text-indigo-400">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </p>
              )}
            </div>

            <div className="space-y-1.5 pt-2 max-w-xl">
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>XP Progress to Level {profile.level + 1}</span>
                <span>{profile.xp} / {profile.xpNextLevel} XP</span>
              </div>
              <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
                  style={{ width: `${(profile.xp / profile.xpNextLevel) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Achievement Badges */}
      <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Platform Achievements & Milestones
          </h2>
          <p className="text-xs text-zinc-400">Unlocked badges based on consistency streaks and performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile.badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 shadow-xl flex items-start gap-4 hover:border-zinc-700 transition-all"
            >
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${badge.color} text-white shadow-lg shrink-0`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-100">{badge.name}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{badge.desc}</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Unlocked
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
