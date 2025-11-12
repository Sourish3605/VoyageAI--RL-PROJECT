<header className="relative overflow-hidden border-b">
  {/* ✈️ Animated Background Image */}
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

  {/* 🌅 Dark overlay for contrast */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70 backdrop-blur-[2px]" />

  {/* 🌈 Decorative light gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-[#8c80ff]/20 via-transparent to-transparent" />

  {/* ================= HERO CONTENT ================= */}
  <div className="relative container mx-auto px-4 py-32 text-center text-white transition-all duration-700">
    {/* Animated Title */}
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

    {/* Tagline */}
    <p className="mt-4 text-base md:text-lg text-white/90 max-w-2xl mx-auto">
      AI that finds your cheapest way to go
    </p>

    {/* Quote */}
    <p className="mt-3 italic text-sm md:text-base text-white/80 max-w-3xl mx-auto">
      “Travel not to escape life, but so life doesn't escape you — arrive, explore, enjoy.”
    </p>

    {/* Subtitle */}
    <h2 className="text-3xl md:text-4xl font-semibold mt-10 mb-3 text-white drop-shadow-md">
      Reach Your Destination and Enjoy
    </h2>

    <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto mb-8">
      Compare flights, trains, and buses across India with intelligent recommendations powered by AI.
    </p>

    {/* Small Feature Icons */}
    <div className="flex flex-wrap justify-center gap-6 text-sm mb-10">
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

    {/* Search Bar */}
    <div className="mx-auto max-w-3xl backdrop-blur-md bg-white/5 rounded-xl p-4 shadow-lg">
      <SearchBar onSearch={handleSearch} />
    </div>
  </div>
</header>
