
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseSearchQuery, WatchFilters } from "@/services/searchService";
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

        if (Object.keys(parsedFilters || {}).length > 0) {
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
        onSearch(trimmed); // fallback to basic text search
        toast({
          title: "Search Applied",
          description: "Using basic text search",
          duration: 1500,
        });
      } finally {
        if (myReqId === reqI

