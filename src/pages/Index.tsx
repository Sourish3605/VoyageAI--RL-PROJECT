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
      {/* Inject keyframes for the gradient shimmer */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <header className="relative overflow-hidden bg-gradient-to-b from-white/80 to-primary/5 border-b">
        {/* Subtle SVG pattern background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iaHNsKDIyMSA4MyUgNTMlIC8gMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />

        {/* Content */}
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center mb-10">
            {/* Brand Name with animated gradient shimmer */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent"
              style={{
                background:
                  'linear-gradient(90deg, #7B6FF0 0%, #8F84F8 45%, #B9A7FF 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 6s ease infinite',
              }}
            >
              VoyageAI
            </h1>

            {/* Tagline */}
            <p className="mt-3 text-base md:text-lg text-[#5F6E9D] max-w-2xl mx-auto">
              AI that finds your cheapest way to go
            </p>

            {/* Subtitle */}
            <h2 className="text-3xl md:text-4xl font-semibold mt-8 mb-3 text-slate-800">
              Find Your Perfect Journey
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare flights, trains, and buses across India with intelligent recommendations powered by AI.
            </p>
          </div>

          {/* Icons Row */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span>Best Prices</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <span>AI Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-success/10">
                <Shield className="h-4 w-4 text-success" />
              </div>
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <Zap className="h-4 w-4 text-warning" />
              </div>
              <span>Instant Results</span>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* ================= SEARCH LOADING ================= */}
      {isSearching && (
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-4">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-xl font-semibold">Searching for the best options...</p>
              <p className="text-muted-foreground">Our AI is analyzing thousands of routes</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= RESULTS ================= */}
      {searchResults && !isSearching && (
        <div className="container mx-auto px-4 py-12">
          <ResultsView results={searchResults} />
        </div>
      )}

      {/* ================= FEATURES SECTION (Default View) ================= */}
      {!searchResults && !isSearching && (
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of travel booking with AI-powered recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-6 rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">AI Recommendations</h3>
              <p className="text-muted-foreground">
                Our reinforcement learning model continuously learns to provide the best, cheapest, and fastest options.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Live Price Comparison</h3>
              <p className="text-muted-foreground">
                Real-time prices from multiple providers including AbhiBus, RedBus, IRCTC, and MakeMyTrip.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Smart Search</h3>
              <p className="text-muted-foreground">
                Intelligent autocomplete with typo tolerance and dynamic transport mode filtering.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 VoyageAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
