import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heatmap } from '../components/Heatmap';
import {
  Dumbbell,
  Play,
  Trophy,
  Camera,
  CheckCircle2,
  Circle,
  Plus,
  Clock
} from 'lucide-react';

function Fitness() {
  const { workouts, logWorkoutSession, addPRRecord, addProgressPhoto } = useApp();
  const [activeTab, setActiveTab] = useState('plans');
  const [selectedPlan, setSelectedPlan] = useState(workouts.plans[0]);

  const [sessionSets, setSessionSets] = useState(() => {
    return workouts.plans[0].exercises.map((ex) => ({
      exerciseName: ex.name,
      sets: Array.from({ length: ex.defaultSets }).map((_, sIdx) => ({
        setNumber: sIdx + 1,
        weight: ex.targetWeight || 60,
        reps: 10,
        completed: false
      }))
    }));
  });

  const [showPRModal, setShowPRModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [prExercise, setPrExercise] = useState('Barbell Bench Press');
  const [prWeight, setPrWeight] = useState('110 kg');
  const [prReps, setPrReps] = useState('3 reps');

  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80');
  const [photoLabel, setPhotoLabel] = useState('July Physique Check - 78.4 kg');

  const heatmapData = {};
  workouts.logs.forEach(l => {
    heatmapData[l.date] = (heatmapData[l.date] || 0) + 1;
  });

  const handleStartPlan = (plan) => {
    setSelectedPlan(plan);
    setSessionSets(
      plan.exercises.map(ex => ({
        exerciseName: ex.name,
        sets: Array.from({ length: ex.defaultSets }).map((_, sIdx) => ({
          setNumber: sIdx + 1,
          weight: ex.targetWeight || 60,
          reps: 10,
          completed: false
        }))
      }))
    );
    setActiveTab('active');
  };

  const toggleSetCompletion = (exIdx, setIdx) => {
    setSessionSets(prev => {
      const copy = [...prev];
      const ex = { ...copy[exIdx] };
      const set = { ...ex.sets[setIdx] };
      set.completed = !set.completed;
      ex.sets[setIdx] = set;
      copy[exIdx] = ex;
      return copy;
    });
  };

  const handleFinishWorkout = () => {
    const completedSetsCount = sessionSets.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
    logWorkoutSession({
      planName: selectedPlan.name,
      durationMins: 55,
      caloriesBurned: Math.round(completedSetsCount * 25 + 200),
      totalVolumeKg: 8900,
      exercises: sessionSets
    });
    setActiveTab('plans');
  };

  const handlePRSubmit = (e) => {
    e.preventDefault();
    addPRRecord({ exercise: prExercise, weight: prWeight, reps: prReps, category: 'Strength' });
    setShowPRModal(false);
  };

  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    addProgressPhoto({ url: photoUrl, label: photoLabel });
    setShowPhotoModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Dumbbell className="w-4 h-4" /> Hevy Training System
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-100 mt-1">Physical Fitness & Workout Logger</h1>
          <p className="text-sm text-zinc-400">Log workout sets, track personal records, and store physique progress.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'plans' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Plans & Routines
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'active' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Active Logger
          </button>
          <button
            onClick={() => setActiveTab('prs')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'prs' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            PR Records
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'photos' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Progress Photos
          </button>
        </div>
      </div>

      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workouts.plans.map((plan) => (
              <div key={plan.id} className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      {plan.focus}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" /> {plan.estimatedTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-100">{plan.name}</h3>

                  <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                    <div className="text-xs font-semibold text-zinc-400">Routine Exercises:</div>
                    {plan.exercises.map((ex, i) => (
                      <div key={i} className="flex justify-between text-xs text-zinc-300 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/40">
                        <span>{ex.name}</span>
                        <span className="font-mono text-zinc-500">{ex.defaultSets} × {ex.defaultReps}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleStartPlan(plan)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" /> Start Workout Session
                </button>
              </div>
            ))}
          </div>

          <Heatmap data={heatmapData} title="Workout Training Frequency Heatmap" />
        </div>
      )}

      {activeTab === 'active' && (
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Active Workout Session</span>
              <h2 className="text-2xl font-black text-zinc-100 mt-0.5">{selectedPlan.name}</h2>
            </div>

            <button
              onClick={handleFinishWorkout}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Finish & Save Workout
            </button>
          </div>

          <div className="space-y-6">
            {sessionSets.map((exGroup, exIdx) => (
              <div key={exIdx} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-emerald-400" /> {exGroup.exerciseName}
                </h3>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 text-[11px] font-semibold text-zinc-500 uppercase px-2">
                    <span className="col-span-2">Set</span>
                    <span className="col-span-4">Weight (kg)</span>
                    <span className="col-span-4">Reps</span>
                    <span className="col-span-2 text-right">Status</span>
                  </div>

                  {exGroup.sets.map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className={`grid grid-cols-12 items-center p-2.5 rounded-xl border transition-all ${
                        set.completed
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-950/60 border-zinc-800/60 text-zinc-300'
                      }`}
                    >
                      <span className="col-span-2 font-mono text-xs font-bold">#{set.setNumber}</span>

                      <div className="col-span-4">
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSessionSets(prev => {
                              const copy = [...prev];
                              copy[exIdx].sets[setIdx].weight = val;
                              return copy;
                            });
                          }}
                          className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono"
                        />
                      </div>

                      <div className="col-span-4">
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSessionSets(prev => {
                              const copy = [...prev];
                              copy[exIdx].sets[setIdx].reps = val;
                              return copy;
                            });
                          }}
                          className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono"
                        />
                      </div>

                      <div className="col-span-2 flex justify-end">
                        <button
                          onClick={() => toggleSetCompletion(exIdx, setIdx)}
                          className="text-zinc-500 hover:text-emerald-400 transition-colors"
                        >
                          {set.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'prs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Personal Records (PR Wall)
              </h2>
              <p className="text-xs text-zinc-400">All-time lifetime max weight milestones</p>
            </div>
            <button
              onClick={() => setShowPRModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New PR
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workouts.prRecords.map((pr) => (
              <div key={pr.id} className="bg-[#121216]/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                  <span>{pr.category}</span>
                  <span>{pr.date}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{pr.exercise}</h3>
                  <div className="text-3xl font-black text-amber-400 mt-1">{pr.weight}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{pr.reps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-400" /> Physique Progress Photo Wall
              </h2>
              <p className="text-xs text-zinc-400">Visual timeline of physical evolution</p>
            </div>
            <button
              onClick={() => setShowPhotoModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Physique Photo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workouts.progressPhotos.map((photo) => (
              <div key={photo.id} className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xl group">
                <div className="h-72 w-full overflow-hidden bg-zinc-900 relative">
                  <img
                    src={photo.url}
                    alt={photo.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-xs font-mono text-zinc-200">
                    {photo.date}
                  </div>
                </div>
                <div className="p-4 bg-zinc-900/90">
                  <h4 className="font-bold text-sm text-zinc-100">{photo.label}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-zinc-100">Log Personal Record (PR)</h3>
            <form onSubmit={handlePRSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={prExercise}
                  onChange={(e) => setPrExercise(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Weight</label>
                  <input
                    type="text"
                    value={prWeight}
                    onChange={(e) => setPrWeight(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Reps</label>
                  <input
                    type="text"
                    value={prReps}
                    onChange={(e) => setPrReps(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPRModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121216] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-zinc-100">Add Physique Progress Photo</h3>
            <form onSubmit={handlePhotoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Caption / Label</label>
                <input
                  type="text"
                  required
                  value={photoLabel}
                  onChange={(e) => setPhotoLabel(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fitness;
