import React, { useState } from 'react';
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
    Secunderabad: 'SC', // sometimes used
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

  // Bus site friendly names mapping: normalize common variations to expected tokens
  // (RedBus/AbhiBus generally accept city names with hyphens; normalize common variants)
  const BUS_CITY_MAP: Record<string, string> = {
    Bengaluru: 'Bengaluru',
    Bangalore: 'Bengaluru',
    'New Delhi': 'New-Delhi',
    'Delhi': 'New-Delhi',
    'Hyderabad': 'Hyderabad',
    'Secunderabad': 'Secunderabad',
    'Chennai': 'Chennai',
    'Mumbai': 'Mumbai',
    'Pune': 'Pune',
    'Bhopal': 'Bhopal',
    'Visakhapatnam': 'Visakhapatnam',
    'Kolkata': 'Kolkata',
    'Ahmedabad': 'Ahmedabad',
    'Jaipur': 'Jaipur',
    'Lucknow': 'Lucknow',
    'Coimbatore': 'Coimbatore',
    'Vijayawada': 'Vijayawada',
    'Trivandrum': 'Thiruvananthapuram',
    'Thiruvananthapuram': 'Thiruvananthapuram',
    'Goa': 'Goa',
    'Surat': 'Surat',
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

    // Prefer explicit codes if provided in TravelOption (departure.code / arrival.code)
    const depCode = (departure?.code || '').toString().trim();
    const arrCode = (arrival?.code || '').toString().trim();

    // Raw names fallback
    const rawFromName = (departure?.location || '').toString().trim();
    const rawToName = (arrival?.location || '').toString().trim();

    // For bus deep links, normalize using BUS_CITY_MAP, fallback to name
    const busFrom = BUS_CITY_MAP[rawFromName] || rawFromName || depCode || '';
    const busTo = BUS_CITY_MAP[rawToName] || rawToName || arrCode || '';

    // Prepare URL-friendly forms (RedBus/AbhiBus like Hyphenated names)
    const busFromToken = encodeURIComponent(busFrom.replace(/\s+/g, '-'));
    const busToToken = encodeURIComponent(busTo.replace(/\s+/g, '-'));

    // For IRCTC, prefer IRCTC_CODES mapping or explicit station codes
    const fromIRCTC = (IRCTC_CODES[rawFromName] || depCode || '').toString().trim();
    const toIRCTC = (IRCTC_CODES[rawToName] || arrCode || '').toString().trim();

    const travelDate = date ? date.split('T')[0] : new Date().toISOString().split('T')[0];

    const sites: { name: string; url: string; autofill: boolean }[] = [];

    // Flights: include all major airline + aggregator home/search pages (no reliable autofill)
    if (transportMode === 'flight') {
      // airlines
      sites.push({ name: 'IndiGo', url: 'https://www.goindigo.in/', autofill: false });
      sites.push({ name: 'Air India', url: 'https://www.airindia.com/', autofill: false });
      sites.push({ name: 'SpiceJet', url: 'https://book.spicejet.com/', autofill: false });
      sites.push({ name: 'Vistara', url: 'https://www.airvistara.com/in/en', autofill: false });
      sites.push({ name: 'Akasa Air', url: 'https://www.akasaair.com/', autofill: false });
      sites.push({ name: 'AirAsia', url: 'https://www.airasia.com/', autofill: false });
      sites.push({ name: 'Go First', url: 'https://www.flygofirst.com/', autofill: false });

      // aggregators
      sites.push({ name: 'MakeMyTrip', url: 'https://www.makemytrip.com/flights/', autofill: false });
      sites.push({ name: 'Goibibo', url: 'https://www.goibibo.com/flights/', autofill: false });
      sites.push({ name: 'EaseMyTrip', url: 'https://www.easemytrip.com/flights.html', autofill: false });
      sites.push({ name: 'Yatra', url: 'https://www.yatra.com/flights', autofill: false });
      sites.push({ name: 'ixigo', url: 'https://www.ixigo.com/flights', autofill: false });
      sites.push({ name: 'Cleartrip', url: 'https://www.cleartrip.com/flights', autofill: false });
      sites.push({ name: 'Paytm Travel', url: 'https://tickets.paytm.com/flights/', autofill: false });
      sites.push({ name: 'Skyscanner', url: 'https://www.skyscanner.co.in/', autofill: false });

      return sites;
    }

    // Trains: IRCTC autofill if we can resolve station codes, else fallback to homepage/search
    if (transportMode === 'train') {
      if (fromIRCTC && toIRCTC) {
        sites.push({
          name: 'IRCTC (Official)',
          url: `https://www.irctc.co.in/nget/train-search?fromCode=${fromIRCTC}&toCode=${toIRCTC}`,
          autofill: true,
        });
      } else {
        sites.push({
          name: 'IRCTC (Official)',
          url: 'https://www.irctc.co.in/nget/train-search',
          autofill: false,
        });
      }

      // aggregator fallbacks
      sites.push({ name: 'RailYatri', url: 'https://www.railyatri.in/', autofill: false });
      sites.push({ name: 'ixigo Trains', url: 'https://www.ixigo.com/trains', autofill: false });
      sites.push({ name: 'MakeMyTrip Trains', url: 'https://www.makemytrip.com/railways/', autofill: false });
      sites.push({ name: 'Goibibo Trains', url: 'https://www.goibibo.com/trains/', autofill: false });
      sites.push({ name: 'Cleartrip Trains', url: 'https://www.cleartrip.com/trains', autofill: false });
      sites.push({ name: 'Paytm Trains', url: 'https://tickets.paytm.com/trains/', autofill: false });
      sites.push({ name: 'EaseMyTrip Trains', url: 'https://www.easemytrip.com/railways.html', autofill: false });
      sites.push({ name: 'Yatra Trains', url: 'https://www.yatra.com/trains', autofill: false });

      return sites;
    }

    // Buses: RedBus & AbhiBus deep-links with normalized city tokens + date + pax
    if (transportMode === 'bus') {
      // Only include deep-link when token values available; otherwise fallback to search page
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
        // fallback homepages if tokens missing
        sites.push({ name: 'RedBus', url: 'https://www.redbus.in/', autofill: false });
        sites.push({ name: 'AbhiBus', url: 'https://www.abhibus.com/', autofill: false });
      }

      // Additional bus OTAs (home/search pages)
      sites.push({ name: 'MakeMyTrip Bus', url: 'https://www.makemytrip.com/bus/', autofill: false });
      sites.push({ name: 'Goibibo Bus', url: 'https://www.goibibo.com/bus/', autofill: false });
      sites.push({ name: 'Paytm Bus', url: 'https://tickets.paytm.com/bus', autofill: false });
      sites.push({ name: 'ixigo Bus', url: 'https://bus.ixigo.com/', autofill: false });
      sites.push({ name: 'Yatra Bus', url: 'https://www.yatra.com/bus-booking', autofill: false });
      sites.push({ name: 'EaseMyTrip Bus', url: 'https://bus.easemytrip.com/', autofill: false });
      sites.push({ name: 'Cleartrip Bus', url: 'https://www.cleartrip.com/buses', autofill: false });
      sites.push({ name: 'Travelyaari', url: 'https://www.travelyaari.com/', autofill: false });
      sites.push({ name: 'IntrCity SmartBus', url: 'https://www.intrcity.com/', autofill: false });

      return sites;
    }

    // fallback
    return [{ name: 'Default', url: '#', autofill: false }];
  };

  // Travel card UI (styled to match your screenshot-like layout)
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

    // prefer RedBus as primary for bus, otherwise first site
    let primary = bookingSites[0];
    if (option.transportMode === 'bus') {
      const rb = bookingSites.find(s => s.name.toLowerCase().includes('redbus'));
      if (rb) primary = rb;
    }
    const others = bookingSites.filter(s => s.name !== primary.name);

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
            {/* show passengers input for bus/train/flight (you can hide flight input if you prefer) */}
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

            {/* Primary booking pill (slightly prominent) */}
            {primary && (
              <button
                type="button"
                onClick={() => window.open(primary.url, '_blank', 'noopener,noreferrer')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-blue-700"
              >
                Book on {primary.name}
              </button>
            )}

            {/* Secondary small pills */}
            <div className="flex gap-2">
              {others.map((s) => (
                <button
                  key={s.name}
                  onClick={() => window.open(s.url, '_blank', 'noopener,noreferrer')}
                  className="px-3 py-1 border rounded-full text-sm hover:shadow-sm bg-white"
                  type="button"
                >
                  {s.name}
                  {s.autofill && <span className="ml-2 text-xs text-green-600">• Auto</span>}
                </button>
              ))}
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
