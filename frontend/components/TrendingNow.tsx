"use client";
import { useEffect, useState } from "react";

interface TrendItem {
  title:       string;
  views?:      number;
  upvotes?:    number;
  url:         string;
  thumbnail?:  string;
  channel?:    string;
  subreddit?:  string;
}

interface TrendSource {
  source: string;
  data:   TrendItem[];
  error?: string;
}

const NICHES = ["gut health", "anti-inflammatory", "hormonal health"];

export default function TrendingNow() {
  const [trends, setTrends]   = useState<TrendSource[]>([]);
  const [niche, setNiche]     = useState(NICHES[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/trends?niche=${encodeURIComponent(niche)}`)
      .then((r) => r.json())
      .then((d) => setTrends(d.results || []))
      .catch(() => setTrends([]))
      .finally(() => setLoading(false));
  }, [niche]);

  const allItems = trends.flatMap((s) =>
    (s.data || []).map((item) => ({ ...item, _source: s.source }))
  ).slice(0, 6);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-600 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            🔥 LIVE TRENDS
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            What&apos;s viral <span className="gradient-text-dark">this week</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
            Real-time data from YouTube &amp; Reddit — we track what&apos;s trending so your meal plan stays relevant.
          </p>

          {/* Niche pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {NICHES.map((n) => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  niche === n
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : allItems.length === 0 ? (
          <p className="text-center text-slate-400 py-16">No trends loaded — check API connection.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allItems.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover shadow-sm"
              >
                {item.thumbnail && (
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        (item as { _source: string })._source === "youtube_shorts"
                          ? "bg-red-500 text-white"
                          : "bg-orange-500 text-white"
                      }`}>
                        {(item as { _source: string })._source === "youtube_shorts" ? "▶ YouTube" : "⬆ Reddit"}
                      </span>
                    </div>
                    {item.views && (
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        {(item.views / 1000).toFixed(0)}K views
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{item.channel || (item.subreddit ? `r/${item.subreddit}` : "")}</span>
                    {item.upvotes && <span>⬆ {item.upvotes.toLocaleString()}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
