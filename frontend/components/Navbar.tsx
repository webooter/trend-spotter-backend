"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          Health<span className="gradient-text">iness365</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/anti-inflammatory-meal-plan" className="hover:text-white transition-colors">
            Meal Plan Generator
          </Link>
          <Link href="/anti-inflammatory-meal-plan/joint-pain" className="hover:text-white transition-colors">
            Joint Pain
          </Link>
          <Link href="/anti-inflammatory-meal-plan/gut-health" className="hover:text-white transition-colors">
            Gut Health
          </Link>
          <Link
            href="/anti-inflammatory-meal-plan"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Get My Plan →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-slate-900 border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm font-medium text-slate-300">
          <Link href="/anti-inflammatory-meal-plan" onClick={() => setOpen(false)}>Meal Plan Generator</Link>
          <Link href="/anti-inflammatory-meal-plan/joint-pain" onClick={() => setOpen(false)}>Joint Pain</Link>
          <Link href="/anti-inflammatory-meal-plan/gut-health" onClick={() => setOpen(false)}>Gut Health</Link>
          <Link href="/anti-inflammatory-meal-plan/eczema" onClick={() => setOpen(false)}>Eczema</Link>
          <Link href="/anti-inflammatory-meal-plan" className="btn-primary text-center" onClick={() => setOpen(false)}>
            Get My Plan →
          </Link>
        </div>
      )}
    </nav>
  );
}
