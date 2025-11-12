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
      {/* 🎨 Animations */}
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
          0%, 100% { text-shadow: 0 0 15px rgba(180, 150, 255, 0.7); }
          50% { text-shadow: 0 0 25px rgba(200, 170, 255, 1); }
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <header className="relative overflow-hidden border-b">
        {/* 🌄 Background image */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/travel-bg.png')", // Place your hero image in /public/
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transformOrigin: 'center center',
            animation: 'kenburns 22s ease-in-out infinite',
            willChange: 'transform',
          }}
        />

        {/* 🌫 Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* ================= TEXT CONTENT ================= */}
        <div className="relative container mx-auto px-4 py-32 text-center">
          {/* 🟣 Glowing VoyageAI Title */}
          <h1
            className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight
                       bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #A88BFC 0%, #BA9FFF 45%, #CBB7FF 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 8s ease infinite, glowPulse 5s ease-in-out infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.02em',
            }}
          >
            VoyageAI
          </h1>

          {/* 🩵 Tagline */}
          <p className="mt-4 text-lg font-extrabold text-white tracking-wide drop-shadow-lg">
            AI that finds your cheapest way to go
          </p>

          {/* ✈️ Inspirational Quote */}
          <p className="mt-2 italic text-base md:text-lg font-extrabold text-white max-w-3xl mx-auto drop-shadow-lg">
            “Travel not to escape life, but so life doesn't escape you — arrive, explore, enjoy.”
          </p>

          {/* 💼 Subtitle */}
          <h2 className="text-3xl md:text-4xl font-extrabold mt-10 mb-3 text-white drop-shadow-2xl">
            Find Your Perfect Journey
          </h2>

          <p className="text-lg text-white font-extrabold max-w-2xl mx-auto tracking-wide drop-shadow-lg">
            Compare flights, trains, and buses across India with intelligent recommendations powered by AI.
          </p>

          {/* 🔹 Feature Icons */}
          <div className="flex flex-wrap justify-center gap-6 text-base mt-8 mb-12 font-extrabold tracking-wide text-white">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span>Best Prices</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span>AI Recommendations</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span>Secure Booking</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <Zap className="h-5 w-5 text-white" />
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
            <h2 className="text-3xl font-bold mb-4 text-white">
              Why Choose Our Platform?
            </h2>
            <p className="text-white/85 max-w-2xl mx-auto">
              Experience the future of travel booking with AI-powered recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
              <p className="text-white/85">
                Our model continuously learns to provide the best, cheapest, and fastest options.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Live Price Comparison</h3>
              <p className="text-white/85">
                Real-time prices from multiple providers including AbhiBus, RedBus, IRCTC, and MakeMyTrip.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all">
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
