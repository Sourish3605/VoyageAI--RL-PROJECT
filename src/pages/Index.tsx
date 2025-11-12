import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ResultsView } from '@/components/ResultsView';
import { SearchParams, SearchResults } from '@/types/travel';
import { generateMockResults } from '@/utils/mockData';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      {/* ---------- Animations & helpers ---------- */}
      <style>{`
        /* title shimmer */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Ken Burns slow zoom + subtle pan */
        @keyframes kenburns {
          0% { transform: scale(1) translateX(0%); }
          50% { transform: scale(1.08) translateX(-1%); }
          100% { transform: scale(1) translateX(0%); }
        }

        /* entrance fade-up */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .kb-anim { animation: none !important; }
          .title-shimmer { animation: none !important; }
          .fade-up { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden border-b">
        {/* Background image layer */}
        <div
          aria-hidden
          className="absolute inset-0 kb-anim"
          style={{
            backgroundImage: "url('/travel-bg.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transformOrigin: 'center center',
            animation: 'kenburns 30s ease-in-out infinite',
            willChange: 'transform',
          }}
        />

        {/* Dark overlay + slight blur for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/65 backdrop-blur-[1px]" />

        {/* Decorative subtle pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-6 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iaHNsKDIyMSA4MyUgNTMlIC8gMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')",
            backgroundSize: '160px',
          }}
        />

        {/* Content */}
        <div className="relative container mx-auto px-4 py-32 text-center text-white">
          {/* Title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight
                       bg-clip-text text-transparent inline-block title-shimmer fade-up"
            style={{
              backgroundImage: 'linear-gradient(90deg, #8C80FF 0%, #AFA5FF 45%, #D2C8FF 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 10s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animationDelay: '0.05s',
              animationName: 'gradientShift',
              animationTimingFunction: 'ease',
            }}
          >
            VoyageAI
          </h1>

          {/* Tagline */}
          <p
            className="mt-4 text-base md:text-lg text-white/90 max-w-2xl mx-auto fade-up"
            style={{ animation: 'fadeUp 520ms ease both', animationDelay: '0.15s' }}
          >
            AI that finds your cheapest way to go
          </p>

          {/* Quote */}
          <p
            className="mt-3 italic text-sm md:text-base text-white/80 max-w-3xl mx-auto fade-up"
            style={{ animation: 'fadeUp 520ms ease both', animationDelay: '0.25s' }}
          >
            “Travel not to escape life, but so life doesn't escape you — arrive, explore, enjoy.”
          </p>

          {/* Subtitle (more prominent) */}
          <h2
            className="text-3xl md:text-4xl font-semibold mt-10 mb-3 text-white drop-shadow-md fade-up"
            style={{ animation: 'fadeUp 520ms ease both', animationDelay: '0.35s' }}
          >
            Reach Your Destination and Enjoy
          </h2>

          <p
            className="text-base md:text-lg text-white/80 max-w-3xl mx-auto mb-8 fade-up"
            style={{ animation: 'fadeUp 520ms ease both', animationDelay: '0.45s' }}
          >
            Compare flights, trains, and buses across India with intelligent recommendations powered by AI.
          </p>

          {/* Feature icons */}
          <div
            className="flex flex-wrap justify-center gap-6 text-sm mb-10 fade-up"
            style={{ animation: 'fadeUp 520ms ease both', animationDelay: '0.55s' }}
          >
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

          {/* SearchBar container with backdrop blur and slight card look */}
          <div
            className="mx-auto max-w-3xl backdrop-blur-md bg-white/6 rounded-xl p-4 shadow-lg fade-up"
            style={{ animation: 'fadeUp 520ms ease both', animationDelay: '0.65s' }}
          >
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* ================= Loading state ================= */}
      {isSearching && (
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-xl font-semibold">Searching for the best options...</p>
          <p className="text-white/70">Our AI is analyzing thousands of routes</p>
        </div>
      )}

      {/* ================= Results ================= */}
      {searchResults && !isSearching && (
        <div className="container mx-auto px-4 py-12">
          <ResultsView results={searchResults} />
        </div>
      )}

      {/* ================= Fallback / Features ================= */}
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

      {/* ================= Footer ================= */}
      <footer className="border-t py-8 mt-20 text-center text-sm text-muted-foreground">
        <p>© 2025 VoyageAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
