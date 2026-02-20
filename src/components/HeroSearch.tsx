import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/browse?q=${encodeURIComponent(trimmed)}` : '/browse');
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
        <div className={`search-glow rounded-2xl transition-all duration-500 ${focused ? 'shadow-glow-gold' : ''}`}>
          <div className="flex items-center bg-white/[0.07] backdrop-blur-2xl rounded-2xl border border-white/[0.08] p-1.5 md:p-2 transition-all duration-500 hover:bg-white/[0.09] hover:border-white/[0.12]">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] transition-colors duration-300 ${focused ? 'text-[var(--gold)]' : 'text-white/25'}`} />
              <input
                type="text"
                placeholder="Search by brand, model, or reference..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full pl-12 pr-4 py-4 md:py-[18px] text-[15px] md:text-base text-white placeholder:text-white/20 bg-transparent outline-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
                aria-label="Search watches"
              />
            </div>
            <button
              type="submit"
              className="btn-gold px-5 md:px-7 py-3.5 md:py-[14px] text-[13px] md:text-sm rounded-xl shrink-0 border-0 flex items-center gap-2 font-semibold"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
        </div>
      </form>

      <div className="mt-7 text-center">
        <p className="text-[11px] text-white/20 mb-3 uppercase tracking-[0.25em]" style={{ fontFamily: 'Inter, sans-serif' }}>Popular searches</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => navigate(`/browse?q=${encodeURIComponent(s)}`)}
              className="group px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70 rounded-full text-[13px] transition-all duration-400 border border-white/[0.06] hover:border-white/[0.12] flex items-center gap-1.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {s}
              <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-60 group-hover:ml-0 transition-all duration-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
