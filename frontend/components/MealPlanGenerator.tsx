"use client";
import { useState } from "react";
import { CONDITIONS, COOKING_TIMES, DIETARY } from "@/lib/conditions";
import ResultDisplay from "./ResultDisplay";

interface Props { preselectedSlug?: string; }

type Step = "condition" | "prefs" | "loading" | "result";

export default function MealPlanGenerator({ preselectedSlug }: Props) {
  const preselected = CONDITIONS.find((c) => c.slug === preselectedSlug);

  const [step,        setStep]        = useState<Step>(preselected ? "prefs" : "condition");
  const [condition,   setCondition]   = useState(preselected || CONDITIONS[0]);
  const [cookingTime, setCookingTime] = useState("any");
  const [dietary,     setDietary]     = useState("none");
  const [servings,    setServings]    = useState(2);
  const [plan,        setPlan]        = useState<Record<string, unknown> | null>(null);
  const [error,       setError]       = useState("");

  const steps: Step[] = ["condition", "prefs", "loading", "result"];
  const stepIdx = steps.indexOf(step);

  async function generate() {
    setStep("loading");
    setError("");
    try {
      const res = await fetch("/api/generate-meal-plan", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ condition: condition.name, cookingTime, dietary, servings }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setPlan(data);
      setStep("result");
    } catch {
      setError("Something went wrong generating your plan. Please try again.");
      setStep("prefs");
    }
  }

  function reset() { setStep(preselected ? "prefs" : "condition"); setPlan(null); setError(""); }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      {step !== "result" && (
        <div className="flex items-center gap-2 mb-10 justify-center">
          {["Your Goal", "Preferences", "Generating", "Your Plan"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < stepIdx ? "step-done" : i === stepIdx ? "step-active" : "step-pending"
              }`}>
                {i < stepIdx ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === stepIdx ? "text-emerald-600" : "text-slate-400"}`}>
                {label}
              </span>
              {i < 3 && <div className={`w-8 h-0.5 ${i < stepIdx ? "bg-emerald-500" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
      )}

      {/* Step: Condition */}
      {step === "condition" && (
        <div className="animate-fade-up">
          <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">What are you dealing with?</h2>
          <p className="text-slate-500 text-center mb-8">Pick your primary health concern.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CONDITIONS.map((c) => (
              <button
                key={c.slug}
                onClick={() => { setCondition(c); setStep("prefs"); }}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  condition.slug === c.slug
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-emerald-300"
                }`}
              >
                <span className="text-2xl block mb-2">{c.emoji}</span>
                <span className="font-bold text-slate-900 text-sm leading-tight block">{c.name}</span>
                <span className="text-xs text-slate-500 mt-1 block">{c.tagline}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Preferences */}
      {step === "prefs" && (
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{condition.emoji}</span>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Your preferences</h2>
              <p className="text-slate-500 text-sm">Personalizing your plan for <strong>{condition.name}</strong></p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">{error}</div>
          )}

          <div className="space-y-6">
            {/* Cooking time */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">How much time can you cook?</label>
              <div className="flex flex-wrap gap-3">
                {COOKING_TIMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setCookingTime(t.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                      cookingTime === t.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Dietary restrictions</label>
              <div className="flex flex-wrap gap-2">
                {DIETARY.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDietary(d.value)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      dietary === d.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Servings */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Cooking for <span className="text-emerald-600">{servings} {servings === 1 ? "person" : "people"}</span>
              </label>
              <input
                type="range"
                min={1} max={6} value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {!preselectedSlug && (
              <button onClick={() => setStep("condition")} className="btn-secondary flex-1">← Back</button>
            )}
            <button onClick={generate} className="btn-primary flex-1 text-center">
              Generate My 7-Day Plan →
            </button>
          </div>
        </div>
      )}

      {/* Step: Loading */}
      {step === "loading" && (
        <div className="text-center py-20 animate-fade-up">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="w-20 h-20 border-4 border-emerald-100 rounded-full" />
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full absolute inset-0 animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🥗</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Crafting your plan…</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Our AI nutritionist is building a personalised 7-day anti-inflammatory meal plan for {condition.name}.
          </p>
          <div className="flex justify-center gap-2 mt-6">
            {["Analyzing your condition", "Selecting anti-inflammatory ingredients", "Building your shopping list"].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" style={{ animationDelay: `${i * 0.5}s` }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step: Result */}
      {step === "result" && plan && (
        <ResultDisplay plan={plan} condition={condition} onReset={reset} />
      )}
    </div>
  );
}
