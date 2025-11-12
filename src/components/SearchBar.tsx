import React, { useState, useMemo } from 'react';
import { City, SearchParams, TransportMode } from '@/types/travel';
import { INDIAN_CITIES, CITY_TYPO_MAPPINGS, getAvailableTransportModes } from '@/data/cities';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Plane, Train, Bus, MapPin, Calendar as CalendarIcon, ArrowLeftRight, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

/**
 * Popover + Autocomplete search bar that:
 * - shows search popovers for From/To and Date
 * - always displays the *selected* values on the buttons (no hover needed)
 * - closes popovers after selection
 * - keeps accessible hover/focus states
 */
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    transportMode: 'flight',
    tripType: 'one-way',
  });

  const [originOpen, setOriginOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [depOpen, setDepOpen] = useState(false);
  const [retOpen, setRetOpen] = useState(false);

  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [passengers, setPassengers] = useState<number>(1);

  const availableModes = searchParams.origin && searchParams.destination
    ? getAvailableTransportModes(searchParams.origin.name, searchParams.destination.name)
    : (['flight', 'train', 'bus'] as TransportMode[]);

  const typoMatch = (s: string) => CITY_TYPO_MAPPINGS[s?.toLowerCase()] || null;

  const filterCities = (q: string) => {
    const s = (q || '').toLowerCase().trim();
    if (!s) return INDIAN_CITIES.slice(0, 30);
    const mapped = typoMatch(s);
    return INDIAN_CITIES.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.code.toLowerCase().includes(s) ||
      c.state.toLowerCase().includes(s) ||
      (mapped && c.name.toLowerCase() === mapped.toLowerCase())
    );
  };

  const originResults = useMemo(() => filterCities(originQuery), [originQuery]);
  const destResults = useMemo(() => filterCities(destQuery), [destQuery]);

  const popularCities = INDIAN_CITIES.filter(c => c.popular).slice(0, 8);

  const swapCities = () => {
    setSearchParams(prev => ({ ...prev, origin: prev.destination, destination: prev.origin }));
  };

  const handleSearch = () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) return;
    if (searchParams.tripType === 'round-trip' && !searchParams.returnDate) return;
    // (If you want passengers in SearchParams, add the field to type and attach here)
    onSearch(searchParams);
  };

  const getTransportIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'train': return <Train className="h-4 w-4" />;
      case 'bus': return <Bus className="h-4 w-4" />;
      default: return null;
    }
  };

  // shared trigger classes
  const triggerClass =
    'w-full justify-start h-14 text-left font-normal rounded-lg border border-transparent bg-white/6 hover:bg-white/10 hover:border-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Trip type toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'one-way', returnDate: null }))}
          aria-pressed={searchParams.tripType === 'one-way'}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            searchParams.tripType === 'one-way' ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-white/90'
          )}
        >
          One-way
        </button>

        <button
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'round-trip' }))}
          aria-pressed={searchParams.tripType === 'round-trip'}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            searchParams.tripType === 'round-trip' ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-white/90'
          )}
        >
          Round-trip
        </button>
      </div>

      {/* Mode tabs */}
      <div className="w-full max-w-md">
        <div className="grid grid-cols-3 gap-2">
          {(['flight', 'train', 'bus'] as TransportMode[]).map(mode => {
            const active = searchParams.transportMode === mode;
            const disabled = !availableModes.includes(mode);
            return (
              <button
                key={mode}
                onClick={() => !disabled && setSearchParams(prev => ({ ...prev, transportMode: mode }))}
                disabled={disabled}
                className={cn(
                  'flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none',
                  disabled ? 'opacity-40 cursor-not-allowed bg-white/5 text-white/60' : '',
                  active ? 'bg-white text-slate-900 shadow-md' : 'text-white/90 hover:bg-white/8'
                )}
              >
                {getTransportIcon(mode)}
                <span className="capitalize">{mode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search card */}
      <div className="bg-card rounded-2xl shadow-card p-6 border border-white/6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_auto_auto] gap-4 items-end">
          {/* FROM */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">From</label>

            <Popover open={originOpen} onOpenChange={(v) => { setOriginOpen(v); if (!v) setOriginQuery(''); }}>
              <PopoverTrigger asChild>
                <button className={triggerClass} aria-haspopup="dialog" aria-expanded={originOpen}>
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  {searchParams.origin ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{searchParams.origin.name}</span>
                      <span className="text-xs text-muted-foreground">{searchParams.origin.state} · {searchParams.origin.code}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select city</span>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80 p-3" align="start">
                <div className="space-y-2">
                  <input
                    value={originQuery}
                    onChange={(e) => setOriginQuery(e.target.value)}
                    placeholder="Search city..."
                    className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    autoFocus
                  />

                  <div className="max-h-56 overflow-auto space-y-1">
                    {originQuery.trim() === '' ? (
                      <>
                        <div className="text-xs text-muted-foreground mb-1">Popular</div>
                        {popularCities.map(c => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSearchParams(prev => ({ ...prev, origin: c }));
                              setOriginOpen(false);
                              setOriginQuery('');
                            }}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-white/6 transition"
                          >
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.state} · {c.code}</div>
                          </button>
                        ))}
                      </>
                    ) : (
                      originResults.length > 0 ? originResults.slice(0, 100).map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSearchParams(prev => ({ ...prev, origin: c }));
                            setOriginOpen(false);
                            setOriginQuery('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-white/6 transition"
                        >
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.state} · {c.code}</div>
                        </button>
                      )) : (
                        <div className="text-sm text-muted-foreground p-2">No city found.</div>
                      )
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* SWAP */}
          <button
            type="button"
            onClick={swapCities}
            className="mb-2 md:mb-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/6 hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
            aria-label="Swap origin and destination"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>

          {/* TO */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">To</label>

            <Popover open={destOpen} onOpenChange={(v) => { setDestOpen(v); if (!v) setDestQuery(''); }}>
              <PopoverTrigger asChild>
                <button className={triggerClass} aria-haspopup="dialog" aria-expanded={destOpen}>
                  <MapPin className="mr-2 h-4 w-4 text-accent" />
                  {searchParams.destination ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{searchParams.destination.name}</span>
                      <span className="text-xs text-muted-foreground">{searchParams.destination.state} · {searchParams.destination.code}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select city</span>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80 p-3" align="start">
                <div className="space-y-2">
                  <input
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    placeholder="Search city..."
                    className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    autoFocus
                  />

                  <div className="max-h-56 overflow-auto space-y-1">
                    {destQuery.trim() === '' ? (
                      <>
                        <div className="text-xs text-muted-foreground mb-1">Popular</div>
                        {popularCities.map(c => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSearchParams(prev => ({ ...prev, destination: c }));
                              setDestOpen(false);
                              setDestQuery('');
                            }}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-white/6 transition"
                          >
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.state} · {c.code}</div>
                          </button>
                        ))}
                      </>
                    ) : (
                      destResults.length > 0 ? destResults.slice(0, 100).map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSearchParams(prev => ({ ...prev, destination: c }));
                            setDestOpen(false);
                            setDestQuery('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-white/6 transition"
                        >
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.state} · {c.code}</div>
                        </button>
                      )) : (
                        <div className="text-sm text-muted-foreground p-2">No city found.</div>
                      )
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* DEPARTURE */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Departure</label>

            <Popover open={depOpen} onOpenChange={setDepOpen}>
              <PopoverTrigger asChild>
                <button className={triggerClass} aria-haspopup="dialog" aria-expanded={depOpen}>
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {searchParams.departureDate ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{format(searchParams.departureDate, 'MMM dd')}</span>
                      <span className="text-xs text-muted-foreground">{format(searchParams.departureDate, 'EEEE')}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select date</span>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchParams.departureDate || undefined}
                  onSelect={(date) => {
                    setSearchParams(prev => ({ ...prev, departureDate: date || null }));
                    setDepOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* RETURN (round-trip) */}
          {searchParams.tripType === 'round-trip' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Return</label>

              <Popover open={retOpen} onOpenChange={setRetOpen}>
                <PopoverTrigger asChild>
                  <button className={triggerClass} aria-haspopup="dialog" aria-expanded={retOpen}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-accent" />
                    {searchParams.returnDate ? (
                      <div className="flex flex-col">
                        <span className="font-semibold">{format(searchParams.returnDate, 'MMM dd')}</span>
                        <span className="text-xs text-muted-foreground">{format(searchParams.returnDate, 'EEEE')}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select date</span>
                    )}
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchParams.returnDate || undefined}
                    onSelect={(date) => {
                      setSearchParams(prev => ({ ...prev, returnDate: date || null }));
                      setRetOpen(false);
                    }}
                    disabled={(date) => date < (searchParams.departureDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* PASSENGERS + SEARCH */}
          <div className="flex items-center gap-3 justify-end">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Passengers</label>
              <div className="inline-flex items-center bg-white/6 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPassengers(p => Math.max(1, p - 1))}
                  className="px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 hover:bg-white/10 transition"
                  aria-label="Decrease passengers"
                >
                  -
                </button>
                <div className="px-3 py-2 min-w-[48px] text-center">{passengers}</div>
                <button
                  type="button"
                  onClick={() => setPassengers(p => Math.min(9, p + 1))}
                  className="px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 hover:bg-white/10 transition"
                  aria-label="Increase passengers"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={
                !searchParams.origin ||
                !searchParams.destination ||
                !searchParams.departureDate ||
                (searchParams.tripType === 'round-trip' && !searchParams.returnDate)
              }
              className={cn(
                'h-14 px-6 rounded-lg text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                !searchParams.origin || !searchParams.destination || !searchParams.departureDate || (searchParams.tripType === 'round-trip' && !searchParams.returnDate)
                  ? 'bg-white/10 text-white/60 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-400 shadow-md'
              )}
              aria-label="Search"
            >
              <Search className="mr-2 h-5 w-5 inline-block" />
              Search
            </button>
          </div>
        </div>

        {/* available modes badges */}
        {searchParams.origin && searchParams.destination && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Available transport:</span>
            {availableModes.map(mode => (
              <Badge key={mode} variant="secondary" className="capitalize">
                {mode}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
