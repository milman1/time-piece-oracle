
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import NotFound from './NotFound';
import {
  Star, ExternalLink, TrendingDown, ShieldCheck, ArrowLeft,
  Watch as WatchIcon, BarChart3, Clock, Tag
} from 'lucide-react';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import { fetchPriceHistory } from '@/services/priceService';
import {
  getWatchByReference, searchAllPlatforms, slugify, buildAffiliateLink,
  Watch, WatchGroup
} from '@/services/watchService';

const ProductDetail = () => {
  const { brand, model, ref } = useParams<{ brand: string; model: string; ref: string }>();
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState<30 | 90 | 180>(90);

  // Fetch the primary watch by reference
  const { data: watch, isLoading, error } = useQuery({
    queryKey: ['watch', ref],
    queryFn: () => getWatchByReference(decodeURIComponent(ref!)),
    enabled: !!ref,
    retry: false,
  });

  // Fetch all cross-platform listings for this model
  const { data: platformData } = useQuery({
    queryKey: ['watch-listings', watch?.brand, watch?.model],
    queryFn: () => searchAllPlatforms(`${watch!.brand} ${watch!.model}`),
    enabled: !!watch,
    staleTime: 60_000,
  });

  // Redirect to canonical URL if slug doesn't match
  useEffect(() => {
    if (watch && brand && model) {
      const expectedBrand = slugify(watch.brand);
      const expectedModel = slugify(watch.model);
      if (brand !== expectedBrand || model !== expectedModel) {
        navigate(`/watch/${expectedBrand}/${expectedModel}/${encodeURIComponent(watch.reference)}`, { replace: true });
      }
    }
  }, [watch, brand, model, navigate]);

  // Price history
  const { data: pricePoints = [], isFetching: isLoadingPrices } = useQuery({
    queryKey: ['price-history', { watchId: watch?.id, range: priceRange }],
    queryFn: () => fetchPriceHistory(watch!.id, priceRange),
    enabled: !!watch?.id,
    staleTime: 60_000,
  });

  // Find the matching group from cross-platform data
  const matchingGroup = platformData?.grouped?.find(
    (g: WatchGroup) => g.reference?.toLowerCase() === watch?.reference?.toLowerCase()
      || (g.brand === watch?.brand && g.model === watch?.model)
  );
  const listings = matchingGroup?.listings || (watch ? [watch] : []);
  const sortedListings = [...listings].sort((a, b) => a.price - b.price);

  // Related models from the same brand (other groups)
  const relatedGroups = platformData?.grouped
    ?.filter((g: WatchGroup) => g.reference !== watch?.reference)
    ?.slice(0, 4) || [];

  // Find best listing image
  const heroImage = listings.find((l: Watch) => l.image)?.image;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--warm-white)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-b-transparent border-[var(--gold)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Loading watch details…</p>
        </div>
      </div>
    );
  }

  if (error || !watch) return <NotFound />;

  const savings = sortedListings.length > 1
    ? sortedListings[sortedListings.length - 1].price - sortedListings[0].price
    : 0;

  return (
    <div className="min-h-screen bg-[var(--warm-white)]">
      <Helmet>
        <title>{watch.brand} {watch.model} — Best Prices | Hours</title>
        <meta name="description" content={`Compare ${watch.brand} ${watch.model} (${watch.reference}) prices across ${sortedListings.length} trusted sellers. Lowest price: $${sortedListings[0]?.price.toLocaleString()}. Updated daily.`} />
        <meta name="keywords" content={`${watch.brand} ${watch.model} price, ${watch.reference}, buy ${watch.brand} ${watch.model}, ${watch.brand} watch best price`} />
        <link rel="canonical" href={`https://hours.com/watch/${slugify(watch.brand)}/${slugify(watch.model)}/${encodeURIComponent(watch.reference)}`} />
        <meta property="og:title" content={`${watch.brand} ${watch.model} — Best Prices | Hours`} />
        <meta property="og:description" content={`Compare ${sortedListings.length} listings for ${watch.brand} ${watch.model}. From $${sortedListings[0]?.price.toLocaleString()}.`} />
        <meta property="og:type" content="product" />
      </Helmet>
      <Header />

      <main className="pt-20 md:pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Back link */}
          <Link to="/browse" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-[var(--gold)] transition-colors mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to search
          </Link>

          {/* ═══ Hero Section ═══ */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10">
            {/* Image */}
            <div className="w-full md:w-80 shrink-0">
              {heroImage ? (
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 shadow-soft">
                  <img src={heroImage} alt={`${watch.brand} ${watch.model}`} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full aspect-square rounded-2xl bg-[var(--warm-50)] flex items-center justify-center shadow-soft">
                  <WatchIcon className="h-16 w-16 text-slate-200" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <p className="text-[11px] text-[var(--gold)] uppercase tracking-[0.2em] font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {watch.brand}
              </p>
              <h1 className="text-2xl md:text-4xl tracking-tight text-foreground mb-3 leading-tight">
                {watch.model}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Badge variant="outline" className="text-[11px] border-slate-200/80">Ref: {watch.reference}</Badge>
                {watch.condition && <Badge variant="outline" className="text-[11px] border-slate-200/80">{watch.condition}</Badge>}
                {watch.year && <Badge variant="outline" className="text-[11px] border-slate-200/80">{watch.year}</Badge>}
                {watch.movement && <Badge variant="outline" className="text-[11px] border-slate-200/80">{watch.movement}</Badge>}
              </div>

              {/* Price summary */}
              <div className="bg-white rounded-2xl shadow-soft border border-slate-100/60 p-5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-muted-foreground uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Best Price</span>
                  {savings > 0 && (
                    <Badge className="text-[11px] flex items-center gap-1 text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 font-medium">
                      <TrendingDown className="h-3 w-3" />
                      Save ${savings.toLocaleString()}
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-semibold stat-number" style={{ fontFamily: 'Inter, sans-serif' }}>
                    ${sortedListings[0]?.price.toLocaleString()}
                  </span>
                  {sortedListings.length > 1 && (
                    <span className="text-[13px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                      to ${sortedListings[sortedListings.length - 1].price.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-3 text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {sortedListings.length} listing{sortedListings.length !== 1 ? 's' : ''}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Updated daily</span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground/60 mb-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                We may earn a commission when you buy through links on our site.
              </p>
            </div>
          </div>

          {/* ═══ All Listings ═══ */}
          <section className="mb-10">
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              All Listings
            </h2>
            <div className="space-y-2">
              {sortedListings.map((listing: Watch, idx: number) => (
                <div
                  key={listing.id}
                  className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl transition-all duration-300 ${idx === 0 ? 'bg-emerald-50/70 ring-1 ring-emerald-200/50' : 'bg-white border border-slate-100/60 hover:shadow-soft'}`}
                >
                  {listing.image && (
                    <img src={listing.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50 shrink-0" />
                  )}
                  {idx === 0 && <Badge className="bg-emerald-600 text-white text-[11px] shrink-0 font-medium">Best</Badge>}
                  <Badge variant="outline" className="text-[11px] shrink-0 border-slate-200/80">{listing.marketplace}</Badge>
                  <span className="text-[12px] md:text-[13px] text-muted-foreground truncate flex-1 min-w-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {listing.seller}
                    {listing.condition && ` · ${listing.condition}`}
                  </span>
                  {listing.trusted && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0 hidden md:block" />}
                  <span className={`font-semibold shrink-0 stat-number ${idx === 0 ? 'text-base md:text-lg' : 'text-[13px]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                    ${listing.price.toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    variant={idx === 0 ? "default" : "outline"}
                    asChild
                    className={`rounded-lg text-[11px] px-2.5 md:px-3 shrink-0 h-8 min-w-[52px] transition-all duration-300 ${idx === 0 ? 'btn-navy border-0' : 'border-slate-200/80 hover:border-[var(--gold)] hover:text-[var(--gold)]'}`}
                  >
                    <a href={buildAffiliateLink(listing)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ Price History ═══ */}
          <section className="mb-10">
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100/60 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <BarChart3 className="h-4 w-4 text-[var(--gold)]" /> Price History
                </h2>
                <div className="flex gap-1.5">
                  {([30, 90, 180] as const).map((days) => (
                    <button
                      key={days}
                      onClick={() => setPriceRange(days)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all duration-300 ${priceRange === days ? 'bg-[var(--navy)] text-white' : 'bg-[var(--warm-50)] text-muted-foreground hover:bg-slate-200'}`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5">
                {isLoadingPrices ? (
                  <div className="flex items-center justify-center h-52">
                    <div className="w-6 h-6 border-2 border-b-transparent border-[var(--gold)] rounded-full animate-spin" />
                  </div>
                ) : (
                  <PriceHistoryChart data={pricePoints} />
                )}
              </div>
            </div>
          </section>

          {/* ═══ Watch Specs ═══ */}
          <section className="mb-10">
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Specifications
            </h2>
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100/60 overflow-hidden">
              {[
                ['Brand', watch.brand],
                ['Model', watch.model],
                ['Reference', watch.reference],
                ['Condition', watch.condition],
                ['Year', watch.year ? String(watch.year) : null],
                ['Movement', watch.movement],
                ['Strap', watch.strap],
                ['Style', watch.style],
              ].filter(([, v]) => v).map(([label, value], i) => (
                <div key={label} className={`flex items-center justify-between px-5 py-3 text-[13px] ${i % 2 === 0 ? 'bg-[var(--warm-50)]/50' : ''}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ Related Models ═══ */}
          {relatedGroups.length > 0 && (
            <section>
              <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relatedGroups.map((g: WatchGroup) => (
                  <Link
                    key={g.reference}
                    to={`/watch/${slugify(g.brand)}/${slugify(g.model)}/${encodeURIComponent(g.reference)}`}
                    className="bg-white rounded-2xl shadow-soft border border-slate-100/60 p-4 hover:shadow-elevated transition-all duration-400 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[14px] font-semibold text-foreground group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {g.brand} {g.model}
                        </h3>
                        <p className="text-[12px] text-muted-foreground mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {g.listingCount} listing{g.listingCount !== 1 ? 's' : ''} · From ${g.lowestPrice.toLocaleString()}
                        </p>
                      </div>
                      <span className="text-[var(--gold)] text-sm group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
