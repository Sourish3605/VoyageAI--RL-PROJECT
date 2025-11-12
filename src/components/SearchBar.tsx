import React, { useState } from 'react';
import { City, SearchParams, TransportMode } from '@/types/travel';
import { Calendar } from 'lucide-react'; // optional icon
// adapt imports if your project has different icon set

interface Props {
  onSearch: (params: SearchParams) => void;
}

const mockCities: City[] = [
  { id: 'hyd', name: 'Hyderabad', code: 'HYD', state: 'Telangana', popular: true },
  { id: 'mum', name: 'Mumbai', code: 'BOM', state: 'Maharashtra', popular: true },
  { id: 'del', name: 'New Delhi', code: 'DEL', state: 'Delhi', popular: true },
  { id: 'blr', name: 'Bengaluru', code: 'BLR', state: 'Karnataka', popular: true },
];

export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [transportMode, setTransportMode] = useState<TransportMode>('flight');
  const [from, setFrom] = useState<City | null>(mockCities[0]);
  const [to, setTo] = useState<City | null>(null);
  const [date, setDate] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(1);

  const submit = () => {
    onSearch({
      origin: from,
      destination: to,
      departureDate: date ? new Date(date) : null,
      returnDate: null,
      transportMode,
      tripType,
    } as SearchParams);
  };

  return (
    <div className="w-full">
      {/* Trip type pills */}
      <div className="flex items-center gap-3 mb-4">
        {['one-way', 'round-trip'].map((t) => {
          const active = tripType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTripType(t as any)}
              className={[
                'px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
                active
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'bg-white/70 text-slate-800 hover:bg-white/90',
                'focus:ring-blue-400 focus:ring-offset-2',
              ].join(' ')}
              aria-pressed={active}
            >
              {t === 'one-way' ? 'One-way' : 'Round-trip'}
            </button>
          );
        })}
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-3 mb-6 bg-white/10 px-2 py-2 rounded-xl w-max">
        {[
          { key: 'flight', label: 'Flight' },
          { key: 'train', label: 'Train' },
          { key: 'bus', label: 'Bus' },
        ].map((m) => {
          const active = transportMode === (m.key as TransportMode);
          return (
            <button
              key={m.key}
              onClick={() => setTransportMode(m.key as TransportMode)}
              className={[
                'px-4 py-2 rounded-md text-sm font-medium transition-all focus:outline-none',
                active
                  ? 'bg-white text-slate-900 shadow-md transform -translate-y-0.5'
                  : 'text-white/90 hover:bg-white/10',
              ].join(' ')}
              aria-pressed={active}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Search Inputs card */}
      <div className="bg-white/6 backdrop-blur-md rounded-2xl p-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
          {/* From */}
          <label className="col-span-1 md:col-span-1 text-sm text-white/80">From</label>
          <div className="col-span-1 md:col-span-2">
            <select
              value={from?.id || ''}
              onChange={(e) => {
                const c = mockCities.find((x) => x.id === e.target.value) || null;
                setFrom(c);
              }}
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-900 shadow-sm border border-transparent hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              aria-label="From city"
            >
              {mockCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <label className="hidden md:block text-sm text-white/80">To</label>
          <div className="col-span-1 md:col-span-2">
            <select
              value={to?.id || ''}
              onChange={(e) => {
                const c = mockCities.find((x) => x.id === e.target.value) || null;
                setTo(c);
              }}
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-900 shadow-sm border border-transparent hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              aria-label="To city"
            >
              <option value="">Select city</option>
              {mockCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <label className="hidden md:block text-sm text-white/80">Departure</label>
          <div className="col-span-1 md:col-span-1">
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-900 shadow-sm border border-transparent hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                aria-label="Departure date"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Calendar size={16} />
              </span>
            </div>
          </div>

          {/* Passengers + Search Button */}
          <div className="col-span-1 md:col-span-1 flex items-center gap-3 justify-end">
            <div className="flex items-center gap-2">
              <label className="text-sm text-white/80">Pax</label>
              <input
                type="number"
                min={1}
                max={9}
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, Number(e.target.value || 1)))}
                className="w-16 px-3 py-2 rounded-lg bg-white/90 text-slate-900 shadow-sm border border-transparent hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-center"
                aria-label="Passengers"
              />
            </div>

            <button
              onClick={submit}
              className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition"
              aria-label="Search"
            >
              Search
            </button>
          </div>
        </div>

        {/* small helper row for keyboard users */}
        <div className="mt-3 text-xs text-white/60">
          Tip: Use Tab to navigate inputs — focused fields show a bright blue ring.
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
