"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Settings, Zap, HardHat, FlaskConical, Layers } from "lucide-react";

type Category = { id: string; name: string };

const STATIC_CATEGORIES: Category[] = [
  { id: "ai", name: "AI & Tech" },
  { id: "mechanical", name: "Mechanical" },
  { id: "electrical", name: "Electrical" },
  { id: "civil", name: "Civil" },
  { id: "chemical", name: "Chemical" },
  { id: "materials", name: "Materials" },
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

  useEffect(() => {
    // 1. Switch to sessionStorage: This is only active during the current tab session.
    // If they open a new tab or close the site, this will be null and show the homepage.
    const saved = sessionStorage.getItem("engineer_discipline");
    if (saved) {
      router.push("/briefing");
      return;
    }

    // 2. Quietly wake up Render backend in the background
    if (process.env.NEXT_PUBLIC_API_URL) {
      fetch(process.env.NEXT_PUBLIC_API_URL).catch(() => {});
    }
  }, [router]);

  const selectCategory = (id: string) => {
    // Save to sessionStorage instead of localStorage
    sessionStorage.setItem("engineer_discipline", id);
    router.push("/briefing");
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Engineer Daily
      </h1>
      <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-12">
        Choose your engineering discipline for a customized, 5-minute daily briefing.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {STATIC_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.id] || Settings;
          return (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
            >
              <Icon className="w-8 h-8 mb-4 text-neutral-400 group-hover:text-[var(--accent)] transition-colors" />
              <span className="font-semibold text-lg">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </main>
  );
}