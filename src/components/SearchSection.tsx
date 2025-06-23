
import React, { useState } from 'react';
import { Search, Filter, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { parseSearchQuery, WatchFilters } from '@/services/searchService';
import { useToast } from '@/hooks/use-toast';

interface SearchSectionProps {
  onSearch: (query: string, filters?: WatchFilters) => void;
}

const BRAND_OPTIONS = [
  "Any Brand",
  "Rolex",
  "Omega",
  "Patek Philippe",
  "Audemars Piguet",
  "Cartier",
  "Tag Heuer",
  "Grand Seiko",
  "Breitling",
  "IWC",
];

export const SearchSection = ({ onSearch }: SearchSectionProps) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [boxAndPapers, setBoxAndPapers] = useState(false);
  const [brand, setBrand] = useState('Any Brand');
  const [isParsingSearch, setIsParsingSearch] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<WatchFilters>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      onSearch('');
      return;
    }

    setIsParsingSearch(true);
    
    try {
      // Use AI to parse the search query into structured filters
      const parsedFilters = await parseSearchQuery(query);
      setAppliedFilters(parsedFilters);
      
      // Show user what filters were detected
      if (Object.keys(parsedFilters).length > 0) {
        const filterSummary = Object.entries(parsedFilters)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        
        toast({
          title: "AI Search Applied",
          description: `Detected filters: ${filterSummary}`,
        });
      }
      
      onSearch(query, parsedFilters);
    } catch (error) {
      console.error('Error parsing search:', error);
      // Fallback to regular search
      onSearch(query);
      toast({
        title: "Search Applied",
        description: "Using basic text search",
        variant: "default",
      });
    } finally {
      setIsParsingSearch(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setAppliedFilters({});
    onSearch('');
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
            placeholder="Try: 'Rolex diving watch under $10k' or 'automatic chronograph'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-32 py-6 text-lg border-2 border-border focus:border-slate-400 rounded-xl shadow-sm"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="absolute right-24 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button 
            type="submit"
            disabled={isParsingSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-white px-6 flex items-center gap-2"
          >
            {isParsingSearch ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Parsing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI Search
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Applied AI Filters Display */}
      {Object.keys(appliedFilters).length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">AI-Detected Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(appliedFilters).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="bg-blue-100 text-blue-800">
                {key}: {value}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAppliedFilters({})}
              className="h-6 px-2 text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4 border-2"
        >
          <Filter className="h-4 w-4 mr-2" />
          Manual Filters
        </Button>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-xl border">
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  {BRAND_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                <option>Unworn</option>
                <option>Excellent</option>
                <option>Very Good</option>
                <option>Good</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Box & Papers</label>
              <div className="flex items-center h-full">
                <input
                  type="checkbox"
                  checked={boxAndPapers}
                  onChange={() => setBoxAndPapers(!boxAndPapers)}
                  className="rounded border-gray-300 text-slate-900 focus:ring-slate-900 w-5 h-5"
                  id="box-and-papers"
                />
                <label htmlFor="box-and-papers" className="ml-2 text-sm">
                  Included
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popular Searches */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">Try these AI-powered searches:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularSearches.map((search) => (
            <Badge
              key={search}
              variant="secondary"
              className="cursor-pointer hover:bg-slate-200 transition-colors"
              onClick={() => {
                setQuery(search);
                handleSubmit(new Event('submit') as any);
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
