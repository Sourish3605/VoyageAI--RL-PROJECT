import React, { useState, useMemo } from 'react';
import { City, SearchParams, TransportMode } from '@/types/travel';
import { INDIAN_CITIES, CITY_TYPO_MAPPINGS, getAvailableTransportModes } from '@/data/cities';
import { Plane, Train, Bus, MapPin, Calendar as CalendarIcon, ArrowLeftRight, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

/**
 * Simple, reliable SearchBar where all selected values are visible
 * at all times (no popover-only visibility).
 *
 * - origin/destination: <select> built from INDIAN_CITIES
 * - date: <input type="date">
 * - passengers: number input with +/- controls
 * - transport mode tabs (flight/train/bus)
 * - one-way / round-trip toggle
 *
 * This is intentionally straightforward (works across browsers and doesn't
 * rely on popover interactions for the presence of the selected values).
 */
export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    transportMode: 'flight',
    tripType: 'one-way',
  });

  const [passengers, setPassengers] = useState<number>(1);

  // quick derived list for selects (you can limit or sort differently)
  const cityOptions = useMemo(() => INDIAN_CITIES, []);

  const availableModes = searchParams.origin && searchParams.destination
    ? getAvailableTransportModes(searchParams.origin.name, searchParams.destination.name)
    : (['flight', 'train', 'bus'] as TransportMode[]);

  const setOriginById = (id: string) => {
    const c = INDIAN_CITIES.find(x => x.id === id) || null;
    setSearchParams(prev => ({ ...prev, origin: c }));
  };

  const setDestinationById = (id: string) => {
    const c = INDIAN_CITIES.find(x => x.id === id) || null;
    setSearchParams(prev => ({ ...prev, destination: c }));
  };

  const handleDepartureChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, departureDate: value ? new Date(value) : null }));
  };

  const handleReturnChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, returnDate: value ? new Date(value) : null }));
  };

  const swapCities = () => {
    setSearchParams(prev => ({ ...prev, origin: prev.destination, destination: prev.origin }));
  };

  const handleSearch = () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) return;
    if (searchParams.tripType === 'round-trip' && !searchParams.returnDate) return;
    // attach passengers if your SearchParams type supports it (not in the snippet)
    onSearch(searchParams);
  };

  const getTransportIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'train': return <Train className="h-4 w-4" />;
      case 'bus': return <Bus className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Trip type */}
      <div className="flex gap-3">
        <button
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'one-way', returnDate: null }))}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            searchParams.tripType === 'one-way' ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-white/90'
          )}
        >
          One-way
        </button>

        <button
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'round-trip' }))}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            searchParams.tripType === 'round-trip' ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-white/90'
          )}
        >
          Round-trip
        </button>
      </div>

      {/* Transport mode tabs */}
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
                  'flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
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

      {/* Search form (always-visible controls) */}
      <div className="bg-card rounded-2xl shadow-card p-6 border border-white/6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_auto_auto] gap-4 items-end">
          {/* From - select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">From</label>
            <select
              value={searchParams.origin?.id || ''}
              onChange={(e) => setOriginById(e.target.value)}
              className="w-full h-14 px-4 rounded-lg bg-white/90 text-slate-900 shadow-sm border border-transparent hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select city</option>
              {cityOptions.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.state} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <button
            type="button"
            onClick={swapCities}
            className="mb-2 md:mb-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/6 hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
            aria-label="Swap origin and destination"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>

          {/* To - select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">To</label>
            <select
              value={searchParams.destination?.id || ''}
              onChange={(e) => setDestinationById(e.target.value)}
              className="w-full h-14 px-4 rounded-lg bg-white/90 text-slate-900 shadow-sm border border-transparent hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select city</option>
              {cityOptions.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.state} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Departure - visible date input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Departure</label>
            <input
              type="date"
              onChange={(e) => handleDepartureChange(e.target.value)}
              value={searchParams.departureDate ? format(searchParams.departureDate, 'yyyy-MM-dd') : ''}
              className="w-full h-14 px-4 rounded-lg bg-white/90 text-slate-900 shadow-sm border border-transparent hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Return - visible when round-trip */}
          {searchParams.tripType === 'round-trip' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Return</label>
              <input
                type="date"
                onChange={(e) => handleReturnChange(e.target.value)}
                value={searchParams.returnDate ? format(searchParams.returnDate, 'yyyy-MM-dd') : ''}
                className="w-full h-14 px-4 rounded-lg bg-white/90 text-slate-900 shadow-sm border border-transparent hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Passengers + Search */}
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

        {/* Available modes info */}
        {searchParams.origin && searchParams.destination && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Available transport:</span>
            {availableModes.map(mode => (
              <span key={mode} className="px-2 py-1 bg-white/6 rounded-md text-xs capitalize">
                {mode}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
