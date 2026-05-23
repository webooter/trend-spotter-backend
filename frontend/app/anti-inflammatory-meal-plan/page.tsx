import MealPlanGenerator from "@/components/MealPlanGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Anti-Inflammatory Meal Plan Generator — Free & Personalised | Healthiness365",
  description: "Generate your free personalised anti-inflammatory meal plan in seconds. Choose your condition, set preferences, get a 7-day plan with shopping list.",
};

export default function MealPlanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            FREE AI-POWERED TOOL
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Your <span className="gradient-text-dark">Anti-Inflammatory</span><br />Meal Plan Generator
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Personalised for your condition. Ready in seconds. Completely free.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <MealPlanGenerator />
        </div>
      </div>
    </div>
  );
}
