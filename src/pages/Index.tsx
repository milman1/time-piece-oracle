import React from 'react';
import { Search, ShieldCheck, Star, TrendingUp, ArrowRight, ExternalLink, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
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
    <div className="min-h-screen bg-[var(--warm-white)]">
      <Helmet>
        <title>Hours — The Luxury Watch Meta-Marketplace</title>
        <meta name="description" content="Hours aggregates luxury watch listings from eBay, Chrono24, WatchBox, and vetted independent dealers." />
        <meta name="keywords" content="luxury watches, watch prices, compare watches, Rolex, Omega, Patek Philippe" />
        <link rel="canonical" href="https://www.hours.com/" />
      </Helmet>
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="hero-gradient grain pt-28 md:pt-36 pb-20 md:pb-32 px-5 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="animate-fade-up">
            <p className="text-[11px] text-white/25 uppercase tracking-[0.3em] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              The watch meta-marketplace
            </p>
            <h1 className="text-[2rem] md:text-5xl lg:text-[3.5rem] tracking-tight text-white mb-6 leading-[1.12]">
              Every Listing. Every Platform.
              <br />
              <span className="animate-shimmer">One Search.</span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-white/35 max-w-xl mx-auto leading-relaxed mb-10" style={{ fontFamily: 'Inter, sans-serif' }}>
              We aggregate listings from every major platform and vetted independents — surface the best price, and send you straight to the seller.
            </p>
          </div>

          <div className="animate-fade-up-delay-1">
            <HeroSearch />
          </div>

          {/* Platform pills */}
          <div className="mt-12 md:mt-16 animate-fade-up-delay-2">
            <p className="text-[10px] text-white/15 mb-4 uppercase tracking-[0.3em]" style={{ fontFamily: 'Inter, sans-serif' }}>Aggregating from</p>
            <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2">
              {platformNames.map(name => (
                <span key={name} className="px-3 py-1.5 bg-white/[0.03] rounded-full text-[11px] text-white/25 border border-white/[0.05]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {name}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-[var(--gold-subtle)] rounded-full text-[11px] text-[var(--gold)] border border-[var(--gold)]/10" style={{ fontFamily: 'Inter, sans-serif' }}>
                + Vetted Dealers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LIVE SHOWCASE ═══ */}
      {featuredGroup && (
        <section className="py-16 md:py-24 px-5 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <p className="text-[11px] text-[var(--gold)] mb-3 uppercase tracking-[0.25em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Live Comparison</p>
              <h2 className="text-[1.6rem] md:text-[2.25rem] tracking-tight text-foreground mb-3 leading-tight">
                One Watch. {featuredGroup.listingCount} Sellers.
                <br className="hidden md:block" /> One Best Price.
              </h2>
              <p className="text-[14px] text-muted-foreground max-w-md mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                Every listing, one view, lowest price surfaced instantly.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-elevated overflow-hidden border border-slate-100/80">
              <div className="p-5 md:p-7">
                {/* Model header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3 pb-5 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {featuredGroup.brand} {featuredGroup.model}
                    </h3>
                    <p className="text-[12px] text-muted-foreground mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Ref: {featuredGroup.reference} · {featuredGroup.listingCount} listings aggregated
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl md:text-3xl font-semibold text-foreground stat-number" style={{ fontFamily: 'Inter, sans-serif' }}>${featuredGroup.lowestPrice.toLocaleString()}</span>
                    {featuredGroup.highestPrice > featuredGroup.lowestPrice && (
                      <Badge className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-[11px] font-medium">
                        <TrendingDown className="h-3 w-3" />
                        Save ${(featuredGroup.highestPrice - featuredGroup.lowestPrice).toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Listing rows */}
                <div className="space-y-1.5">
                  {featuredGroup.listings.sort((a, b) => a.price - b.price).slice(0, 5).map((listing, idx) => (
                    <div
                      key={listing.id}
                      className={`flex items-center gap-2 md:gap-4 p-2.5 md:p-3.5 rounded-xl transition-all duration-300 ${idx === 0 ? 'bg-emerald-50/80 ring-1 ring-emerald-200/60' : 'bg-slate-50/40 hover:bg-slate-50'}`}
                    >
                      {idx === 0 && <Badge className="bg-emerald-600 text-white text-[11px] shrink-0 font-medium">Best</Badge>}
                      <Badge variant="outline" className="text-[11px] shrink-0 border-slate-200">{listing.marketplace}</Badge>
                      <span className="text-[12px] md:text-[13px] text-muted-foreground flex-1 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{listing.seller}</span>
                      <span className={`font-semibold shrink-0 stat-number ${idx === 0 ? 'text-base md:text-lg' : 'text-[13px]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                        ${listing.price.toLocaleString()}
                      </span>
                      <Button size="sm" variant={idx === 0 ? "default" : "outline"} asChild className={`rounded-lg text-[11px] px-2.5 md:px-3 shrink-0 h-8 min-w-[52px] transition-all duration-300 ${idx === 0 ? 'btn-navy border-0' : 'hover:border-[var(--gold)] hover:text-[var(--gold)]'}`}>
                        <a href={listing.affiliate_url || listing.listing_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 md:px-7 py-4 bg-slate-50/50 border-t border-slate-100">
                <div className="text-center">
                  <Link to="/browse" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-[var(--gold)] transition-colors duration-300 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Search any watch <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-16 md:py-24 px-5 bg-[var(--warm-50)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[11px] text-[var(--gold)] mb-3 uppercase tracking-[0.25em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>How It Works</p>
            <h2 className="text-[1.6rem] md:text-[2.25rem] tracking-tight text-foreground leading-tight">
              A Marketplace of Marketplaces
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              { icon: Search, step: '01', title: 'We Aggregate', desc: 'Listings from eBay, Chrono24, WatchBox, and vetted independents flow into a single feed.' },
              { icon: TrendingUp, step: '02', title: 'We Surface', desc: 'Our engine groups the same model, ranks by price, and highlights the best deal for you.' },
              { icon: ShieldCheck, step: '03', title: 'We Route', desc: 'You click through to buy directly from the seller — no middleman, no markup, no fees.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={title} className="group p-6 md:p-8 bg-white rounded-2xl shadow-soft premium-card border border-slate-100/60">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--gold-subtle)] group-hover:bg-[var(--gold-muted)] flex items-center justify-center transition-all duration-500">
                    <Icon className="h-[18px] w-[18px] text-[var(--gold)]" />
                  </div>
                  <span className="text-[11px] text-muted-foreground/50 font-medium tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>{step}</span>
                </div>
                <h3 className="text-[17px] font-semibold mb-2 text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VETTED SELLERS ═══ */}
      {featuredSellers.length > 0 && (
        <section className="py-16 md:py-24 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-3">
              <div>
                <p className="text-[11px] text-[var(--gold)] mb-2 uppercase tracking-[0.25em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Vetted Network</p>
                <h2 className="text-xl md:text-[1.75rem] tracking-tight text-foreground">Independent Dealers</h2>
              </div>
              <Link to="/for-sellers" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-[var(--gold)] transition-colors duration-300 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Join the network <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featuredSellers.map((seller: VettedSeller) => (
                <div key={seller.id} className="group flex gap-4 p-4 md:p-5 bg-[var(--warm-50)] rounded-2xl border border-slate-100/60 hover:shadow-soft hover:border-slate-200/80 transition-all duration-400">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[var(--gold-subtle)] group-hover:bg-[var(--gold-muted)] flex items-center justify-center text-[15px] font-semibold text-[var(--gold)] flex-shrink-0 transition-colors duration-400">
                    {seller.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-[14px] truncate text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{seller.name}</h3>
                      <Badge className="text-[10px] flex items-center gap-0.5 text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 shrink-0 font-medium">
                        <ShieldCheck className="h-3 w-3" /> Vetted
                      </Badge>
                    </div>
                    <p className="text-[12px] text-muted-foreground truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{seller.location} · {seller.listingCount} listings · {seller.specialties.slice(0, 2).join(', ')}</p>
                  </div>
                  <div className="flex items-center text-[13px] shrink-0">
                    <Star className="h-3.5 w-3.5 text-[var(--gold)] mr-1" />
                    <span className="font-medium text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{seller.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-16 md:py-24 px-5 bg-[var(--warm-50)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[11px] text-[var(--gold)] mb-3 uppercase tracking-[0.25em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Stay Ahead</p>
            <h2 className="text-xl md:text-[1.75rem] tracking-tight text-foreground">
              Alerts & Seller Network
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="group p-6 md:p-8 bg-white rounded-2xl shadow-soft premium-card border border-slate-100/60">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold-subtle)] group-hover:bg-[var(--gold-muted)] flex items-center justify-center mb-5 transition-all duration-500">
                <TrendingDown className="h-[18px] w-[18px] text-[var(--gold)]" />
              </div>
              <h3 className="text-[17px] font-semibold mb-2 text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Price Alerts</h3>
              <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Get notified when your dream watch drops below your target — across every platform.
              </p>
              <Button variant="outline" asChild className="rounded-xl text-[13px] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300">
                <Link to="/price-alert" style={{ fontFamily: 'Inter, sans-serif' }}>Set Alert</Link>
              </Button>
            </div>
            <div className="group p-6 md:p-8 bg-white rounded-2xl shadow-soft premium-card border border-slate-100/60">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold-subtle)] group-hover:bg-[var(--gold-muted)] flex items-center justify-center mb-5 transition-all duration-500">
                <ShieldCheck className="h-[18px] w-[18px] text-[var(--gold)]" />
              </div>
              <h3 className="text-[17px] font-semibold mb-2 text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>For Sellers</h3>
              <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Join our vetted dealer network — your listings alongside eBay, Chrono24, and WatchBox.
              </p>
              <Button asChild className="btn-gold rounded-xl text-[13px] border-0">
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
