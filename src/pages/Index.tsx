import { useState } from 'react';
import { motion } from 'framer-motion';
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
            backgroundImage: "url('/travel-bg.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transformOrigin: 'center center',
            animation: 'kenburns 22s ease-in-out infinite',
            willChange: 'transform',
          }}
        />

        {/* 🌫 Overlay */}
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

          {/* 💼 Subtitle with Stylish Gradient */}
          <h2
            className="text-4xl md:text-5xl font-extrabold mt-10 mb-3 drop-shadow-2xl inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #7B5CFF 0%, #8F77FF 50%, #C3B4FF 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 10s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Find Your Perfect Journey
          </h2>

          <p className="text-lg text-white font-extrabold max-w-2xl mx-auto tracking-wide drop-shadow-lg">
            Compare flights, trains, and buses across India with intelligent recommendations powered by AI.
          </p>

          {/* 🔹 Feature Icons */}
          <div className="flex flex-wrap justify-center gap-6 text-base mt-8 mb-12 font-extrabold tracking-wide text-white">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-800 shadow-md">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span>Best Prices</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-tr from-violet-500 to-purple-800 shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span>AI Recommendations</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-700 shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span>Secure Booking</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-700 shadow-md">
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

      {/* ================= WHY CHOOSE SECTION (animated) ================= */}
      {!searchResults && !isSearching && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: -12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-extrabold text-gray-900 mb-4"
              >
                Why Choose Our Platform?
              </motion.h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the future of travel booking with AI-powered recommendations and real-time intelligence.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  title: 'AI Recommendations',
                  desc: 'Our model continuously learns to provide the best, cheapest, and fastest travel options.',
                  Icon: Sparkles,
                },
                {
                  title: 'Live Price Comparison',
                  desc: 'Real-time prices from AbhiBus, RedBus, IRCTC, and MakeMyTrip — all compared instantly.',
                  Icon: TrendingUp,
                },
                {
                  title: 'Smart Search',
                  desc: 'Intelligent autocomplete with typo tolerance and dynamic mode filtering for easy booking.',
                  Icon: Shield,
                },
              ].map((card, i) => {
                const Icon = card.Icon;
                return (
                  <motion.div
                    key={card.title}
                    className="group bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-200 hover:bg-gradient-to-b hover:from-white hover:to-indigo-50 cursor-pointer"
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.12 }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-md group-hover:scale-110 transform transition">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700">
                      {card.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
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
