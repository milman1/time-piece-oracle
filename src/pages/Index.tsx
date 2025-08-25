import React, { useState, useCallback } from 'react';
import { Search, Filter, ShieldCheck, Star, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SearchSection } from '@/components/SearchSection';
import { HeroSearch } from '@/components/HeroSearch';
import { WatchGrid } from '@/components/WatchGrid';
import { WatchRecommendations } from '@/components/WatchRecommendations';
import { TrustSection } from '@/components/TrustSection';
import { TrendingWatches } from '@/components/TrendingWatches';
import { Header } from '@/components/Header';
import { Logo } from '@/components/Logo';
import { searchWatches, getAllWatches, Watch } from '@/services/watchService';
import { searchWatchesWithFilters, getWatchRecommendations, WatchFilters, WatchRecommendation } from '@/services/searchService';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [lastSearchFilters, setLastSearchFilters] = useState<WatchFilters>({});
  const queryClient = useQueryClient();

  // Query for search results
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['searchWatches', searchQuery, lastSearchFilters],
    queryFn: async () => {
      if (!searchQuery.trim() && Object.keys(lastSearchFilters).length === 0) {
        return [];
      }

      let results: Watch[] = [];

      if (lastSearchFilters && Object.keys(lastSearchFilters).length > 0) {
        results = await searchWatchesWithFilters(lastSearchFilters, searchQuery);
      } else if (searchQuery.trim()) {
        results = await searchWatches(searchQuery);
      } else {
        results = await getAllWatches();
      }

      return results;
    },
    enabled: showResults,
    staleTime: 5 * 60 * 1000,
  });

  // Query for recommendations when no results found
  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations', searchQuery, lastSearchFilters],
    queryFn: () => getWatchRecommendations(searchQuery, lastSearchFilters || {}),
    enabled: showResults && searchResults.length === 0 && searchQuery.trim().length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const handleSearch = useCallback((query: string, filters?: WatchFilters) => {
    setSearchQuery(query);
    setLastSearchFilters(filters || {});
    setShowResults(true);
    
    // Invalidate queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['searchWatches'] });
    queryClient.invalidateQueries({ queryKey: ['recommendations'] });
  }, [queryClient]);

  const handleSearchRecommendation = (brand: string, model: string) => {
    const newQuery = `${brand} ${model}`;
    handleSearch(newQuery);
  };

  // Query for popular watches initially  
  const { data: popularWatches = [] } = useQuery({
    queryKey: ['popularWatches'],
    queryFn: async () => {
      const watches = await getAllWatches();
      return watches.slice(0, 4);
    },
    enabled: !showResults,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Find the Best Price for Any Luxury Watch | Hours</title>
        <meta 
          name="description" 
          content="Compare luxury watch prices across Chrono24, eBay, WatchBox and more. AI-powered search finds the best deals on Rolex, Omega, Patek Philippe and other premium timepieces from verified sellers worldwide." 
        />
        <meta name="keywords" content="luxury watches, watch prices, Rolex, Omega, Patek Philippe, Chrono24, watch marketplace, authentic watches" />
        <link rel="canonical" href="https://www.hours.com/" />
        <meta property="og:title" content="Find the Best Price for Any Luxury Watch | Hours" />
        <meta property="og:description" content="Compare luxury watch prices across multiple marketplaces with AI-powered search. Find the best deals on authentic timepieces from verified sellers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.hours.com/" />
      </Helmet>
      <Header />
      
      {/* Hero Section with New Search */}
      <section className="relative py-16 md:py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-4">
              Find the Best Price for Any Luxury Watch
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              Compare listings across Chrono24, eBay, WatchBox and more — powered by AI.
            </p>
          </div>
          
          {/* New Hero Search Component */}
          <HeroSearch onSearch={handleSearch} />
          
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

      {/* New Trending in Watches Section */}
      <TrendingWatches />

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
                <Link to="/price-alert">Set Alert</Link>
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
