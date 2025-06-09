
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export const SearchSection = ({ onSearch }: SearchSectionProps) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const popularSearches = [
    'Rolex Submariner',
    'Omega Speedmaster',
    'Patek Philippe Nautilus',
    'AP Royal Oak',
    'Cartier Santos'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter brand, model, or reference number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-32 py-6 text-lg border-2 border-border focus:border-slate-400 rounded-xl shadow-sm"
          />
          <Button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-white px-6"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Filters */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4 border-2"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-xl border">
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <select className="w-full p-2 border rounded-md">
                <option>Any Price</option>
                <option>Under $1,000</option>
                <option>$1,000 - $5,000</option>
                <option>$5,000 - $10,000</option>
                <option>$10,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <select className="w-full p-2 border rounded-md">
                <option>Any Condition</option>
                <option>New</option>
                <option>Excellent</option>
                <option>Very Good</option>
                <option>Good</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Seller Rating</label>
              <select className="w-full p-2 border rounded-md">
                <option>Any Rating</option>
                <option>5 Stars</option>
                <option>4+ Stars</option>
                <option>3+ Stars</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Popular Searches */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularSearches.map((search) => (
            <Badge
              key={search}
              variant="secondary"
              className="cursor-pointer hover:bg-slate-200 transition-colors"
              onClick={() => {
                setQuery(search);
                onSearch(search);
              }}
            >
              {search}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
