"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, Loader2, Sun, Moon, Sparkles } from "lucide-react";

type Story = {
  title: string;
  publisher: string;
  published: string;
  summary: string;
  url: string;
  image_url?: string;
};

type BriefingData = {
  overview: string;
  generated_at: string;
  stories: Story[];
};

// Curated array of real, non-AI engineering/tech photography from Unsplash to use as bulletproof fallbacks
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=500&q=80", // Engineering / Lab workstation
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&q=80", // Clean modern technology / Robotics
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80", // Circuit / Hardware development
  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=500&q=80", // Hardware components / Optics
];

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

  const formatOverview = (text: string) => {
    if (!text) return null;
    const sentences = text.split(/\.\s+/).map(s => s.trim()).filter(Boolean).map(s => s.endsWith('.') ? s : `${s}.`);
    
    if (sentences.length <= 2) {
      return <p className="text-[var(--foreground)] text-base md:text-lg leading-relaxed font-medium">{text}</p>;
    }

    const leadParagraph = sentences.slice(0, 2).join(" ");
    const remainingSentences = sentences.slice(2);
    const bulletGroups: string[] = [];
    for (let i = 0; i < remainingSentences.length; i += 2) {
      bulletGroups.push(remainingSentences.slice(i, i + 2).join(" "));
    }

    return (
      <div className="space-y-6">
        <p className="text-[var(--foreground)] text-base md:text-lg leading-relaxed font-semibold border-l-4 border-[var(--accent)] pl-4 py-3 bg-current/[0.05] rounded-r-xl">
          {leadParagraph}
        </p>
        
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] opacity-50 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" /> Key Takeaways
          </h4>
          <ul className="space-y-4">
            {bulletGroups.map((group, index) => (
              <li key={index} className="flex items-start gap-3 text-[var(--foreground)] text-sm md:text-base leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-70 shrink-0" />
                <span className="opacity-90">{group}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[var(--background)] flex flex-col transition-colors duration-300">
      
      {/* Header Navigation Bar */}
      <header className="w-full max-w-4xl mx-auto px-6 pt-6 flex justify-between items-center gap-4">
        <button 
          onClick={handleClearAndExit}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-current/[0.05] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Change Discipline</span>
          <span className="xs:hidden">Back</span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-current/[0.05] transition-colors shadow-sm"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto px-6 py-10 text-[var(--foreground)]">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight capitalize mb-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent py-1">
            {categoryName} Briefing
          </h1>
          <div className="flex items-center gap-2 text-[var(--foreground)] opacity-60 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Today's Overview Block */}
        <section className="p-6 md:p-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm mb-12 hover:border-current/[0.1] transition-colors duration-200">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-[var(--accent)]">
            Today's Overview
          </h2>
          <div>
            {formatOverview(data?.overview)}
          </div>
        </section>

        {/* Top Stories Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 tracking-tight text-[var(--foreground)]">Top Stories</h2>
          <div className="flex flex-col gap-6">
            {data?.stories?.map((story, idx) => {
              // Deterministically assign a fallback image relative to the loop index
              const selectedFallback = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
              
              return (
                <article 
                  key={idx} 
                  className="p-5 md:p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm hover:border-current/[0.1] transition-colors duration-200"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Left Column: Fixed Image Container (Always filled with photography) */}
                    <div className="w-full md:w-48 h-40 md:h-32 relative rounded-xl overflow-hidden bg-current/[0.03] flex-shrink-0 border border-[var(--card-border)]">
                      <img 
                        src={story.image_url && story.image_url.trim() !== "" ? story.image_url : selectedFallback} 
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          // If the image URL is dead or throws a CORS/404 block, swap to fallback photography instantly
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = selectedFallback;
                        }}
                      />
                    </div>

                    {/* Right Column: News Content */}
                    <div className="flex flex-col flex-1 gap-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold tracking-wider uppercase text-[var(--foreground)] opacity-50">
                        <span>{story.publisher}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--foreground)] opacity-30" />
                        <span>{story.published}</span>
                      </div>

                      <h3 className="text-lg font-bold tracking-tight leading-snug text-[var(--foreground)]">
                        {story.title}
                      </h3>

                      <p className="text-[var(--foreground)] opacity-80 text-sm leading-relaxed mt-0.5">
                        {story.summary}
                      </p>

                      <div className="pt-2 mt-auto">
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
                    </div>

                  </div>
                </article>
              );
            })}
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
        <p className="text-[var(--foreground)] opacity-70 font-medium">Generating your briefing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[var(--background)] flex flex-col transition-colors duration-300">
        <header className="w-full max-w-4xl mx-auto px-6 pt-6 flex justify-end">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-current/[0.05] transition-colors shadow-sm"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center flex-1 justify-center">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-xl mb-6 border border-red-500/20">
            {error}
          </div>
          <button 
            onClick={handleGoBack}
            className="px-5 py-2 text-sm font-semibold rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] shadow-sm hover:bg-current/[0.05] transition-all duration-200"
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