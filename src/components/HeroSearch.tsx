import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <div className="search-glow rounded-2xl transition-all duration-300">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 p-1.5 md:p-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Search by brand, model, or reference..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 md:py-5 text-base md:text-lg text-white placeholder:text-white/30 bg-transparent outline-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
                aria-label="Search watches"
              />
            </div>
            <Button
              type="submit"
              className="btn-gold px-5 md:px-8 py-4 md:py-5 text-sm md:text-base rounded-xl shrink-0 border-0"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Search className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </div>
        </div>
      </form>

      {/* Suggestion chips */}
      <div className="mt-6 text-center">
        <p className="text-xs text-white/30 mb-3 uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>Popular searches</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => navigate(`/browse?q=${encodeURIComponent(s)}`)}
              className="group px-4 py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 rounded-full text-sm transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center gap-1.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {s}
              <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
