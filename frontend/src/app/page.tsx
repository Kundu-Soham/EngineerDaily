"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Settings, Zap, HardHat, FlaskConical, Layers, Sun, Moon } from "lucide-react";

type Category = { 
  id: string; 
  name: string; 
  colorClass: string; 
  bgHoverClass: string; 
};

const STATIC_CATEGORIES: Category[] = [
  { id: "ai", name: "AI & Tech", colorClass: "text-blue-600 dark:text-blue-400", bgHoverClass: "hover:border-blue-500/30 hover:bg-blue-50/20 dark:hover:bg-blue-950/20" },
  { id: "mechanical", name: "Mechanical", colorClass: "text-amber-600 dark:text-amber-400", bgHoverClass: "hover:border-amber-500/30 hover:bg-amber-50/20 dark:hover:bg-amber-950/20" },
  { id: "electrical", name: "Electrical", colorClass: "text-yellow-500 dark:text-yellow-400", bgHoverClass: "hover:border-yellow-500/30 hover:bg-yellow-50/20 dark:hover:bg-yellow-950/20" },
  { id: "civil", name: "Civil", colorClass: "text-emerald-600 dark:text-emerald-400", bgHoverClass: "hover:border-emerald-500/30 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20" },
  { id: "chemical", name: "Chemical", colorClass: "text-rose-600 dark:text-rose-400", bgHoverClass: "hover:border-rose-500/30 hover:bg-rose-50/20 dark:hover:bg-rose-950/20" },
  { id: "materials", name: "Materials", colorClass: "text-purple-600 dark:text-purple-400", bgHoverClass: "hover:border-purple-500/30 hover:bg-purple-50/20 dark:hover:bg-purple-950/20" },
];

const ICON_MAP: Record<string, any> = {
  "ai": Cpu,
  "mechanical": Settings,
  "electrical": Zap,
  "civil": HardHat,
  "chemical": FlaskConical,
  "materials": Layers,
};

export default function Home() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 1. Session check
    const saved = sessionStorage.getItem("engineer_discipline");
    if (saved) {
      router.push("/briefing");
      return;
    }

    // 2. Render container wakeup ping
    if (process.env.NEXT_PUBLIC_API_URL) {
      fetch(process.env.NEXT_PUBLIC_API_URL).catch(() => {});
    }

    // 3. Dark mode theme initialization
    const localTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (localTheme === "dark" || (!localTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, [router]);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const selectCategory = (id: string) => {
    sessionStorage.setItem("engineer_discipline", id);
    router.push("/briefing");
  };

  return (
    <div className="w-full min-h-screen bg-[var(--background)] transition-colors duration-300">
      {/* Top Navbar Header featuring Dark Mode Control */}
      <header className="max-w-4xl mx-auto px-6 pt-6 flex justify-end">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20 pt-10 flex flex-col items-center text-center">
        {/* Modern multi-tonal Heading styling */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
          Engineer Daily
        </h1>
        
        {/* Enhanced Intuitive Descriptive Blurb */}
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mb-14 leading-relaxed">
          Select an engineering discipline to instantly generate an AI-synthesized daily brief. We crawl complex RSS feeds, breaking tech, journals, and top publishers to save you hours of reading time.
        </p>

        {/* Dynamic Colored Layout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
          {STATIC_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.id] || Settings;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group ${cat.bgHoverClass}`}
              >
                <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 mb-4 group-hover:scale-110 transition-transform ${cat.colorClass}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="font-bold text-lg tracking-tight text-[var(--foreground)] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}