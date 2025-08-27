import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseSearchQuery, WatchFilters } from "@/services/searchService";
import { logSearch } from "@/services/analyticsService";
import { useToast } from "@/hooks/use-toast";

interface HeroSearchProps {
  onSearch: (query: string, filters?: WatchFilters) => void;
}

export const HeroSearch = ({ onSearch }: HeroSearchProps) => {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Debounce typing
  const debouncedQuery = useDebounce(query, 500);

  // Track latest request so slow results don't overwrite newer ones
  const reqIdRef = useRef(0);

  // After a manual submit we suppress the very next auto search
  const suppressNextAutoRef = useRef(false);

  const handleSearch = useCallback(
    async (searchQuery: string, opts?: { manual?: boolean }) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        onSearch("");
        return;
      }

      // If user manually submitted, suppress the next auto-fire from debounce
      if (opts?.manual) suppressNextAutoRef.current = true;

      setIsProcessing(true);
      const myReqId = ++reqIdRef.current;

      try {
        const parsedFilters = await parseSearchQuery(trimmed);

        // Ignore if a newer request has started
        if (myReqId !== reqIdRef.current) return;

        const hasFilters = Object.keys(parsedFilters || {}).length > 0;

        // Log the search analytics
        await logSearch({
          search_query: trimmed,
          search_type: 'ai',
          ai_filters_detected: parsedFilters,
          ai_parsing_success: hasFilters
        });

        if (hasFilters) {
          const filterSummary = Object.entries(parsedFilters)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join(", ");

          // Gentle toast; avoid piling up
          toast({
            title: "AI Search Applied",
            description: filterSummary || "Detected filters",
            duration: 2000,
          });
        }

        onSearch(trimmed, parsedFilters);
      } catch (error) {
        // Ignore if stale
        if (myReqId !== reqIdRef.current) return;

        console.error("Error processing search:", error);

        // Log failed AI search
        await logSearch({
          search_query: trimmed,
          search_type: 'ai',
          ai_parsing_success: false,
          ai_parsing_error: error.message
        });

        onSearch(trimmed); // fallback to basic text search
        toast({
          title: "Search Applied",
          description: "Using basic text search",
          duration: 1500,
        });
      } finally {
        if (myReqId === reqIdRef.current) setIsProcessing(false);
      }
    },
    [onSearch, toast]
  );

  // Auto-search on debounce (unless suppressed by a manual submit)
  useEffect(() => {
    if (debouncedQuery !== query) return; // ensure debounce settled
    if (debouncedQuery.trim().length < 3) return;

    if (suppressNextAutoRef.current) {
      suppressNextAutoRef.current = false;
      return;
    }
    void handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSearch(query, { manual: true });
  };

  const suggestions = [
    "Luxury diving watch under $15,000",
    "Vintage dress watch with leather strap",
    "Swiss automatic chronograph",
    "Daily wear sports watch",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative" aria-busy={isProcessing}>
        <label htmlFor="hero-search" className="sr-only">
          Search watches
        </label>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            id="hero-search"
            type="text"
            placeholder="Describe your perfect watch..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isProcessing}
            className="pl-16 pr-40 py-8 text-xl border-2 border-border focus:border-slate-400 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm"
            aria-label="Search watches"
          />
          <Button
            type="submit"
            disabled={isProcessing || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 flex items-center gap-3 text-lg rounded-xl"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing…
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
      <div className="mt-6 text-center" aria-live="polite">
        <p className="text-sm text-muted-foreground mb-3">Try these examples:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                // Let debounce trigger the search (avoids duplicate manual+auto)
                setQuery(s);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors border border-slate-200"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};