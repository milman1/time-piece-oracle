
import React, { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseSearchQuery, WatchFilters } from '@/services/searchService';
import { useToast } from '@/hooks/use-toast';

interface HeroSearchProps {
  onSearch: (query: string, filters?: WatchFilters) => void;
}

export const HeroSearch = ({ onSearch }: HeroSearchProps) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      onSearch('');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Use AI to parse the natural language search query
      const parsedFilters = await parseSearchQuery(query);
      
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
      console.error('Error processing search:', error);
      // Fallback to regular search
      onSearch(query);
      toast({
        title: "Search Applied",
        description: "Using basic text search",
        variant: "default",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Describe your perfect watch..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isProcessing}
            className="pl-16 pr-40 py-8 text-xl border-2 border-border focus:border-slate-400 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm"
          />
          <Button 
            type="submit"
            disabled={isProcessing || !query.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 flex items-center gap-3 text-lg rounded-xl"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                AI Search
              </>
            )}
          </Button>
        </div>
      </form>
      
      {/* Suggestion chips */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">Try these examples:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            'Luxury diving watch under $15,000',
            'Vintage dress watch with leather strap',
            'Swiss automatic chronograph',
            'Daily wear sports watch'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors border border-slate-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
