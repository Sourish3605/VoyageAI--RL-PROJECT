import React, { useState, useRef, useEffect } from 'react';
import { SearchResults, TravelOption } from '@/types/travel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Train, Bus, Clock, Users, Sparkles, TrendingDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsViewProps {
  results: SearchResults;
}

export const ResultsView = ({ results }: ResultsViewProps) => {
  const [passengers, setPassengers] = useState<Record<string, number>>({});

  // Small mapping: City name -> IRCTC station code (extend as needed)
  const IRCTC_CODES: Record<string, string> = {
    Hyderabad: 'HYB',
    Secunderabad: 'SC',
    Bengaluru: 'SBC',
    Bangalore: 'SBC',
    Chennai: 'MAS',
    Delhi: 'NDLS',
    'New Delhi': 'NDLS',
    Mumbai: 'CSTM',
    'Mumbai Central': 'BCT',
    Pune: 'PUNE',
    Kolkata: 'HWH',
    Howrah: 'HWH',
    Ahmedabad: 'ADI',
    Jaipur: 'JP',
    Lucknow: 'LKO',
    Coimbatore: 'CBE',
    Visakhapatnam: 'VSKP',
    Bhopal: 'BPL',
    Indore: 'INDB',
    Thiruvananthapuram: 'TVC',
    Trivandrum: 'TVC',
    Goa: 'GOA',
    Surat: 'ST',
    Nagpur: 'NGP',
    Patna: 'PNBE',
    Vadodara: 'BRC',
  };

  // Bus site friendly names mapping
  const BUS_CITY_MAP: Record<string, string> = {
    Bengaluru: 'Bengaluru',
    Bangalore: 'Bengaluru',
    'New Delhi': 'New-Delhi',
    'Delhi': 'New-Delhi',
    Hyderabad: 'Hyderabad',
    Secunderabad: 'Secunderabad',
    Chennai: 'Chennai',
    Mumbai: 'Mumbai',
    Pune: 'Pune',
    Bhopal: 'Bhopal',
    Visakhapatnam: 'Visakhapatnam',
    Kolkata: 'Kolkata',
    Ahmedabad: 'Ahmedabad',
    Jaipur: 'Jaipur',
    Lucknow: 'Lucknow',
    Coimbatore: 'Coimbatore',
    Vijayawada: 'Vijayawada',
    Trivandrum: 'Thiruvananthapuram',
    Thiruvananthapuram: 'Thiruvananthapuram',
    Goa: 'Goa',
    Surat: 'Surat',
  };

  const PREFERRED_PARTNERS: Record<string, string[]> = {
    // Flights: official first then aggregators
    'air india': ['Air India', 'MakeMyTrip', 'Goibibo'],
    'indigo': ['IndiGo', 'MakeMyTrip', 'Skyscanner'],
    'spicejet': ['SpiceJet', 'MakeMyTrip', 'Goibibo'],
    'vistara': ['Vistara', 'MakeMyTrip', 'Goibibo'],
    'go first': ['Go First', 'MakeMyTrip', 'Goibibo'],
    'akasa': ['Akasa Air', 'MakeMyTrip', 'Goibibo'],

    // Trains
    'irctc': ['IRCTC', 'MakeMyTrip Trains', 'Goibibo Trains', 'Paytm Trains'],
    'rail': ['IRCTC', 'MakeMyTrip Trains', 'RailYatri'],

    // Buses
    'redbus': ['RedBus', 'MakeMyTrip Bus', 'Goibibo Bus', 'Paytm Bus'],
    'abhibus': ['AbhiBus', 'MakeMyTrip Bus', 'Goibibo Bus', 'Paytm Bus'],
    'travelyaari': ['Travelyaari', 'RedBus', 'AbhiBus'],
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'flight': return <Plane className="h-5 w-5" />;
      case 'train': return <Train className="h-5 w-5" />;
      case 'bus': return <Bus className="h-5 w-5" />;
      default: return null;
    }
  };

  const RecommendationBadge = ({ type }: { type: 'best' | 'cheapest' | 'fastest' }) => {
    const config = {
      best: { icon: Sparkles, label: 'AI Best', color: 'bg-gradient-primary text-white' },
      cheapest: { icon: TrendingDown, label: 'Cheapest', color: 'bg-success text-success-foreground' },
      fastest: { icon: Zap, label: 'Fastest', color: 'bg-warning text-warning-foreground' },
    };
    const Icon = config[type].icon;
    return (
      <Badge className={cn('absolute -top-3 left-4 px-3 py-1', config[type].color)}>
        <Icon className="h-3 w-3 mr-1" />
        {config[type].label}
      </Badge>
    );
  };

  // Returns list of providers with working links. autofill true when URL will be prefilled.
  const getAutofillBookingSites = (option: TravelOption, passengerCount = 1) => {
    const { provider, transportMode, departure, arrival, date } = option as any;

    const depCode = (departure?.code || '').toString().trim();
    const arrCode = (arrival?.code || '').toString().trim();
    const rawFromName = (departure?.location || '').toString().trim();
    const rawToName = (arrival?.location || '').toString().trim();

    const busFrom = BUS_CITY_MAP[rawFromName] || rawFromName || depCode || '';
    const busTo = BUS_CITY_MAP[rawToName] || rawToName || arrCode || '';
    const busFromToken = encodeURIComponent(busFrom.replace(/\s+/g, '-'));
    const busToToken = encodeURIComponent(busTo.replace(/\s+/g, '-'));

    const fromIRCTC = (IRCTC_CODES[rawFromName] || depCode || '').toString().trim();
    const toIRCTC = (IRCTC_CODES[rawToName] || arrCode || '').toString().trim();

    const travelDate = date ? date.split('T')[0] : new Date().toISOString().split('T')[0];

    const sites: { name: string; url: string; autofill: boolean }[] = [];

    // Flights (top picks)
    if (transportMode === 'flight') {
      sites.push({ name: 'IndiGo', url: 'https://www.goindigo.in/', autofill: false });
      sites.push({ name: 'Air India', url: 'https://www.airindia.com/', autofill: false });
      sites.push({ name: 'Vistara', url: 'https://www.airvistara.com/in/en', autofill: false });
      sites.push({ name: 'MakeMyTrip', url: 'https://www.makemytrip.com/flights/', autofill: false });
      sites.push({ name: 'Goibibo', url: 'https://www.goibibo.com/flights/', autofill: false });
      return sites;
    }

    // Trains
    if (transportMode === 'train') {
      if (fromIRCTC && toIRCTC) {
        sites.push({
          name: 'IRCTC',
          url: `https://www.irctc.co.in/nget/train-search?fromCode=${fromIRCTC}&toCode=${toIRCTC}`,
          autofill: true,
        });
      } else {
        sites.push({
          name: 'IRCTC',
          url: 'https://www.irctc.co.in/nget/train-search',
          autofill: false,
        });
      }
      sites.push({ name: 'MakeMyTrip Trains', url: 'https://www.makemytrip.com/railways/', autofill: false });
      sites.push({ name: 'Goibibo Trains', url: 'https://www.goibibo.com/trains/', autofill: false });
      sites.push({ name: 'Paytm Trains', url: 'https://tickets.paytm.com/trains/', autofill: false });
      sites.push({ name: 'RailYatri', url: 'https://www.railyatri.in/', autofill: false });
      return sites;
    }

    // Buses
    if (transportMode === 'bus') {
      if (busFromToken && busToToken) {
        sites.push({
          name: 'RedBus',
          url: `https://www.redbus.in/bus-tickets/${busFromToken}-to-${busToToken}?onward=${travelDate}&pax=${passengerCount}`,
          autofill: true,
        });
        sites.push({
          name: 'AbhiBus',
          url: `https://www.abhibus.com/bus/${busFromToken}-to-${busToToken}?journeyDate=${travelDate}&pax=${passengerCount}`,
          autofill: true,
        });
      } else {
        sites.push({ name: 'RedBus', url: 'https://www.redbus.in/', autofill: false });
        sites.push({ name: 'AbhiBus', url: 'https://www.abhibus.com/', autofill: false });
      }
      sites.push({ name: 'MakeMyTrip Bus', url: 'https://www.makemytrip.com/bus/', autofill: false });
      sites.push({ name: 'Goibibo Bus', url: 'https://www.goibibo.com/bus/', autofill: false });
      sites.push({ name: 'Paytm Bus', url: 'https://tickets.paytm.com/bus', autofill: false });
      return sites;
    }

    return [{ name: 'Default', url: '#', autofill: false }];
  };

  // -----------------------
  // TravelCard (with preferred-partners ordering + animated dropdown)
  // -----------------------
  const TravelCard = ({
    option,
    recommendation,
  }: {
    option: TravelOption;
    recommendation?: 'best' | 'cheapest' | 'fastest';
  }) => {
    const isRecommended = recommendation !== undefined;
    const currentPassengers = passengers[option.id] || 1;

    const bookingSites = getAutofillBookingSites(option, currentPassengers);

    // Helper -> official site detection
    const getOfficialSiteForProvider = (opt: TravelOption) => {
      const p = (opt.provider || '').toLowerCase();
      if (p.includes('indigo')) return { name: 'IndiGo', url: 'https://www.goindigo.in/' };
      if (p.includes('air india') || p.includes('airindia')) return { name: 'Air India', url: 'https://www.airindia.com/' };
      if (p.includes('spicejet')) return { name: 'SpiceJet', url: 'https://book.spicejet.com/' };
      if (p.includes('vistara')) return { name: 'Vistara', url: 'https://www.airvistara.com/in/en' };
      if (p.includes('akasa')) return { name: 'Akasa Air', url: 'https://www.akasaair.com/' };
      if (p.includes('redbus')) return { name: 'RedBus', url: 'https://www.redbus.in/' };
      if (p.includes('abhibus')) return { name: 'AbhiBus', url: 'https://www.abhibus.com/' };
      if (p.includes('irctc')) return { name: 'IRCTC', url: 'https://www.irctc.co.in/nget/train-search' };
      return null;
    };

    // Build ordered list using PREFERRED_PARTNERS
    const official = getOfficialSiteForProvider(option);
    const providerKey = (option.provider || '').toLowerCase();
    // find matching key in PREFERRED_PARTNERS by substring match
    const matchedKey = Object.keys(PREFERRED_PARTNERS).find(k => providerKey.includes(k)) || null;
    const preferredOrder = matchedKey ? PREFERRED_PARTNERS[matchedKey] : [];

    // Start ordered array: official (if present)
    const nameSet = new Set<string>();
    const ordered: { name: string; url: string; autofill?: boolean }[] = [];

    if (official) {
      ordered.push({ name: official.name, url: official.url, autofill: false });
      nameSet.add(official.name.toLowerCase());
    }

    // Add preferred partners in order (only if they exist in bookingSites)
    for (const partnerName of preferredOrder) {
      const match = bookingSites.find(s => s.name.toLowerCase() === partnerName.toLowerCase() || s.name.toLowerCase().includes(partnerName.toLowerCase()));
      if (match && !nameSet.has(match.name.toLowerCase())) {
        ordered.push(match);
        nameSet.add(match.name.toLowerCase());
      }
      if (ordered.length >= 5) break; // limit to 5
    }

    // Add remaining bookingSites (fill up to 5 items)
    for (const s of bookingSites) {
      if (ordered.length >= 5) break;
      if (!nameSet.has(s.name.toLowerCase())) {
        ordered.push(s);
        nameSet.add(s.name.toLowerCase());
      }
    }

    // Dropdown state & refs
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          menuOpen &&
          !menuRef.current?.contains(e.target as Node) &&
          !buttonRef.current?.contains(e.target as Node)
        ) {
          setMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const handleOpenSite = (url: string) => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setMenuOpen(false);
    };

    // Animated dropdown classes
    const dropdownBase = 'absolute right-0 mt-2 w-60 bg-white border rounded-md shadow-lg overflow-hidden z-50 transform transition-all duration-180 ease-out';
    const dropdownVisible = 'opacity-100 translate-y-0';
    const dropdownHidden = 'opacity-0 -translate-y-2 pointer-events-none';

    return (
      <Card className={cn('relative p-6 rounded-2xl shadow-sm', isRecommended && 'border-2 border-primary')}>
        {recommendation && <RecommendationBadge type={recommendation} />}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              {getTransportIcon(option.transportMode)}
            </div>
            <div>
              <p className="font-semibold text-lg">{option.provider}</p>
              <p className="text-xs text-muted-foreground capitalize">{option.transportMode}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xl font-bold text-primary">₹{option.price.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
        </div>

        {/* Time/Route Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-1">
            <p className="text-3xl font-bold">{option.departure.time}</p>
            <p className="text-sm text-muted-foreground mt-1">{option.departure.location}</p>
          </div>

          <div className="flex flex-col items-center md:col-span-1">
            <div className="text-sm text-muted-foreground mb-1">{option.duration}</div>
            <div className="w-full h-px bg-border relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-30" />
            </div>
          </div>

          <div className="text-right md:col-span-1">
            <p className="text-3xl font-bold">{option.arrival.time}</p>
            <p className="text-sm text-muted-foreground mt-1">{option.arrival.location}</p>
          </div>
        </div>

        {/* Meta + Booking */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{option.seats} seats</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{option.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(option.transportMode === 'bus' || option.transportMode === 'train' || option.transportMode === 'flight') && (
              <div className="flex items-center gap-2">
                <label htmlFor={`passengers-${option.id}`} className="text-sm">Passengers:</label>
                <input
                  id={`passengers-${option.id}`}
                  type="number"
                  min={1}
                  max={9}
                  value={passengers[option.id] || 1}
                  className="w-16 px-2 py-1 border rounded-md text-center"
                  onChange={(e) =>
                    setPassengers({
                      ...passengers,
                      [option.id]: Math.max(1, parseInt(e.target.value || '1')),
                    })
                  }
                />
              </div>
            )}

            {/* Single Book CTA */}
            <div className="relative inline-block text-left">
              <button
                ref={buttonRef}
                onClick={() => setMenuOpen((p) => !p)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-blue-700"
                type="button"
              >
                Book
              </button>

              <div
                ref={menuRef}
                className={`${dropdownBase} ${menuOpen ? dropdownVisible : dropdownHidden}`}
                aria-hidden={!menuOpen}
              >
                {ordered.map((site) => (
                  <button
                    key={site.name}
                    onClick={() => handleOpenSite(site.url)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                    type="button"
                  >
                    <span>{site.name}</span>
                    {site.autofill && <span className="text-green-500 text-xs">Auto</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {option.amenities.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-4 border-t mt-4">
            {option.amenities.map((amenity, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Price Stats */}
      <Card className="p-6 bg-gradient-hero border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Lowest Price</p>
            <p className="text-3xl font-bold text-success">₹{results.priceStats.lowest.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Average Price</p>
            <p className="text-3xl font-bold">₹{results.priceStats.average.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Highest Price</p>
            <p className="text-3xl font-bold text-destructive">₹{results.priceStats.highest.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* AI Recommendations */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Recommendations
        </h2>
        <div className="space-y-6">
          <TravelCard option={results.recommendations.best} recommendation="best" />
          <TravelCard option={results.recommendations.cheapest} recommendation="cheapest" />
          <TravelCard option={results.recommendations.fastest} recommendation="fastest" />
        </div>
      </div>

      {/* All Options */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Options ({results.options.length})</h2>
        <div className="space-y-4">
          {results.options
            .filter(option =>
              option.id !== results.recommendations.best.id &&
              option.id !== results.recommendations.cheapest.id &&
              option.id !== results.recommendations.fastest.id
            )
            .map(option => (
              <TravelCard key={option.id} option={option} />
            ))}
        </div>
      </div>
    </div>
  );
};
