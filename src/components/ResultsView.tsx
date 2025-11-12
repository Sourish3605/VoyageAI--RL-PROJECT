import React, { useState, useRef, useEffect } from 'react';
import { SearchResults, TravelOption } from '@/types/travel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Train, Bus, Clock, Users, Sparkles, TrendingDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsViewProps {
  results: SearchResults;
}

export const ResultsView = ({ results }: ResultsViewProps) => {
  const [passengers, setPassengers] = useState<Record<string, number>>({});

  const IRCTC_CODES: Record<string, string> = {
    Hyderabad: 'HYB',
    Secunderabad: 'SC',
    Bengaluru: 'SBC',
    Bangalore: 'SBC',
    Chennai: 'MAS',
    Delhi: 'NDLS',
    'New Delhi': 'NDLS',
    Mumbai: 'CSTM',
    Pune: 'PUNE',
    Kolkata: 'HWH',
    Ahmedabad: 'ADI',
    Jaipur: 'JP',
    Lucknow: 'LKO',
    Coimbatore: 'CBE',
    Visakhapatnam: 'VSKP',
    Bhopal: 'BPL',
    Indore: 'INDB',
    Thiruvananthapuram: 'TVC',
    Goa: 'GOA',
    Surat: 'ST',
  };

  const BUS_CITY_MAP: Record<string, string> = {
    Bengaluru: 'Bengaluru',
    Bangalore: 'Bengaluru',
    'New Delhi': 'New-Delhi',
    Delhi: 'New-Delhi',
    Hyderabad: 'Hyderabad',
    Secunderabad: 'Secunderabad',
    Chennai: 'Chennai',
    Mumbai: 'Mumbai',
    Pune: 'Pune',
    Kolkata: 'Kolkata',
    Ahmedabad: 'Ahmedabad',
    Jaipur: 'Jaipur',
    Goa: 'Goa',
  };

  // mapping short name -> brand color (hex). Add more as needed.
  const BRAND_COLORS: Record<string, string> = {
    'redbus': '#ff3b30',
    'abhibus': '#0ea5a4',
    'makemytrip': '#ff7a00',
    'goibibo': '#ff5a5f',
    'paytm': '#00a0e4',
    'ixigo': '#ff6b00',
    'spicejet': '#ff5c00',
    'indigo': '#0056a6',
    'air india': '#d40000',
    'vistara': '#ffb400',
    'akasa': '#00b894',
    'irctc': '#0066cc',
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

  // returns the fixed list of 4 partners (official first + 3 partner sites) for given provider
  const PARTNER_ORDER = (provider: string, transportMode: string, option: TravelOption) => {
    const p = provider.toLowerCase();
    const partners: { name: string; url: string; autofill?: boolean }[] = [];
    const rawFromName = (option.departure?.location || '').trim();
    const rawToName = (option.arrival?.location || '').trim();
    const travelDate = option.date ? option.date.split('T')[0] : new Date().toISOString().split('T')[0];
    const fromToken = encodeURIComponent((BUS_CITY_MAP[rawFromName] || rawFromName).replace(/\s+/g, '-'));
    const toToken = encodeURIComponent((BUS_CITY_MAP[rawToName] || rawToName).replace(/\s+/g, '-'));

    // Helper to push unique
    const pushIfUnique = (arr: typeof partners, item: typeof partners[number]) => {
      if (!arr.find(x => x.name.toLowerCase() === item.name.toLowerCase())) arr.push(item);
    };

    if (transportMode === 'flight') {
      // official
      let official = '#';
      if (p.includes('indigo')) official = 'https://www.goindigo.in/';
      else if (p.includes('air india')) official = 'https://www.airindia.com/';
      else if (p.includes('vistara')) official = 'https://www.airvistara.com/in/en';
      else if (p.includes('spicejet')) official = 'https://book.spicejet.com/';
      else if (p.includes('akasa')) official = 'https://www.akasaair.com/';
      else if (p.includes('airasia')) official = 'https://www.airasia.com/';
      else if (p.includes('go first')) official = 'https://www.flygofirst.com/';

      pushIfUnique(partners, { name: provider, url: official, autofill: false });
      pushIfUnique(partners, { name: 'MakeMyTrip', url: 'https://www.makemytrip.com/flights/', autofill: false });
      pushIfUnique(partners, { name: 'Goibibo', url: 'https://www.goibibo.com/flights/', autofill: false });
      pushIfUnique(partners, { name: 'ixigo', url: 'https://www.ixigo.com/flights', autofill: false });

      return partners.slice(0, 4);
    }

    if (transportMode === 'train') {
      const fromCode = IRCTC_CODES[rawFromName] || (option.departure?.code || '');
      const toCode = IRCTC_CODES[rawToName] || (option.arrival?.code || '');
      const irctcUrl = fromCode && toCode
        ? `https://www.irctc.co.in/nget/train-search?fromCode=${fromCode}&toCode=${toCode}`
        : 'https://www.irctc.co.in/nget/train-search';
      pushIfUnique(partners, { name: 'IRCTC', url: irctcUrl, autofill: !!(fromCode && toCode) });
      pushIfUnique(partners, { name: 'MakeMyTrip', url: 'https://www.makemytrip.com/railways/', autofill: false });
      pushIfUnique(partners, { name: 'Goibibo', url: 'https://www.goibibo.com/trains/', autofill: false });
      pushIfUnique(partners, { name: 'Paytm', url: 'https://tickets.paytm.com/trains/', autofill: false });
      return partners.slice(0, 4);
    }

    if (transportMode === 'bus') {
      // Official bus deep links when possible
      let official = 'https://www.redbus.in/';
      if (p.includes('redbus')) {
        official = `https://www.redbus.in/bus-tickets/${fromToken}-to-${toToken}?onward=${travelDate}&pax=${passengers[option.id] || 1}`;
      } else if (p.includes('abhibus')) {
        official = `https://www.abhibus.com/bus/${fromToken}-to-${toToken}?journeyDate=${travelDate}&pax=${passengers[option.id] || 1}`;
      } else if (p.includes('travelyaari')) {
        official = `https://www.travelyaari.com/search-bus?fromCity=${fromToken}&toCity=${toToken}&date=${travelDate}`;
      }

      pushIfUnique(partners, { name: provider, url: official, autofill: official !== 'https://www.redbus.in/' });
      pushIfUnique(partners, { name: 'Paytm', url: 'https://tickets.paytm.com/bus', autofill: false });
      pushIfUnique(partners, { name: 'Goibibo', url: 'https://www.goibibo.com/bus/', autofill: false });
      pushIfUnique(partners, { name: 'MakeMyTrip', url: 'https://www.makemytrip.com/bus/', autofill: false });
      return partners.slice(0, 4);
    }

    return partners;
  };

  // main TravelCard component with animated, brand-colored dropdown rows
  const TravelCard = ({
    option,
    recommendation,
  }: {
    option: TravelOption;
    recommendation?: 'best' | 'cheapest' | 'fastest';
  }) => {
    const isRecommended = recommendation !== undefined;
    const currentPassengers = passengers[option.id] || 1;

    const partnerList = PARTNER_ORDER(option.provider, option.transportMode, option);
    // ensure at least something
    if (partnerList.length === 0) {
      // fallback to previous generic list generator
      partnerList.push({ name: option.provider, url: '#' });
    }

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

    const handleOpen = (url: string) => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setMenuOpen(false);
    };

    const dropdownBase =
      'absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg overflow-hidden z-50 transform transition-all duration-200 ease-out';
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

        {/* Route */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <p className="text-3xl font-bold">{option.departure.time}</p>
            <p className="text-sm text-muted-foreground mt-1">{option.departure.location}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm text-muted-foreground mb-1">{option.duration}</div>
            <div className="w-full h-px bg-border relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-30" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{option.arrival.time}</p>
            <p className="text-sm text-muted-foreground mt-1">{option.arrival.location}</p>
          </div>
        </div>

        {/* Meta + Book */}
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

            {/* Book button */}
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
                {partnerList.map((site) => {
                  // derive brand key to choose color
                  const key = site.name.toLowerCase().replace(/\s+/g, '');
                  const color = BRAND_COLORS[key] || '#111827'; // fallback dark
                  return (
                    <button
                      key={site.name}
                      onClick={() => handleOpen(site.url)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between"
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden
                          style={{ backgroundColor: color }}
                          className="w-3 h-3 rounded-full inline-block"
                        />
                        <span>{site.name}</span>
                      </div>
                      {site.autofill && <span className="text-green-500 text-xs">Auto</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {option.amenities.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-4 border-t mt-4">
            {option.amenities.map((a, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {a}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Card className="p-6 bg-gradient-hero border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Lowest Price</p>
            <p className="text-3xl font-bold text-success">₹{results.priceStats.lowest.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Average Price</p>
            <p className="text-3xl font-bold">₹{results.priceStats.average.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Highest Price</p>
            <p className="text-3xl font-bold text-destructive">₹{results.priceStats.highest.toLocaleString()}</p>
          </div>
        </div>
      </Card>

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

      <div>
        <h2 className="text-2xl font-bold mb-6">All Options ({results.options.length})</h2>
        <div className="space-y-4">
          {results.options
            .filter(
              (o) =>
                o.id !== results.recommendations.best.id &&
                o.id !== results.recommendations.cheapest.id &&
                o.id !== results.recommendations.fastest.id
            )
            .map((o) => (
              <TravelCard key={o.id} option={o} />
            ))}
        </div>
      </div>
    </div>
  );
};
