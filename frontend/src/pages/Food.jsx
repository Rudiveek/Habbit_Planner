import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Utensils,
  Droplets,
  Plus,
  Trash2,
  Scale,
  Sparkles
} from 'lucide-react';

function Food() {
  const { foodData, addWater, addMealItem, deleteMealItem, logWeight, theme } = useApp();
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);

  const [itemName, setItemName] = useState('');
  const [itemCal, setItemCal] = useState(300);
  const [itemProtein, setItemProtein] = useState(25);
  const [itemCarbs, setItemCarbs] = useState(30);
  const [itemFat, setItemFat] = useState(8);

  const [weightInput, setWeightInput] = useState(foodData.currentWeightKg || 78.4);

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  foodData.meals.forEach(m => {
    m.items.forEach(item => {
      totalCalories += item.calories || 0;
      totalProtein += item.protein || 0;
      totalCarbs += item.carbs || 0;
      totalFat += item.fat || 0;
    });
  });

  const targets = foodData.macroTargets;

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    addMealItem(selectedMealType, {
      name: itemName,
      calories: Number(itemCal),
      protein: Number(itemProtein),
      carbs: Number(itemCarbs),
      fat: Number(itemFat)
    });
    setItemName('');
    setShowItemModal(false);
  };

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    logWeight(weightInput);
    setShowWeightModal(false);
  };

  const remainingProtein = targets.protein - totalProtein;
  const remainingCalories = targets.calories - totalCalories;

  const getSmartSuggestions = () => {
    if (remainingProtein > 30) {
      return "You still need " + remainingProtein + "g of protein. Ideal option: 200g Grilled Chicken Breast or Double Scoop Whey Shake with Almond Milk.";
    }
    if (remainingCalories < 300 && remainingCalories > 0) {
      return "Close to calorie ceiling. Swap remaining carbs for high-volume leafy greens or egg white omelette.";
    }
    return "Great job! Your macros are balanced for today's physical energy demands.";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Utensils className="w-4 h-4" /> Nutrition & Fuel Engine
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-100 mt-1">Meals, Macros & Water Log</h1>
          <p className="text-sm text-zinc-400">Track calorie budget, macronutrient targets, and body weight progression.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWeightModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold text-xs hover:border-zinc-700 transition-all flex items-center gap-2"
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Weight: <strong className={theme === 'light' ? 'text-slate-900' : 'text-white'}>{foodData.currentWeightKg} kg</strong></span>
          </button>
        </div>
      </div>

      {/* 1. Macro Progress Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
            <span>Calories</span>
            <span className="text-amber-400 font-mono">{totalCalories} / {targets.calories} kcal</span>
          </div>
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalCalories / targets.calories) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-zinc-500 flex justify-between">
            <span>Remaining</span>
            <span className="font-mono text-zinc-300">{Math.max(0, targets.calories - totalCalories)} kcal</span>
          </div>
        </div>

        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
            <span>Protein</span>
            <span className="text-indigo-400 font-mono">{totalProtein} / {targets.protein} g</span>
          </div>
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalProtein / targets.protein) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-zinc-500 flex justify-between">
            <span>Target Goal</span>
            <span className="font-mono text-indigo-300">{targets.protein}g</span>
          </div>
        </div>

        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
            <span>Carbohydrates</span>
            <span className="text-emerald-400 font-mono">{totalCarbs} / {targets.carbs} g</span>
          </div>
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalCarbs / targets.carbs) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-zinc-500 flex justify-between">
            <span>Fuel Level</span>
            <span className="font-mono text-emerald-300">{Math.round((totalCarbs / targets.carbs) * 100)}%</span>
          </div>
        </div>

        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
            <span>Fats</span>
            <span className="text-cyan-400 font-mono">{totalFat} / {targets.fat} g</span>
          </div>
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalFat / targets.fat) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-zinc-500 flex justify-between">
            <span>Lipid Health</span>
            <span className="font-mono text-cyan-300">{targets.fat}g</span>
          </div>
        </div>
      </div>

      {/* 2. Hydration & AI Macro Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Droplets className="w-5 h-5 animate-bounce" /> Water Hydration
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {foodData.waterCurrentMl} / {foodData.waterTargetMl} ml
            </span>
          </div>

          <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (foodData.waterCurrentMl / foodData.waterTargetMl) * 100)}%` }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addWater(250)}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                theme === 'light'
                  ? 'bg-cyan-50 border border-cyan-200 text-cyan-700 hover:bg-cyan-100 shadow-xs'
                  : 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60'
              }`}
            >
              <Plus className="w-4 h-4" /> +250 ml Glass
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> +500 ml Bottle
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#121216]/80 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 shadow-xl flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
            <Sparkles className="w-8 h-8 animate-pulse-slow" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">AI Nutrition Recommendation</div>
            <h3 className="text-base font-bold text-zinc-100">Smart Macro Advice</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {getSmartSuggestions()}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Meal Timeline Log */}
      <div className="bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">Meal Timeline Log</h2>
          <p className="text-xs text-zinc-400">Breakfast, Lunch, Dinner, and Snacks breakdown</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {foodData.meals.map((meal) => {
            const mealCalories = meal.items.reduce((acc, i) => acc + i.calories, 0);
            const mealProtein = meal.items.reduce((acc, i) => acc + i.protein, 0);

            return (
              <div
                key={meal.type}
                className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 border ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-200/80 shadow-xs'
                    : 'bg-zinc-900/60 border-zinc-800/80'
                }`}
              >
                <div>
                  <div className={`flex items-center justify-between pb-3 border-b ${
                    theme === 'light' ? 'border-slate-200' : 'border-zinc-800'
                  }`}>
                    <div>
                      <h3 className="font-bold text-sm text-zinc-100">{meal.type}</h3>
                      <span className="text-[10px] text-zinc-500 font-mono">{meal.time}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400 font-mono">{mealCalories} kcal</span>
                      <div className="text-[10px] text-indigo-400 font-mono">{mealProtein}g P</div>
                    </div>
                  </div>

                  <div className="space-y-2.5 mt-3">
                    {meal.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs shadow-xs transition-all ${
                          theme === 'light'
                            ? 'bg-white border-slate-200 hover:border-slate-300'
                            : 'bg-zinc-950/60 border-zinc-800/60'
                        }`}
                      >
                        <div>
                          <div className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-zinc-200'}`}>
                            {item.name}
                          </div>
                          <div className={`text-[10px] font-mono mt-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-zinc-500'}`}>
                            {item.calories} kcal • P:{item.protein}g C:{item.carbs}g F:{item.fat}g
                          </div>
                        </div>
                        <button
                          onClick={() => deleteMealItem(meal.type, item.id)}
                          className={`transition-colors p-1.5 rounded-lg ${
                            theme === 'light'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-zinc-600 hover:text-rose-400'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedMealType(meal.type);
                    setShowItemModal(true);
                  }}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border ${
                    theme === 'light'
                      ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
                      : 'bg-zinc-800/60 hover:bg-zinc-800 border-transparent text-zinc-300'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Add Item to {meal.type}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 border ${
            theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#121216] border-zinc-800'
          }`}>
            <h3 className="text-lg font-bold text-zinc-100">Add Item to {selectedMealType}</h3>
            <form onSubmit={handleAddItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Food Item Name</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g., Avocado Toast with Eggs"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={itemCal}
                    onChange={(e) => setItemCal(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={itemProtein}
                    onChange={(e) => setItemProtein(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={itemCarbs}
                    onChange={(e) => setItemCarbs(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={itemFat}
                    onChange={(e) => setItemFat(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  Add Meal Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 border ${
            theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#121216] border-zinc-800'
          }`}>
            <h3 className="text-lg font-bold text-zinc-100">Log Current Body Weight</h3>
            <form onSubmit={handleWeightSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-base text-zinc-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Save Weight Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Food;
