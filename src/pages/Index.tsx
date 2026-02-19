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
    <div className="min-h-screen bg-[var(--ivory)]">
      <Helmet>
        <title>Hours — The Luxury Watch Meta-Marketplace</title>
        <meta name="description" content="Hours aggregates luxury watch listings from eBay, Chrono24, WatchBox, and vetted independent dealers — surfacing the best price and routing you directly to the seller." />
        <meta name="keywords" content="luxury watches, watch prices, compare watches, Rolex, Omega, Patek Philippe, eBay watches, Chrono24, meta-marketplace" />
        <link rel="canonical" href="https://www.hours.com/" />
      </Helmet>
      <Header />

      {/* ═══ HERO SECTION — Dark gradient with search ═══ */}
      <section className="hero-gradient py-16 md:py-28 px-4 relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8 md:mb-10 animate-fade-up">
            <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-tight text-white mb-5 leading-[1.15]">
              Every Listing. Every Platform.
              <br />
              <span className="animate-shimmer">One Search.</span>
            </h1>
            <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              We aggregate listings from eBay, Chrono24, WatchBox, and vetted independents — surface the best price, and send you straight to the seller.
            </p>
          </div>

          <div className="animate-fade-up-delay-1">
            <HeroSearch />
          </div>

          {/* Platform indicators */}
          <div className="mt-10 md:mt-14 animate-fade-up-delay-2">
            <p className="text-xs text-white/20 mb-4 uppercase tracking-[0.2em]" style={{ fontFamily: 'Inter, sans-serif' }}>Aggregating from</p>
            <div className="flex flex-wrap justify-center items-center gap-2">
              {platformNames.map(name => (
                <span key={name} className="px-3 py-1.5 bg-white/5 rounded-full text-xs text-white/35 border border-white/8" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {name}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-[var(--gold-muted)] rounded-full text-xs text-[var(--gold)] border border-[var(--gold)]/15" style={{ fontFamily: 'Inter, sans-serif' }}>
                + Vetted Dealers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LIVE AGGREGATION SHOWCASE ═══ */}
      {featuredGroup && (
        <section className="py-14 md:py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <p className="text-xs text-[var(--gold)] mb-3 uppercase tracking-[0.2em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Live Comparison</p>
              <h2 className="text-2xl md:text-4xl tracking-tight text-foreground mb-3">
                One Watch. {featuredGroup.listingCount} Sellers. One Best Price.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                We pull every listing into one view so you can find the lowest price instantly.
              </p>
            </div>

            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-4 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 md:mb-6 gap-2 pb-5 border-b">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {featuredGroup.brand} {featuredGroup.model}
                    </h3>
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Ref: {featuredGroup.reference} · {featuredGroup.listingCount} listings
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-3xl font-semibold text-foreground">${featuredGroup.lowestPrice.toLocaleString()}</span>
                    {featuredGroup.highestPrice > featuredGroup.lowestPrice && (
                      <Badge className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs">
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
                      className={`flex items-center gap-2 md:gap-4 p-2.5 md:p-3.5 rounded-xl transition-all ${idx === 0 ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-slate-50/50 hover:bg-slate-50'}`}
                    >
                      {idx === 0 && <Badge className="bg-emerald-600 text-white text-xs shrink-0">Best</Badge>}
                      <Badge variant="outline" className="text-xs shrink-0">{listing.marketplace}</Badge>
                      <span className="text-xs md:text-sm text-muted-foreground flex-1 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{listing.seller}</span>
                      <span className={`font-semibold shrink-0 ${idx === 0 ? 'text-base md:text-lg' : 'text-sm'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                        ${listing.price.toLocaleString()}
                      </span>
                      <Button size="sm" variant={idx === 0 ? "default" : "outline"} asChild className={`rounded-lg text-xs px-2.5 md:px-3 shrink-0 ${idx === 0 ? 'btn-navy border-0' : ''}`}>
                        <a href={listing.affiliate_url || listing.listing_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline" asChild className="rounded-xl border-slate-200 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300">
                    <Link to="/browse" className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Search Any Watch <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-14 md:py-20 px-4 bg-[var(--champagne)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs text-[var(--gold)] mb-3 uppercase tracking-[0.2em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>How It Works</p>
            <h2 className="text-2xl md:text-4xl tracking-tight text-foreground">
              A Marketplace of Marketplaces
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { icon: Search, title: 'We Aggregate', desc: 'Listings from eBay, Chrono24, WatchBox, and vetted independents are pulled into one feed.' },
              { icon: TrendingUp, title: 'We Surface', desc: 'Our engine groups the same model, ranks by price, and highlights the best deal.' },
              { icon: ShieldCheck, title: 'We Route', desc: 'You click through to buy directly from the seller. No middleman, no markup.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 md:p-8 bg-white rounded-2xl shadow-sm premium-card">
                <div className="w-14 h-14 bg-[var(--gold-muted)] rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="h-6 w-6 text-[var(--gold)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VETTED SELLERS ═══ */}
      {featuredSellers.length > 0 && (
        <section className="py-14 md:py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 gap-3">
              <div>
                <p className="text-xs text-[var(--gold)] mb-2 uppercase tracking-[0.2em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Vetted Network</p>
                <h2 className="text-xl md:text-3xl tracking-tight text-foreground">Independent Dealers</h2>
              </div>
              <Button variant="outline" asChild className="self-start sm:self-auto rounded-xl border-slate-200 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300">
                <Link to="/for-sellers" className="text-sm flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Join the Network <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {featuredSellers.map((seller: VettedSeller) => (
                <div key={seller.id} className="flex gap-4 p-4 md:p-5 bg-slate-50/50 rounded-2xl border border-slate-100 premium-card">
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[var(--gold-muted)] flex items-center justify-center text-base font-semibold text-[var(--gold)] flex-shrink-0">
                    {seller.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm md:text-base truncate text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{seller.name}</h3>
                      <Badge className="text-xs flex items-center gap-0.5 text-emerald-700 bg-emerald-50 border border-emerald-200 shrink-0">
                        <ShieldCheck className="h-3 w-3" /> Vetted
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{seller.location} · {seller.listingCount} listings · {seller.specialties.slice(0, 2).join(', ')}</p>
                  </div>
                  <div className="flex items-center text-sm shrink-0">
                    <Star className="h-4 w-4 text-[var(--gold)] mr-1" />
                    <span className="font-medium text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{seller.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ALERTS + CTA ═══ */}
      <section className="py-14 md:py-20 px-4 bg-[var(--champagne)]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-[var(--gold)] mb-3 uppercase tracking-[0.2em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Stay Ahead</p>
          <h2 className="text-xl md:text-3xl tracking-tight text-foreground mb-8 md:mb-12">
            Set Alerts and Track Market Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            <div className="p-6 md:p-8 bg-white rounded-2xl shadow-sm text-left premium-card">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold-muted)] flex items-center justify-center mb-4">
                <TrendingDown className="h-5 w-5 text-[var(--gold)]" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2 text-foreground">Price Alerts</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Get notified instantly when your dream watch drops below your target price across all platforms.
              </p>
              <Button variant="outline" asChild className="rounded-xl">
                <Link to="/price-alert" style={{ fontFamily: 'Inter, sans-serif' }}>Set Alert</Link>
              </Button>
            </div>
            <div className="p-6 md:p-8 bg-white rounded-2xl shadow-sm text-left premium-card">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold-muted)] flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5 text-[var(--gold)]" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2 text-foreground">For Sellers</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Join our vetted dealer network. Your listings appear alongside eBay, Chrono24, and WatchBox.
              </p>
              <Button asChild className="btn-gold rounded-xl border-0">
                <Link to="/for-sellers" style={{ fontFamily: 'Inter, sans-serif' }}>Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustSection />
      <Footer />
    </div>
  );
};

export default Index;
