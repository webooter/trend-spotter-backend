import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title:       "Healthiness365 — Personalized Anti-Inflammatory Meal Plans",
  description: "Get a free personalized anti-inflammatory meal plan in seconds. Powered by AI, backed by nutrition science. Supports joint pain, eczema, gut health, weight loss & more.",
  keywords:    "anti inflammatory meal plan, gut health recipes, anti inflammatory diet, meal plan generator",
  openGraph: {
    title:       "Healthiness365 — Personalized Anti-Inflammatory Meal Plans",
    description: "Free personalized meal plans for joint pain, eczema, gut health, weight loss & more.",
    url:         "https://healthiness365.com",
    siteName:    "Healthiness365",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-2xl font-bold text-white mb-2">Healthiness365</p>
            <p className="text-sm mb-6">Personalized anti-inflammatory nutrition, powered by AI.</p>
            <div className="flex justify-center gap-8 text-sm mb-8">
              <a href="/anti-inflammatory-meal-plan/joint-pain"  className="hover:text-emerald-400 transition-colors">Joint Pain</a>
              <a href="/anti-inflammatory-meal-plan/eczema"      className="hover:text-emerald-400 transition-colors">Eczema</a>
              <a href="/anti-inflammatory-meal-plan/gut-health"  className="hover:text-emerald-400 transition-colors">Gut Health</a>
              <a href="/anti-inflammatory-meal-plan/weight-loss" className="hover:text-emerald-400 transition-colors">Weight Loss</a>
            </div>
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} Healthiness365. For informational purposes only — not medical advice.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
