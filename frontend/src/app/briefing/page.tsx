"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, ExternalLink, RefreshCw, AlertTriangle } from "lucide-react";

interface Story {
  title: string;
  publisher: string;
  published: string;
  summary: string;
  url: string;
}

interface Briefing {
  overview: string;
  generated_at: string;
  stories: Story[];
}

export default function BriefingPage() {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("engineer_discipline");
    if (!saved) {
      router.push("/");
      return;
    }
    setCategoryId(saved);
    fetchBriefing(saved);
  }, [router]);

  const fetchBriefing = async (cat: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/briefing/${cat}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to fetch briefing");
      }
      const data = await res.json();
      setBriefing(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearPreference = () => {
    localStorage.removeItem("engineer_discipline");
    router.push("/");
  };

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-8"></div>
        <div className="h-10 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded mb-4"></div>
        <div className="h-32 w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-12"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Failed to Generate Briefing</h2>
        <p className="text-neutral-500 mb-8">{error}</p>
        <button 
          onClick={() => categoryId && fetchBriefing(categoryId)}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
        <button onClick={clearPreference} className="mt-4 text-sm text-neutral-400 hover:text-neutral-600">
          Change Discipline
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <button 
        onClick={clearPreference}
        className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-[var(--foreground)] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Change Discipline
      </button>

      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 capitalize">
          {categoryId?.replace("-", " ")} Briefing
        </h1>
        <p className="text-neutral-500 font-medium">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>
      </header>

      {/* Executive Overview */}
      <section className="p-6 md:p-8 rounded-3xl bg-[var(--foreground)] text-[var(--background)] mb-12 shadow-md">
        <h2 className="text-sm font-bold tracking-widest uppercase opacity-60 mb-4">
          Today's Overview
        </h2>
        <p className="text-lg leading-relaxed opacity-90">
          {briefing?.overview}
        </p>
      </section>

      {/* Stories */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold mb-6 border-b border-[var(--card-border)] pb-2">
          Top Stories
        </h3>
        {briefing?.stories.map((story, idx) => (
          <article 
            key={idx}
            className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="text-xl font-bold leading-snug mb-2">
                  {story.title}
                </h4>
                <div className="flex items-center gap-3 text-sm text-neutral-500 font-medium">
                  <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                    {story.publisher}
                  </span>
                  <time>{story.published}</time>
                </div>
              </div>
            </div>
            
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
              {story.summary}
            </p>
            
            <a 
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity"
            >
              Read Original <ExternalLink className="w-4 h-4" />
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}