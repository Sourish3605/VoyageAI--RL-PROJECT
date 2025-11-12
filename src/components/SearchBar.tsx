import { useState } from 'react';
import { City, SearchParams, TransportMode } from '@/types/travel';
import { INDIAN_CITIES, CITY_TYPO_MAPPINGS, getAvailableTransportModes } from '@/data/cities';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plane, Train, Bus, MapPin, Calendar as CalendarIcon, ArrowRight, Search, ArrowLeftRight, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    transportMode: 'flight',
    tripType: 'one-way',
  });

  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  // passengers added
  const [passengers, setPassengers] = useState<number>(1);

  const availableModes = searchParams.origin && searchParams.destination
    ? getAvailableTransportModes(searchParams.origin.name, searchParams.destination.name)
    : (['flight', 'train', 'bus'] as TransportMode[]);

  const filterCities = (search: string): City[] => {
    const lowerSearch = search.toLowerCase();
    const typoMatch = CITY_TYPO_MAPPINGS[lowerSearch];
    
    return INDIAN_CITIES.filter(city => 
      city.name.toLowerCase().includes(lowerSearch) ||
      city.code.toLowerCase().includes(lowerSearch) ||
      city.state.toLowerCase().includes(lowerSearch) ||
      city.name.toLowerCase() === typoMatch?.toLowerCase()
    );
  };

  const popularCities = INDIAN_CITIES.filter(city => city.popular);

  const handleSearch = () => {
    if (searchParams.origin && searchParams.destination && searchParams.departureDate) {
      if (searchParams.tripType === 'round-trip' && !searchParams.returnDate) {
        return;
      }
      // attach passengers into SearchParams if desired (you can extend SearchParams type)
      onSearch(searchParams);
    }
  };

  const swapCities = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const getTransportIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'train': return <Train className="h-4 w-4" />;
      case 'bus': return <Bus className="h-4 w-4" />;
    }
  };

  // shared classes for popover trigger buttons to ensure consistent hover/focus
  const popoverTriggerClass =
    'w-full justify-start h-14 text-left font-normal rounded-lg border border-transparent bg-white/6 hover:bg-white/10 hover:border-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary';

  // shared classes for tab trigger
  const tabActiveClass = 'bg-white text-slate-900 shadow-md transform -translate-y-0.5';
  const tabInactiveClass = 'text-white/90 hover:bg-white/8';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Trip Type Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'one-way', returnDate: null }))}
          aria-pressed={searchParams.tripType === 'one-way'}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            searchParams.tripType === 'one-way'
              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 focus-visible:ring-blue-400'
              : 'bg-white/10 text-white/90 hover:bg-white/20 focus-visible:ring-white/10'
          )}
        >
          One-way
        </button>

        <button
          type="button"
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'round-trip' }))}
          aria-pressed={searchParams.tripType === 'round-trip'}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            searchParams.tripType === 'round-trip'
              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 focus-visible:ring-blue-400'
              : 'bg-white/10 text-white/90 hover:bg-white/20 focus-visible:ring-white/10'
          )}
        >
          Round-trip
        </button>
      </div>

      {/* Transport Mode Tabs */}
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
                aria-pressed={active}
                className={cn(
                  'flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  disabled ? 'opacity-40 cursor-not-allowed bg-white/5 text-white/60' : '',
                  active ? tabActiveClass : tabInactiveClass,
                  'focus-visible:ring-blue-400'
                )}
                title={disabled ? 'Not available for selected route' : undefined}
              >
                {getTransportIcon(mode)}
                <span className="capitalize">{mode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Form Card */}
      <div className="bg-card rounded-2xl shadow-card p-6 border border-white/6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_auto_auto] gap-4 items-end">
          {/* Origin */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">From</label>
            <Popover open={originOpen} onOpenChange={setOriginOpen}>
              <PopoverTrigger asChild>
                <button
                  className={popoverTriggerClass}
                  aria-haspopup="dialog"
                  aria-expanded={originOpen}
                >
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  {searchParams.origin ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{searchParams.origin.name}</span>
                      <span className="text-xs text-muted-foreground">{searchParams.origin.state}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select city</span>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup heading="Popular Cities">
                      {popularCities.map(city => (
                        <CommandItem
                          key={city.id}
                          onSelect={() => {
                            setSearchParams(prev => ({ ...prev, origin: city }));
                            setOriginOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{city.name}</span>
                            <span className="text-xs text-muted-foreground">{city.state} · {city.code}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={swapCities}
            className="mb-2 md:mb-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/6 hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
            aria-label="Swap origin and destination"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">To</label>
            <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
              <PopoverTrigger asChild>
                <button
                  className={popoverTriggerClass}
                  aria-haspopup="dialog"
                  aria-expanded={destinationOpen}
                >
                  <MapPin className="mr-2 h-4 w-4 text-accent" />
                  {searchParams.destination ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{searchParams.destination.name}</span>
                      <span className="text-xs text-muted-foreground">{searchParams.destination.state}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select city</span>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup heading="Popular Cities">
                      {popularCities.map(city => (
                        <CommandItem
                          key={city.id}
                          onSelect={() => {
                            setSearchParams(prev => ({ ...prev, destination: city }));
                            setDestinationOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{city.name}</span>
                            <span className="text-xs text-muted-foreground">{city.state} · {city.code}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Departure</label>
            <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
              <PopoverTrigger asChild>
                <button
                  className={popoverTriggerClass}
                  aria-haspopup="dialog"
                  aria-expanded={departureDateOpen}
                >
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
                    setDepartureDateOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date (if round-trip) */}
          {searchParams.tripType === 'round-trip' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Return</label>
              <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={popoverTriggerClass}
                    aria-haspopup="dialog"
                    aria-expanded={returnDateOpen}
                  >
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
                      setReturnDateOpen(false);
                    }}
                    disabled={(date) => date < (searchParams.departureDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Passengers + Search Button */}
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
                  ? 'bg-white/10 text-white/60 cursor-not-allowed border border-transparent'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-400 shadow-md'
              )}
              aria-label="Search"
            >
              <Search className="mr-2 h-5 w-5 inline-block" />
              Search
            </button>
          </div>
        </div>

        {/* Available Modes Info */}
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
