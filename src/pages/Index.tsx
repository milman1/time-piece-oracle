import React from 'react';
import { Search, ShieldCheck, Star, TrendingUp, ArrowRight, ExternalLink, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Logo } from '@/components/Logo';
import { HeroSearch } from '@/components/HeroSearch';
import { TrustSection } from '@/components/TrustSection';

import Footer from '@/components/Footer';
import { searchAllPlatforms, WatchGroup } from '@/services/watchService';
import { getFeaturedSellers, VettedSeller } from '@/services/sellerService';
import { getAllPlatformNames } from '@/services/platformMockService';

const Index = () => {
  const platformNames = getAllPlatformNames();

  const { data: featuredComparison } = useQuery({
    queryKey: ['featuredComparison'],
    queryFn: () => searchAllPlatforms('Rolex Submariner'),
    staleTime: 60_000,
  });

  const { data: featuredSellers = [] } = useQuery({
    queryKey: ['featuredSellers'],
    queryFn: getFeaturedSellers,
    staleTime: 60_000,
  });

  const featuredGroup = featuredComparison?.grouped?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hours — The Luxury Watch Meta-Marketplace</title>
        <meta name="description" content="Hours aggregates luxury watch listings from eBay, Chrono24, WatchBox, and vetted independent dealers — surfacing the best price and routing you directly to the seller." />
        <meta name="keywords" content="luxury watches, watch prices, compare watches, Rolex, Omega, Patek Philippe, eBay watches, Chrono24, meta-marketplace" />
        <link rel="canonical" href="https://www.hours.com/" />
      </Helmet>
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-4">
              Every Listing. Every Platform.<br className="hidden sm:block" /> One Search.
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6 md:mb-8 px-2">
              We aggregate listings from eBay, Chrono24, WatchBox, and vetted independents — surface the best price, and send you straight to the seller.
            </p>
          </div>

          <HeroSearch />

          {/* Platform indicators */}
          <div className="mt-6 md:mt-12">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Aggregating from</p>
            <div className="flex flex-wrap justify-center items-center gap-2">
              {platformNames.map(name => (
                <span key={name} className="px-2.5 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200">
                  {name}
                </span>
              ))}
              <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200">
                + Vetted Dealers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Aggregation Showcase */}
      {featuredGroup && (
        <section className="py-10 md:py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-xl md:text-3xl font-light mb-3">
                One Watch. {featuredGroup.listingCount} Sellers. One Best Price.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
                We pull every listing into one view so you can find the lowest price instantly.
              </p>
            </div>

            <Card className="border shadow-sm">
              <CardContent className="p-4 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
                  <div>
                    <h3 className="text-lg md:text-xl font-medium text-foreground">
                      {featuredGroup.brand} {featuredGroup.model}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Ref: {featuredGroup.reference} · {featuredGroup.listingCount} listings
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-3xl font-semibold text-foreground">${featuredGroup.lowestPrice.toLocaleString()}</span>
                    {featuredGroup.highestPrice > featuredGroup.lowestPrice && (
                      <Badge variant="secondary" className="flex items-center gap-1 text-emerald-700 bg-emerald-50 text-xs">
                        <TrendingDown className="h-3 w-3" />
                        Save ${(featuredGroup.highestPrice - featuredGroup.lowestPrice).toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {featuredGroup.listings.sort((a, b) => a.price - b.price).slice(0, 5).map((listing, idx) => (
                    <div
                      key={listing.id}
                      className={`flex items-center gap-2 md:gap-4 p-2.5 md:p-3 rounded-lg ${idx === 0 ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-slate-50'}`}
                    >
                      {idx === 0 && <Badge className="bg-emerald-600 text-white text-xs shrink-0">Best</Badge>}
                      <Badge variant="outline" className="text-xs shrink-0">{listing.marketplace}</Badge>
                      <span className="text-xs md:text-sm text-muted-foreground flex-1 truncate">{listing.seller}</span>
                      <span className={`font-semibold shrink-0 ${idx === 0 ? 'text-base md:text-lg' : 'text-sm'}`}>
                        ${listing.price.toLocaleString()}
                      </span>
                      <Button size="sm" variant={idx === 0 ? "default" : "outline"} asChild className="rounded-lg text-xs px-2.5 md:px-3 shrink-0">
                        <a href={listing.affiliate_url || listing.listing_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 md:mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/browse" className="flex items-center gap-2 text-sm">
                      Search Any Watch <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-10 md:py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-3xl font-light text-center mb-8 md:mb-12 text-foreground">
            A Marketplace of Marketplaces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="p-4 md:p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="font-medium mb-2">We Aggregate</h3>
              <p className="text-sm text-muted-foreground">
                Listings from eBay, Chrono24, WatchBox, and vetted independents are pulled into one feed.
              </p>
            </div>
            <div className="p-4 md:p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="font-medium mb-2">We Surface</h3>
              <p className="text-sm text-muted-foreground">
                Our engine groups the same model, ranks by price, and highlights the best deal.
              </p>
            </div>
            <div className="p-4 md:p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="font-medium mb-2">We Route</h3>
              <p className="text-sm text-muted-foreground">
                You click through to buy directly from the seller. No middleman, no markup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vetted Sellers */}
      {featuredSellers.length > 0 && (
        <section className="py-10 md:py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-2">
              <div>
                <h2 className="text-xl md:text-3xl font-light mb-1 md:mb-2">Vetted Independent Dealers</h2>
                <p className="text-sm md:text-base text-muted-foreground">Curated dealers whose listings appear alongside major platforms</p>
              </div>
              <Button variant="outline" asChild className="self-start sm:self-auto">
                <Link to="/for-sellers" className="text-sm">
                  Join the Network <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {featuredSellers.map((seller: VettedSeller) => (
                <Card key={seller.id} className="border">
                  <CardContent className="p-4 md:p-5 flex gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 flex items-center justify-center text-base md:text-lg font-semibold text-slate-600 flex-shrink-0">
                      {seller.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm md:text-base truncate">{seller.name}</h3>
                        <Badge variant="secondary" className="text-xs flex items-center gap-0.5 text-emerald-700 bg-emerald-50 shrink-0">
                          <ShieldCheck className="h-3 w-3" /> Vetted
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{seller.location} · {seller.listingCount} listings · {seller.specialties.slice(0, 2).join(', ')}</p>
                    </div>
                    <div className="flex items-center text-sm shrink-0">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{seller.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Alerts + Analytics */}
      <section className="py-10 md:py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl md:text-3xl font-light mb-8 md:mb-12 text-foreground">
            Set Alerts and Track Market Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <Card className="p-5 md:p-8 text-left">
              <h3 className="text-base md:text-xl font-medium mb-3 md:mb-4">Price Alerts</h3>
              <p className="text-sm text-muted-foreground mb-4 md:mb-6">
                Get notified instantly when your dream watch drops below your target price across all major marketplaces.
              </p>
              <Button variant="outline" asChild>
                <Link to="/price-alert">Set Alert</Link>
              </Button>
            </Card>
            <Card className="p-5 md:p-8 text-left">
              <h3 className="text-base md:text-xl font-medium mb-3 md:mb-4">For Sellers</h3>
              <p className="text-sm text-muted-foreground mb-4 md:mb-6">
                Join our vetted dealer network. Your listings appear alongside eBay, Chrono24, and WatchBox in every search.
              </p>
              <Button variant="outline" asChild>
                <Link to="/for-sellers">Learn More</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <TrustSection />
      <Footer />
    </div>
  );
};

export default Index;
