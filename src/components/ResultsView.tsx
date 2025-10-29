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
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'flight': return <Plane className="h-5 w-5" />;
      case 'train': return <Train className="h-5 w-5" />;
      case 'bus': return <Bus className="h-5 w-5" />;
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

  const getBookingUrl = (option: TravelOption) => {
    const { provider, transportMode, departure, arrival } = option;
    const origin = encodeURIComponent(departure.location);
    const destination = encodeURIComponent(arrival.location);
    
    // Generate affiliate/official booking URLs
    if (transportMode === 'flight') {
      if (provider === 'IndiGo') return `https://www.goindigo.in/booking/flight-search.html?from=${origin}&to=${destination}`;
      if (provider === 'Air India') return `https://www.airindia.com/in/en/book/flight-search.html`;
      if (provider === 'SpiceJet') return `https://www.spicejet.com/`;
      if (provider === 'Vistara') return `https://www.airvistara.com/in/en/book/flight-search`;
      if (provider === 'Go First') return `https://www.flygofirst.com/`;
    } else if (transportMode === 'train') {
      return `https://www.irctc.co.in/nget/train-search`;
    } else if (transportMode === 'bus') {
      if (provider.includes('RedBus')) return `https://www.redbus.in/bus-tickets/${origin}-to-${destination}`;
      if (provider.includes('AbhiBus')) return `https://www.abhibus.com/bus/${origin}-to-${destination}`;
      return `https://www.redbus.in/`;
    }
    
    return '#';
  };

  const TravelCard = ({ option, recommendation }: { option: TravelOption; recommendation?: 'best' | 'cheapest' | 'fastest' }) => {
    const isRecommended = recommendation !== undefined;
    
    const handleBooking = () => {
      const url = getBookingUrl(option);
      window.open(url, '_blank', 'noopener,noreferrer');
    };
    
    return (
      <Card className={cn(
        'relative p-6 transition-all hover:shadow-elevated',
        isRecommended && 'border-2 border-primary'
      )}>
        {recommendation && <RecommendationBadge type={recommendation} />}
        
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {getTransportIcon(option.transportMode)}
              </div>
              <div>
                <p className="font-semibold text-lg">{option.provider}</p>
                <p className="text-sm text-muted-foreground capitalize">{option.transportMode}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">₹{option.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center justify-between py-4 border-y">
            <div className="flex-1">
              <p className="text-2xl font-bold">{option.departure.time}</p>
              <p className="text-sm text-muted-foreground">{option.departure.location}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center px-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">{option.duration}</p>
              <div className="w-full h-px bg-border relative">
                <div className="absolute inset-0 bg-gradient-primary opacity-50" />
              </div>
            </div>
            
            <div className="flex-1 text-right">
              <p className="text-2xl font-bold">{option.arrival.time}</p>
              <p className="text-sm text-muted-foreground">{option.arrival.location}</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{option.seats} seats</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{option.duration}</span>
              </div>
            </div>
            
            <Button size="lg" className="px-8" onClick={handleBooking}>
              Book Now
            </Button>
          </div>

          {/* Amenities */}
          {option.amenities.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-2 border-t">
              {option.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}
        </div>
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

      {/* Recommendations */}
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
