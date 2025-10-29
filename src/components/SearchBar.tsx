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
      <div className="flex gap-2">
        <Button
          variant={searchParams.tripType === 'one-way' ? 'default' : 'outline'}
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'one-way', returnDate: null }))}
          className="rounded-full"
        >
          One-way
        </Button>
        <Button
          variant={searchParams.tripType === 'round-trip' ? 'default' : 'outline'}
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'round-trip' }))}
          className="rounded-full"
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

      {/* Search Form */}
      <div className="bg-card rounded-2xl shadow-card p-6 border">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_auto_auto] gap-4 items-end">
          {/* Origin */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">From</label>
            <Popover open={originOpen} onOpenChange={setOriginOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start h-14 text-left font-normal">
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  {searchParams.origin ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{searchParams.origin.name}</span>
                      <span className="text-xs text-muted-foreground">{searchParams.origin.state}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select city</span>
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
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Swap Button */}
          <Button variant="ghost" size="icon" onClick={swapCities} className="mb-2 md:mb-0">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">To</label>
            <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start h-14 text-left font-normal">
                  <MapPin className="mr-2 h-4 w-4 text-accent" />
                  {searchParams.destination ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{searchParams.destination.name}</span>
                      <span className="text-xs text-muted-foreground">{searchParams.destination.state}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select city</span>
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
                <Button variant="outline" className="w-full justify-start h-14 text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {searchParams.departureDate ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">{format(searchParams.departureDate, 'MMM dd')}</span>
                      <span className="text-xs text-muted-foreground">{format(searchParams.departureDate, 'EEEE')}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select date</span>
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
              <label className="text-sm font-medium text-muted-foreground">Return</label>
              <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-14 text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4 text-accent" />
                    {searchParams.returnDate ? (
                      <div className="flex flex-col">
                        <span className="font-semibold">{format(searchParams.returnDate, 'MMM dd')}</span>
                        <span className="text-xs text-muted-foreground">{format(searchParams.returnDate, 'EEEE')}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select date</span>
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

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            disabled={!searchParams.origin || !searchParams.destination || !searchParams.departureDate || (searchParams.tripType === 'round-trip' && !searchParams.returnDate)}
            className="h-14 px-8"
            size="lg"
          >
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
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
