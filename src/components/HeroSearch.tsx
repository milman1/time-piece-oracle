import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/browse?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/browse');
    }
  };

  const suggestions = [
    "Rolex Submariner",
    "Omega Speedmaster",
    "Cartier Tank",
    "Tudor Black Bay",
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="hero-search" className="sr-only">
          Search watches
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="hero-search"
              type="text"
              placeholder="Search by brand, model, or reference..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 py-6 md:py-7 text-base md:text-lg border-2 border-border focus:border-slate-400 rounded-xl shadow-lg bg-white/95 backdrop-blur-sm"
              aria-label="Search watches"
            />
          </div>
          <Button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 md:px-8 py-6 md:py-7 text-base md:text-lg rounded-xl shrink-0"
          >
            <Search className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Search</span>
          </Button>
        </div>
      </form>

      {/* Suggestion chips */}
      <div className="mt-5 text-center">
        <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => navigate(`/browse?q=${encodeURIComponent(s)}`)}
              className="px-3 py-1.5 bg-white/70 hover:bg-white text-slate-600 rounded-full text-sm transition-colors border border-slate-200 shadow-sm"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
