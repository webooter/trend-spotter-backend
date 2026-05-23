import { notFound } from "next/navigation";
import { getCondition, CONDITIONS } from "@/lib/conditions";
import MealPlanGenerator from "@/components/MealPlanGenerator";
import type { Metadata } from "next";

interface Props { params: { condition: string } }

export async function generateStaticParams() {
  return CONDITIONS.map((c) => ({ condition: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCondition(params.condition);
  if (!c) return {};
  return {
    title:       `Anti-Inflammatory Meal Plan for ${c.name} — Free 7-Day Plan | Healthiness365`,
    description: `Get a free personalised 7-day anti-inflammatory meal plan for ${c.name}. ${c.tagline}. Powered by AI nutrition science.`,
  };
}

export default function ConditionPage({ params }: Props) {
  const condition = getCondition(params.condition);
  if (!condition) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Hero */}
        <div className={`rounded-3xl p-8 bg-gradient-to-br ${condition.color} text-white mb-10 text-center`}>
          <span className="text-6xl block mb-4">{condition.emoji}</span>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Anti-Inflammatory Meal Plan<br />for {condition.name}
          </h1>
          <p className="text-white/80 text-lg">{condition.tagline}</p>
        </div>

        {/* SEO content block */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
          <h2 className="font-black text-slate-900 text-xl mb-3">
            Why diet matters for {condition.name}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Chronic inflammation is a root driver of {condition.name.toLowerCase()}. Research shows that
            specific dietary patterns — particularly those rich in omega-3 fatty acids, antioxidants,
            and polyphenols — can significantly reduce inflammatory markers in the body. Our AI-generated
            meal plans are built around these principles, giving you a practical, delicious way to eat
            for your health every single day.
          </p>
        </div>

        {/* Generator */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <MealPlanGenerator preselectedSlug={condition.slug} />
        </div>

        {/* Breadcrumb / internal links */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400 mb-4">Also see plans for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {CONDITIONS.filter((c) => c.slug !== condition.slug).map((c) => (
              <a
                key={c.slug}
                href={`/anti-inflammatory-meal-plan/${c.slug}`}
                className="text-xs text-slate-500 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-colors"
              >
                {c.emoji} {c.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
