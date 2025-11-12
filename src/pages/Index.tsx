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
    <div className="min-h-screen bg-background text-white">
      {/* Small keyframe animations used for subtle effects */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes kenburns {
          0% { transform: scale(1) translateX(0%); }
          50% { transform: scale(1.05) translateX(-2%); }
          100% { transform: scale(1) translateX(0%); }
        }

        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 12px rgba(140, 100, 255, 0.45); }
          50% { text-shadow: 0 0 20px rgba(170, 130, 255, 0.75); }
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <header className="relative overflow-hidden border-b">
        {/* Background image (place travel-bg.png in /public/) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/travel-bg.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transformOrigin: 'center center',
            animation: 'kenburns 22s ease-in-out infinite',
            willChange: 'transform',
          }}
        />

        {/* Dark overlay to help text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />

        {/* ================= CENTERED PANEL (translucent + blur) ================= */}
        <div className="relative container mx-auto px-4 py-28">
          <div className="mx-auto max-w-4xl rounded-xl bg-black/30 backdrop-blur-md border border-white/10 p-8">
            <div className="text-center">
              {/* VoyageAI title - strong gradient + subtle glow */}
              <h1
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #4F46E5 0%, #7C3AED 45%, #A78BFA 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 8s ease infinite, glowPulse 6s ease-in-out infinite',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                VoyageAI
              </h1>

              {/* Tagline */}
              <p className="mt-4 text-lg font-semibold text-violet-300 drop-shadow-md">
                AI that finds your cheapest way to go
              </p>

              {/* Quote */}
              <p className="mt-2 italic text-base md:text-lg text-indigo-300 max-w-3xl mx-auto drop-shadow">
                “Travel not to escape life, but so life doesn't escape you — arrive, explore, enjoy.”
              </p>

              {/* Subtitle */}
              <h2 className="text-2xl md:text-3xl font-extrabold mt-8 mb-3">
                <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                  Find Your Perfect Journey
                </span>
              </h2>

              <p className="text-lg text-slate-200 max-w-2xl mx-auto">
                Compare flights, trains, and buses across India with intelligent recommendations powered by AI.
              </p>

              {/* Feature icons - stronger contrast and tint */}
              <div className="flex flex-wrap justify-center gap-6 text-sm mt-8 mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-700/20 backdrop-blur-sm">
                    <TrendingUp className="h-4 w-4 text-indigo-200" />
                  </div>
                  <span className="text-indigo-200 font-medium">Best Prices</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-violet-700/20 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4 text-violet-200" />
                  </div>
                  <span className="text-violet-200 font-medium">AI Recommendations</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-700/20 backdrop-blur-sm">
                    <Shield className="h-4 w-4 text-blue-200" />
                  </div>
                  <span className="text-blue-200 font-medium">Secure Booking</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-700/20 backdrop-blur-sm">
                    <Zap className="h-4 w-4 text-purple-200" />
                  </div>
                  <span className="text-purple-200 font-medium">Instant Results</span>
                </div>
              </div>

              {/* Search bar (keeps existing component) */}
              <div className="mx-auto max-w-3xl">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= SEARCHING ================= */}
      {isSearching && (
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-xl font-semibold">Searching for the best options...</p>
          <p className="text-white/70">Our AI is analyzing thousands of routes</p>
        </div>
      )}

      {/* ================= RESULTS ================= */}
      {searchResults && !isSearching && (
        <div className="container mx-auto px-4 py-12">
          <ResultsView results={searchResults} />
        </div>
      )}

      {/* ================= WHY CHOOSE SECTION ================= */}
      {!searchResults && !isSearching && (
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Why Choose Our Platform?</h2>
            <p className="text-white/85 max-w-2xl mx-auto">
              Experience the future of travel booking with AI-powered recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 border border-white/10 shadow-lg hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
              <p className="text-white/85">
                Our model continuously learns to provide the best, cheapest, and fastest options.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 border border-white/10 shadow-lg hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Live Price Comparison</h3>
              <p className="text-white/85">
                Real-time prices from multiple providers including AbhiBus, RedBus, IRCTC, and MakeMyTrip.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 border border-white/10 shadow-lg hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Smart Search</h3>
              <p className="text-white/85">
                Intelligent autocomplete with typo tolerance and dynamic transport mode filtering.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/20 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-white/70">
          <p>© 2025 VoyageAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
