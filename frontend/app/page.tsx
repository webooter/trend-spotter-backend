import Link from "next/link";
import ConditionCards from "@/components/ConditionCards";
import TrendingNow from "@/components/TrendingNow";

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-bg relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated orbs */}
        <div className="orb w-96 h-96 bg-emerald-400 top-10  left-10"  style={{ animationDelay: "0s"   }} />
        <div className="orb w-80 h-80 bg-teal-400   top-40  right-20" style={{ animationDelay: "2s"   }} />
        <div className="orb w-64 h-64 bg-cyan-400   bottom-20 left-1/3" style={{ animationDelay: "4s" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm text-white/80 font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            AI-powered · Free · Results in seconds
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Stop Googling.<br />
            <span className="gradient-text">Start Eating Right.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get a personalised 7-day anti-inflammatory meal plan for your specific condition —
            joint pain, eczema, gut health, weight loss & more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/anti-inflammatory-meal-plan" className="btn-primary text-lg">
              Generate My Free Plan →
            </Link>
            <a href="#conditions" className="btn-secondary border-white/30 text-white hover:bg-white/10">
              See All Conditions
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { n: "7-Day",    label: "Complete Plan"          },
              { n: "100%",     label: "Free Forever"           },
              { n: "AI",       label: "Powered by Claude"      },
              { n: "Science",  label: "Backed Nutrition"       },
            ].map(({ n, label }) => (
              <div key={label} className="glass rounded-2xl px-6 py-4 text-center">
                <p className="text-2xl font-black text-white">{n}</p>
                <p className="text-xs text-white/60 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-slate-500 text-lg">Your personalised plan in 3 steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", emoji: "🎯", title: "Choose your condition", desc: "Select from joint pain, eczema, gut health, weight loss, perimenopause, and more." },
              { step: "02", emoji: "⚙️", title: "Set your preferences", desc: "Tell us your cooking time, dietary restrictions, and how many people you're cooking for." },
              { step: "03", emoji: "🥗", title: "Get your meal plan", desc: "Receive a full 7-day plan with meals, recipes, shopping list, and tips — instantly." },
            ].map(({ step, emoji, title, desc }) => (
              <div key={step} className="relative text-center p-8 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black px-4 py-1.5 rounded-full">
                  STEP {step}
                </div>
                <div className="text-5xl mb-4 mt-2">{emoji}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/anti-inflammatory-meal-plan" className="btn-primary inline-block">
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Condition Cards ───────────────────────────────────── */}
      <div id="conditions">
        <ConditionCards />
      </div>

      {/* ── Trending Now ─────────────────────────────────────── */}
      <TrendingNow />

      {/* ── Why AI Can't Replace This ─────────────────────────── */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Why Google can&apos;t give you <span className="gradient-text">this</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Generic articles can&apos;t personalise. We can.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { them: "Generic gut health tips",           us: "Plan tailored to YOUR condition"       },
              { them: "List of anti-inflammatory foods",   us: "7 days of meals that use those foods"  },
              { them: "Advice you have to interpret",      us: "Ready-to-cook breakfast, lunch, dinner"},
              { them: "No shopping list",                  us: "Complete shopping list, by category"   },
            ].map(({ them, us }, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-5 flex gap-4">
                <div className="flex-1">
                  <p className="text-xs text-red-400 font-bold mb-1">❌ GOOGLE</p>
                  <p className="text-slate-400 text-sm">{them}</p>
                </div>
                <div className="w-px bg-slate-700" />
                <div className="flex-1">
                  <p className="text-xs text-emerald-400 font-bold mb-1">✅ HEALTHINESS365</p>
                  <p className="text-white text-sm font-medium">{us}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/anti-inflammatory-meal-plan" className="btn-primary inline-block mt-12 text-lg">
            Get My Personalised Plan →
          </Link>
        </div>
      </section>
    </>
  );
}
