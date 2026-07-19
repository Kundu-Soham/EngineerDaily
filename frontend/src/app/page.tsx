"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Settings, Zap, HardHat, FlaskConical, Layers } from "lucide-react";

type Category = { id: string; name: string };

// Define your categories statically right here so they load instantly (0ms)
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
    // 1. If they've already picked a discipline, route them instantly
    const saved = localStorage.getItem("engineer_discipline");
    if (saved) {
      router.push("/briefing");
      return;
    }

    // 2. Quietly wake up Render backend in the background so it's
    // spinning up while the user reads this screen!
    if (process.env.NEXT_PUBLIC_API_URL) {
      // Just hit your root API or a simple health endpoint to trigger cold start
      fetch(process.env.NEXT_PUBLIC_API_URL).catch(() => {
        // Silently catch errors; we only care about spinning the container up
      });
    }
  }, [router]);

  const selectCategory = (id: string) => {
    localStorage.setItem("engineer_discipline", id);
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

      {/* Render the grid instantly from static data */}
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