"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Settings, Zap, HardHat, FlaskConical, Layers } from "lucide-react";

type Category = { id: string; name: string };

const ICON_MAP: Record<string, any> = {
  "ai": Cpu,
  "mechanical": Settings,
  "electrical": Zap,
  "civil": HardHat,
  "chemical": FlaskConical,
  "materials": Layers,
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("engineer_discipline");
    if (saved) {
      router.push("/briefing");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories.");
        return res.json();
      })
      .then(setCategories)
      .catch((err) => setError(err.message));
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

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {categories.map((cat) => {
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
      )}
    </main>
  );
}