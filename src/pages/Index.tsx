import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ResultsView } from '@/components/ResultsView';
import { SearchParams, SearchResults } from '@/types/travel';
import { generateMockResults } from '@/utils/mockData';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setIsSearching(true);
    setTimeout(() => {
      const results = generateMockResults(params);
      setSearchResults(results);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ---------------- Animations ---------------- */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes kenburns {
          0% { transform: scale(1) translateX(0%); }
          50% { transform: scale(1.08) translateX(-1%); }
          100% { transform: scale(1) translateX(0%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .kb-anim { animation: none !important; }
          .title-shimmer { animation: none !important; }
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <header className="relative overflow-hidden border-b">
        {/* ✈️ Background Image */}
        <div
          aria-hidden
          className="absolute inset-0 kb-anim"
          style={{
            backgroundImage: "url('/travel-bg.png')", // ✅ Image from public/
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transformOrigin: 'center center',
            animation: 'kenburns 30s ease-in-out infinite',
            willChange: 'transform',
          }}
        />

        {/* 🌅 Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

        {/* 🌐 Decorative subtle pattern */}
        <div
          className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iaHNsKDIyMSA4MyUgNTMlIC8gMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')",
            backgroundSize: '160px',
          }}
        />

        {/* ================= HERO CONTENT ================= */}
        <div className="relative container mx-auto px-4 py-28 text-center text-white">
          {/* 🌈 Animated Gradient Title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent inline-block title-shimmer"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #8C80FF 0%, #AFA5FF 45%, #D2C8FF 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 10s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            VoyageAI
          </h1>

          {/* 🗣️ Tagline & Quote */}
          <p className="mt-4 text-base md:text-lg text-white/90 max-w-2xl mx-auto">
            AI that finds your cheapest way to go
          </p>
          <p className="mt-3 italic text-sm md:text-base text-white/80 max-w-3xl mx-auto">
            “Travel not to escape life, but so life doesn't escape you — arrive, explore, enjoy.”
          </p>

          {/* ✨ Subtitle */}
          <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-4 text-white">
            Find Your Perfect Journey
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Compare flights, trains, and buses across India with intelligent recommendations powered by AI.
          </p>

          {/* 💡 Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mt-10 mb-12">
            <div className="flex items-center gap-2 text-white/90">
              <div className="p-2 rounded-lg bg-white/10">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span>Best Prices</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="p-2 rounded-lg bg-white/10">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span>AI Recommendations</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="p-2 rounded-lg bg-white/10">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="p-2 rounded-lg bg-white/10">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span>Instant Results</span>
            </div>
          </div>

          {/* 🔍 Search Bar */}
          <div className="mx-auto max-w-3xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* ================= SEARCH LOADING ================= */}
      {isSearching && (
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-xl font-semibold">Searching for the best options...</p>
          <p className="text-white/70">Our AI is analyzing thousands of routes</p>
        </div>
      )}

      {/* ================= RESULTS ================= */}
      {searchResults && !isSearching && (
        <div className="container mx-auto px-4 py-12">
          <ResultsView results={searchResults} />
        </div>
      )}

      {/* ================= FEATURES SECTION ================= */}
      {!searchResults && !isSearching && (
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose VoyageAI?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Experience the future of travel booking with AI-powered recommendations.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Sparkles className="h-8 w-8 text-white" />,
                title: 'AI Recommendations',
                desc: 'Our reinforcement learning model learns to provide the best, cheapest, and fastest options.',
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-white" />,
                title: 'Live Price Comparison',
                desc: 'Get real-time fares from RedBus, IRCTC, AbhiBus, MakeMyTrip, and more.',
              },
              {
                icon: <Shield className="h-8 w-8 text-white" />,
                title: 'Smart Search',
                desc: 'Intelligent autocomplete with typo tolerance and mode filtering.',
              },
            ].map((f, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="border-t py-8 mt-20 text-center text-sm text-muted-foreground">
        <p>© 2025 VoyageAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
