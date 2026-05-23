"use client";
import { useState } from "react";
import { Condition } from "@/lib/conditions";

interface Meal   { name: string; description: string; whyItHelps: string; }
interface Day    { day: string; meals: { breakfast: Meal; lunch: Meal; dinner: Meal; snack: Meal } }
interface Plan   {
  introduction: string;
  keyFoods:     string[];
  avoidFoods:   string[];
  days:         Day[];
  shoppingList: Record<string, string[]>;
  tips:         string[];
}

interface Props  { plan: Record<string, unknown>; condition: Condition; onReset: () => void; }

const MEAL_ICONS: Record<string, string> = {
  breakfast: "🌅", lunch: "☀️", dinner: "🌙", snack: "🍎",
};

export default function ResultDisplay({ plan: rawPlan, condition, onReset }: Props) {
  const plan = rawPlan as unknown as Plan;
  const [activeDay,  setActiveDay]  = useState(0);
  const [openMeal,   setOpenMeal]   = useState<string | null>(null);
  const [checkedItems, setChecked]  = useState<Set<string>>(new Set());

  const day      = plan.days?.[activeDay];
  const mealKeys = ["breakfast", "lunch", "dinner", "snack"] as const;

  function toggleCheck(item: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  }

  return (
    <div className="animate-fade-up space-y-8">
      {/* Header */}
      <div className={`relative rounded-3xl p-8 bg-gradient-to-br ${condition.color} text-white overflow-hidden`}>
        <div className="absolute top-0 right-0 text-9xl opacity-10 select-none">{condition.emoji}</div>
        <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
          7-DAY PLAN READY
        </span>
        <h2 className="text-3xl font-black mb-2">Your {condition.name} Plan</h2>
        <p className="text-white/90 text-sm max-w-lg">{plan.introduction}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-xs font-bold text-white/70 mb-2">✅ EAT MORE OF</p>
            <ul className="space-y-1">
              {plan.keyFoods?.slice(0, 4).map((f, i) => (
                <li key={i} className="text-sm font-semibold">{f}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-xs font-bold text-white/70 mb-2">❌ AVOID</p>
            <ul className="space-y-1">
              {plan.avoidFoods?.slice(0, 4).map((f, i) => (
                <li key={i} className="text-sm font-semibold">{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Day selector */}
      <div>
        <h3 className="font-black text-slate-900 text-xl mb-4">Your Week</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {plan.days?.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`day-tab whitespace-nowrap ${i === activeDay ? "day-tab-active" : "day-tab-inactive"}`}
            >
              {d.day}
            </button>
          ))}
        </div>
      </div>

      {/* Meals for active day */}
      {day && (
        <div className="space-y-3">
          {mealKeys.map((mealKey) => {
            const meal     = day.meals[mealKey];
            const isOpen   = openMeal === mealKey;
            if (!meal) return null;
            return (
              <div key={mealKey} className="meal-card cursor-pointer" onClick={() => setOpenMeal(isOpen ? null : mealKey)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{MEAL_ICONS[mealKey]}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{mealKey}</p>
                      <p className="font-bold text-slate-900">{meal.name}</p>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <p className="text-slate-600 text-sm">{meal.description}</p>
                    <div className="bg-emerald-50 rounded-xl p-3 flex gap-2">
                      <span className="text-emerald-600">💡</span>
                      <p className="text-emerald-800 text-sm font-medium">{meal.whyItHelps}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Shopping list */}
      {plan.shoppingList && (
        <div className="bg-slate-50 rounded-3xl p-6">
          <h3 className="font-black text-slate-900 text-xl mb-5">🛒 Shopping List</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(plan.shoppingList).map(([category, items]) => (
              Array.isArray(items) && items.length > 0 && (
                <div key={category}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{category}</p>
                  {items.map((item, i) => (
                    <div key={i} className="shop-item" onClick={() => toggleCheck(`${category}-${item}`)}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${
                        checkedItems.has(`${category}-${item}`)
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300"
                      }`}>
                        {checkedItems.has(`${category}-${item}`) && <span className="text-xs">✓</span>}
                      </div>
                      <span className={`text-sm cursor-pointer ${checkedItems.has(`${category}-${item}`) ? "line-through text-slate-400" : "text-slate-700"}`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {plan.tips?.length > 0 && (
        <div>
          <h3 className="font-black text-slate-900 text-xl mb-4">💡 Pro Tips</h3>
          <div className="space-y-3">
            {plan.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 bg-white border border-slate-200 rounded-2xl p-4">
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-slate-700 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button onClick={onReset} className="btn-secondary flex-1 text-center">
          ← Generate Another Plan
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-800 transition-colors text-center"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
