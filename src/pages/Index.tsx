
import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, Star, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SearchSection } from '@/components/SearchSection';
import { WatchGrid } from '@/components/WatchGrid';
import { TrustSection } from '@/components/TrustSection';
import { Header } from '@/components/Header';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground mb-4">
              Find the Best Price for the
              <span className="block font-medium">Watch You Want</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Compare prices across premium watch marketplaces. AI-powered matching ensures you find the exact model at the best price.
            </p>
          </div>
          
          <SearchSection onSearch={handleSearch} />
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>5M+ Watches Tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Real-time Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-medium mb-2">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-muted-foreground">
                Found 247 listings from verified marketplaces
              </p>
            </div>
            <WatchGrid />
          </div>
        </section>
      )}

      {/* How It Works */}
      <TrustSection />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-light mb-2">Hours</h3>
            <p className="text-slate-400">The smartest way to buy luxury watches</p>
          </div>
          <div className="text-slate-400 text-sm">
            © 2024 Hours. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
