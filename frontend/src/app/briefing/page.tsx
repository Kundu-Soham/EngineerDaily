"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, Loader2, Sun, Moon } from "lucide-react";

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

function BriefingLayout({ 
  data, 
  categoryName, 
  isDarkMode, 
  toggleDarkMode 
}: { 
  data: BriefingData; 
  categoryName: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const router = useRouter();

  const handleClearAndExit = () => {
    sessionStorage.removeItem("engineer_discipline");
    router.push("/");
  };

  // HELPER FUNCTION: Splits the large paragraph into clean, independent points
  const formatOverview = (text: string) => {
    if (!text) return null;
    // Splits by period followed by space, filtering out empty strings
    const sentences = text.split(/\.\s+/).map(s => s.trim()).filter(Boolean);
    
    return (
      <ul className="space-y-4">
        {sentences.map((sentence, index) => (
          <li key={index} className="flex items-start gap-3 text-slate-900 dark:text-slate-100 text-base md:text-lg leading-relaxed font-medium">
            {/* Custom subtle marker bullet matching your accent color */}
            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
            <span>{sentence.endsWith('.') ? sentence : `${sentence}.`}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[var(--background)] flex flex-col transition-colors duration-300">
      
      {/* Header Navigation Bar */}
      <header className="w-full max-w-4xl mx-auto px-6 pt-6 flex justify-between items-center gap-4">
        <button 
          onClick={handleClearAndExit}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Change Discipline</span>
          <span className="xs:hidden">Back</span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto px-6 py-10 text-[var(--foreground)]">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight capitalize mb-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent py-1">
            {categoryName} Briefing
          </h1>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span>Saturday, July 18th, 2026</span>
          </div>
        </header>

        {/* --- FIXED: Formatted overview using our bullet/list layout instead of one huge paragraph block --- */}
        <section className="p-6 md:p-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm mb-12 hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-200">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-[var(--accent)] font-semibold">
            Today's Overview
          </h2>
          <div className="pl-1">
            {formatOverview(data?.overview)}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 tracking-tight text-slate-900 dark:text-slate-50">Top Stories</h2>
          <div className="flex flex-col gap-6">
            {data?.stories?.map((story, idx) => (
              <article 
                key={idx} 
                className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm flex flex-col gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-200"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  <span>{story.publisher}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span>{story.published}</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold tracking-tight leading-snug text-slate-900 dark:text-slate-100">
                  {story.title}
                </h3>

                <p className="text-slate-800 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  {story.summary}
                </p>

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
    </div>
  );
}

export default function BriefingPage() {
  const [data, setData] = useState<BriefingData | null>(null);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCategory = sessionStorage.getItem("engineer_discipline");
    if (!savedCategory) {
      router.push("/");
      return;
    }
    setCategory(savedCategory);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/briefing/${savedCategory}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load briefing.");
        return res.json();
      })
      .then((briefingData) => {
        setData(briefingData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

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

  const handleGoBack = () => {
    sessionStorage.removeItem("engineer_discipline");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen fixed inset-0 bg-[var(--background)] overflow-hidden gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
        <p className="text-slate-700 font-medium dark:text-slate-300">Generating your briefing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[var(--background)] flex flex-col transition-colors duration-300">
        <header className="w-full max-w-4xl mx-auto px-6 pt-6 flex justify-end">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center flex-1 justify-center">
          <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl mb-6 border border-red-100 dark:border-red-900/30">
            {error}
          </div>
          <button 
            onClick={handleGoBack}
            className="px-5 py-2 text-sm font-semibold rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <BriefingLayout 
      data={data!} 
      categoryName={category} 
      isDarkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
}