import Link from "next/link";
import { CONDITIONS } from "@/lib/conditions";

export default function ConditionCards() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            CHOOSE YOUR HEALTH GOAL
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            What are you dealing with?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Each plan is tailored to your specific condition — not a generic one-size-fits-all approach.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONDITIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/anti-inflammatory-meal-plan/${c.slug}`}
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 card-hover overflow-hidden"
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.color} rounded-t-2xl`} />

              <div className="flex items-start gap-4 mt-2">
                <span className="text-4xl">{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 text-lg leading-tight mb-1">{c.name}</h3>
                  <p className="text-slate-500 text-sm mb-3">{c.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {c.volume} monthly searches
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Free Plan
                </span>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
