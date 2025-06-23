
import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, Star, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SearchSection } from '@/components/SearchSection';
import { WatchGrid } from '@/components/WatchGrid';
import { WatchRecommendations } from '@/components/WatchRecommendations';
import { TrustSection } from '@/components/TrustSection';
import { Header } from '@/components/Header';
import { Logo } from '@/components/Logo';
import { searchWatches, getAllWatches, Watch } from '@/services/watchService';
import { searchWatchesWithFilters, getWatchRecommendations, WatchFilters, WatchRecommendation } from '@/services/searchService';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Watch[]>([]);
  const [recommendations, setRecommendations] = useState<WatchRecommendation[]>([]);
  const [lastSearchFilters, setLastSearchFilters] = useState<WatchFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string, filters?: WatchFilters) => {
    setSearchQuery(query);
    setIsSearching(true);
    setRecommendations([]); // Clear previous recommendations

    try {
      let results: Watch[] = [];

      if (filters && Object.keys(filters).length > 0) {
        // Use AI-powered search with filters
        results = await searchWatchesWithFilters(filters, query);
        setLastSearchFilters(filters);
      } else if (query.trim()) {
        // Fallback to basic text search
        results = searchWatches(query);
        setLastSearchFilters({});
      } else {
        // Show all watches if no query
        results = getAllWatches();
        setLastSearchFilters({});
      }

      setSearchResults(results);
      setShowResults(true);

      // If no results found and we have a search query, get recommendations
      if (results.length === 0 && query.trim()) {
        console.log('No results found, getting recommendations...');
        const recs = await getWatchRecommendations(query, filters || {});
        setRecommendations(recs);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to basic search
      const results = searchWatches(query);
      setSearchResults(results);
      setShowResults(true);
      
      // Get recommendations if no results
      if (results.length === 0 && query.trim()) {
        const recs = await getWatchRecommendations(query, {});
        setRecommendations(recs);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchRecommendation = (brand: string, model: string) => {
    const newQuery = `${brand} ${model}`;
    handleSearch(newQuery);
  };

  // Show popular watches initially
  const popularWatches = getAllWatches().slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-4">
              Find the Best Price for Any Luxury Watch
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Compare listings across Chrono24, eBay, WatchBox and more — powered by AI.
            </p>
          </div>
          
          <SearchSection onSearch={handleSearch} />
          
          {/* Trust Indicators */}
          <div className="mt-8 md:mt-12 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-muted-foreground">
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
              <span>AI-Powered Search</span>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {showResults ? (
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-medium mb-2">
                {isSearching ? 'Searching...' : `Search Results for "${searchQuery}"`}
              </h2>
              <p className="text-muted-foreground">
                {isSearching 
                  ? 'AI is analyzing your search...' 
                  : `Found ${searchResults.length} listings from verified marketplaces`
                }
              </p>
            </div>
            {isSearching ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-muted-foreground">AI is parsing your search query...</p>
              </div>
            ) : (
              <>
                <WatchGrid watches={searchResults} />
                {searchResults.length === 0 && recommendations.length > 0 && (
                  <WatchRecommendations
                    recommendations={recommendations}
                    originalQuery={searchQuery}
                    onSearchRecommendation={handleSearchRecommendation}
                  />
                )}
              </>
            )}
          </div>
        </section>
      ) : (
        /* Popular Watches Section */
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-light mb-4">Popular Luxury Watches</h2>
              <p className="text-muted-foreground">
                Trending watches from verified sellers worldwide
              </p>
            </div>
            <WatchGrid watches={popularWatches} />
          </div>
        </section>
      )}

      {/* SEO Content Sections */}
      <section className="py-12 md:py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-center mb-12 text-foreground">
            Instantly Compare Luxury Watch Prices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="font-medium mb-2">AI-Powered Search</h3>
              <p className="text-sm text-muted-foreground">
                Our advanced algorithms scan hundreds of marketplaces to find exact matches for any watch model.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="font-medium mb-2">Live Price Updates</h3>
              <p className="text-sm text-muted-foreground">
                Real-time pricing data ensures you never miss a deal or pay more than necessary.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="font-medium mb-2">Trusted Sources</h3>
              <p className="text-sm text-muted-foreground">
                Every listing comes from verified dealers and authenticated marketplaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-12 text-foreground">
            Set Alerts and Track Market Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-medium mb-4">Price Alerts</h3>
              <p className="text-muted-foreground mb-6">
                Get notified instantly when your dream watch drops below your target price across all major marketplaces.
              </p>
              <Button variant="outline" asChild>
                <a href="/price-alert">Set Alert</a>
              </Button>
            </Card>
            <Card className="p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-medium mb-4">Market Analytics</h3>
              <p className="text-muted-foreground mb-6">
                Track pricing trends, market performance, and investment potential for any luxury watch model.
              </p>
              <Button variant="outline">View Trends</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <TrustSection />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6 md:mb-8">
            <div className="mb-4">
              <Logo size="lg" variant="footer" />
            </div>
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
