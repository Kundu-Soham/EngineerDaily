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
    const saved = sessionStorage.getItem("engineer_discipline");
    if (saved) {
      router.push("/briefing");
      return;
    }

    if (process.env.NEXT_PUBLIC_API_URL) {
      fetch(process.env.NEXT_PUBLIC_API_URL).catch(() => {});
    }

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
    <div className="w-full h-screen overflow-hidden bg-[var(--background)] flex flex-col justify-center relative transition-colors duration-300">
      
      {/* Absolute positioned dark mode button so it doesn't push the title downwards */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm z-50"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
      </button>

      {/* Main Container pulled upwards slightly using a compact layout */}
      <main className="max-w-4xl w-full mx-auto px-6 flex flex-col items-center text-center -mt-8">
        
        {/* Title with py-2 padding to prevent gradient clipping */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight py-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
          Engineer Daily
        </h1>
        
        <p className="text-sm md:text-base text-[var(--muted)] max-w-2xl mb-8 leading-relaxed">
          Select an engineering discipline to instantly generate an AI-synthesized daily brief. We crawl complex RSS feeds, breaking tech, journals, and top publishers to save you hours of reading time.
        </p>

        {/* Categories Grid layout fits within standard desktop screens safely */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {STATIC_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.id] || Settings;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-6 md:p-7 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group ${cat.bgHoverClass}`}
              >
                <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 mb-3 group-hover:scale-110 transition-transform ${cat.colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-base md:text-lg tracking-tight text-[var(--foreground)] transition-colors">
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