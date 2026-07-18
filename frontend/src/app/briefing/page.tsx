"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";

// Mock data structures matching your main.py response format
type Story = {
  title: string;
  publisher: string;
  published: string;
  summary: string;
  url: string;
};

type BriefingData = {
  overview: string;
  generated_at: string;
  stories: Story[];
};

export default function BriefingPage({ data, categoryName }: { data: BriefingData; categoryName: string }) {
  const router = useRouter();

  return (
    // Centered layout with responsive padding
    <main className="max-w-4xl mx-auto px-6 py-10 md:py-16 text-[var(--foreground)]">
      
      {/* 1. Styled Back Button */}
      <button 
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Change Discipline
      </button>

      {/* 2. Header Section */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight capitalize mb-2">
          {categoryName} Briefing
        </h1>
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm font-medium">
          <Calendar className="w-4 h-4" />
          <span>Saturday, July 18th, 2026</span>
        </div>
      </header>

      {/* 3. Today's Overview Section */}
      <section className="p-6 md:p-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--accent)]">
          Today's Overview
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-base md:text-lg">
          {data?.overview}
        </p>
      </section>

      {/* 4. Top Stories List */}
      <section>
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Top Stories</h2>
        <div className="flex flex-col gap-6">
          {data?.stories?.map((story, idx) => (
            <article 
              key={idx} 
              className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              {/* Publisher & Date Subtitle metadata */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                <span>{story.publisher}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span>{story.published}</span>
              </div>

              {/* Story Title */}
              <h3 className="text-lg md:text-xl font-bold tracking-tight leading-snug">
                {story.title}
              </h3>

              {/* AI-Generated Summary Paragraph */}
              <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base leading-relaxed">
                {story.summary}
              </p>

              {/* Styled External Anchor Link */}
              <div className="pt-2">
                <a 
                  href={story.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
                >
                  Read Original
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}