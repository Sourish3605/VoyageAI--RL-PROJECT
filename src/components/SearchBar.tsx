import { useState } from 'react';
import { City, SearchParams, TransportMode } from '@/types/travel';
import { INDIAN_CITIES, CITY_TYPO_MAPPINGS, getAvailableTransportModes } from '@/data/cities';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plane, Train, Bus, MapPin, Calendar as CalendarIcon, ArrowRight, Search, ArrowLeftRight } from 'lucide-react';
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Trip Type Toggle */}
      <div className="flex gap-3">
        <Button
          onClick={() =>
            setSearchParams(prev => ({ ...prev, tripType: 'one-way', returnDate: null }))
          }
          className={cn(
            "rounded-full px-5 py-2 font-medium transition-all",
            searchParams.tripType === "one-way"
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
              : "bg-violet-700/30 text-violet-200 hover:bg-violet-700/50"
          )}
        >
          One-way
        </Button>
        
        <Button
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'round-trip' }))}
          className={cn(
            "rounded-full px-5 py-2 font-medium transition-all",
            searchParams.tripType === "round-trip"
              ? "bg-violet-600 text-white shadow-md hover:bg-violet-700"
              : "bg-blue-700/30 text-blue-200 hover:bg-blue-700/50"
          )}
        >
          Round-trip
        </Button>
      </div>

      {/* Transport Mode Tabs */}
      <Tabs value={searchParams.transportMode} onValueChange={(value) => setSearchParams(prev => ({ ...prev, transportMode: value as TransportMode }))}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          {(['flight', 'train', 'bus'] as TransportMode[]).map(mode => (
            <TabsTrigger 
              key={mode} 
              value={mode} 
              disabled={!availableModes.includes(mode)}
              className="flex items-center gap-2"
            >
              {getTransportIcon(mode)}
              <span className="capitalize">{mode}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search Form — DARK (flexible search column) */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-700 
                text-white rounded-2xl shadow-lg 
                px-8 py-6 border border-transparent overflow-auto relative 
                w-[200%] max-w-7xl mx-auto">

        {/* grid: last column flexible via minmax(180px, 1fr) so Search can grow/shrink */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_auto_minmax(180px,1fr)] gap-4 items-end">
          {/* Origin */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">From</label>
            <Popover open={originOpen} onOpenChange={setOriginOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start h-14 text-left font-normal bg-transparent text-white border-white/20">
                  <MapPin className="mr-2 h-4 w-4 text-white/85" />
                  {searchParams.origin ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{searchParams.origin.name}</span>
                      <span className="text-xs text-slate-300">{searchParams.origin.state}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300">Select city</span>
                  )}
                </Button>
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

                    {/* dynamic search results */}
                    {INDIAN_CITIES.slice(0, 0) /* placeholder to keep lint quiet */}
                    <CommandGroup heading="All Cities">
                      {INDIAN_CITIES.map(city => (
                        <CommandItem
                          key={`${city.id}-all`}
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
          <div className="flex items-end mb-2 md:mb-0">
            <Button variant="ghost" size="icon" onClick={swapCities} className="text-white/90">
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">To</label>
            <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start h-14 text-left font-normal bg-transparent text-white border-white/20">
                  <MapPin className="mr-2 h-4 w-4 text-white/85" />
                  {searchParams.destination ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{searchParams.destination.name}</span>
                      <span className="text-xs text-slate-300">{searchParams.destination.state}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300">Select city</span>
                  )}
                </Button>
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

                    <CommandGroup heading="All Cities">
                      {INDIAN_CITIES.map(city => (
                        <CommandItem
                          key={`${city.id}-all-dest`}
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

          {/* Departure */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Departure</label>
            <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start h-14 text-left font-normal bg-transparent text-white border-white/20">
                  <CalendarIcon className="mr-2 h-4 w-4 text-white/85" />
                  {searchParams.departureDate ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{format(searchParams.departureDate, 'MMM dd')}</span>
                      <span className="text-xs text-slate-300">{format(searchParams.departureDate, 'EEEE')}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300">Select date</span>
                  )}
                </Button>
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
              <label className="text-sm font-medium text-slate-200">Return</label>
              <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-14 text-left font-normal bg-transparent text-white border-white/20">
                    <CalendarIcon className="mr-2 h-4 w-4 text-white/85" />
                    {searchParams.returnDate ? (
                      <div className="flex flex-col">
                        <span className="font-semibold">{format(searchParams.returnDate, 'MMM dd')}</span>
                        <span className="text-xs text-slate-300">{format(searchParams.returnDate, 'EEEE')}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">Select date</span>
                    )}
                  </Button>
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

          {/* Search Button (flexible column; will grow if space available) */}
          <div className="justify-self-end w-full md:w-auto">
            <Button
              onClick={handleSearch}
              disabled={!searchParams.origin || !searchParams.destination || !searchParams.departureDate || (searchParams.tripType === 'round-trip' && !searchParams.returnDate)}
              className="h-14 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md w-full md:w-auto justify-center"
              size="lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>

        {/* Available Modes Info */}
        {searchParams.origin && searchParams.destination && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
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



