import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
    Search, SlidersHorizontal, Star, ShieldCheck, ExternalLink,
    X, ArrowUpDown, TrendingDown, Watch as WatchIcon
} from 'lucide-react';
import { searchAllPlatforms, Watch, WatchGroup } from '@/services/watchService';
import { getAllPlatformNames } from '@/services/platformMockService';

type SortOption = 'price-asc' | 'price-desc' | 'most-listings';
type ViewMode = 'grid' | 'grouped';

const BrowseMarketplace = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [searchText, setSearchText] = useState(initialQuery);
    const [debouncedSearch, setDebouncedSearch] = useState(initialQuery);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('price-asc');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('grouped');

    const platformNames = getAllPlatformNames();

    useEffect(() => {
        const q = searchParams.get('q') || '';
        if (q && q !== searchText) {
            setSearchText(q);
            setDebouncedSearch(q);
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(timer);
    }, [searchText]);

    const { data, isLoading } = useQuery({
        queryKey: ['browseAll', debouncedSearch, minPrice, maxPrice, selectedCondition, selectedPlatforms],
        queryFn: () => searchAllPlatforms(debouncedSearch, {
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            condition: selectedCondition || undefined,
            platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
        }),
        staleTime: 30_000,
    });

    const allListings = data?.all || [];
    const grouped = data?.grouped || [];

    const sortedAll = [...allListings].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
    });

    const sortedGrouped = [...grouped].sort((a, b) => {
        if (sortBy === 'price-asc') return a.lowestPrice - b.lowestPrice;
        if (sortBy === 'price-desc') return b.lowestPrice - a.lowestPrice;
        if (sortBy === 'most-listings') return b.listingCount - a.listingCount;
        return 0;
    });

    const togglePlatform = (p: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
        );
    };

    const clearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedCondition('');
        setSelectedPlatforms([]);
        setSearchText('');
    };

    const hasActiveFilters = minPrice || maxPrice || selectedCondition || selectedPlatforms.length > 0;

    return (
        <div className="min-h-screen bg-[var(--warm-white)]">
            <Helmet>
                <title>Search the Meta-Marketplace | Hours</title>
                <meta name="description" content="Hours aggregates luxury watch listings from eBay, Chrono24, WatchBox, and vetted independents." />
            </Helmet>
            <Header />

            <main className="pt-20 md:pt-24 pb-10 md:pb-16 px-5">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-[1.6rem] md:text-[2.25rem] tracking-tight text-foreground mb-2">
                            Search the Meta-Marketplace
                        </h1>
                        <p className="text-[13px] md:text-[14px] text-muted-foreground max-w-md mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Every listing from {platformNames.length} platforms + vetted independents, in one search
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-6 md:mb-8">
                        <div className="relative search-glow rounded-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/50" />
                            <Input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search by brand, model, or reference..."
                                className="pl-11 pr-12 py-3 rounded-2xl text-[14px] border-slate-200/80 bg-white shadow-soft focus:border-[var(--gold)]/50 focus:shadow-glow-gold transition-all duration-400"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-lg transition-all duration-300 ${showFilters ? 'bg-[var(--gold-muted)] text-[var(--gold)]' : 'hover:bg-slate-100 text-muted-foreground'}`}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="max-w-2xl mx-auto mb-6 p-5 bg-white rounded-2xl border border-slate-100/80 shadow-soft animate-slide-down">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-[11px] font-medium mb-1.5 text-muted-foreground uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Min Price</label>
                                    <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="$0" className="py-2 text-[13px] rounded-xl border-slate-200/80" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium mb-1.5 text-muted-foreground uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Max Price</label>
                                    <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="No max" className="py-2 text-[13px] rounded-xl border-slate-200/80" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium mb-1.5 text-muted-foreground uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Condition</label>
                                    <select
                                        value={selectedCondition}
                                        onChange={(e) => setSelectedCondition(e.target.value)}
                                        className="w-full border border-slate-200/80 rounded-xl py-2 px-3 text-[13px] bg-white transition-colors focus:border-[var(--gold)]/50"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        <option value="">Any</option>
                                        <option value="New">New</option>
                                        <option value="Unworn">Unworn</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Very Good">Very Good</option>
                                        <option value="Pre-owned">Pre-owned</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-medium mb-2 text-muted-foreground uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Platforms</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {platformNames.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => togglePlatform(p)}
                                            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-300 border ${selectedPlatforms.includes(p) || selectedPlatforms.length === 0
                                                ? 'bg-[var(--navy)] text-white border-[var(--navy)]'
                                                : 'bg-white border-slate-200/80 text-muted-foreground hover:border-[var(--gold)]/50'
                                                }`}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="mt-3 text-[12px] text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors flex items-center gap-1 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    <X className="h-3 w-3" /> Clear all
                                </button>
                            )}
                        </div>
                    )}

                    {/* Controls Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
                        <div className="flex items-center gap-1 bg-[var(--warm-50)] rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grouped')}
                                className={`px-3 md:px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-300 ${viewMode === 'grouped' ? 'bg-white shadow-soft text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Grouped by Model
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 md:px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-soft text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                All Listings
                            </button>
                        </div>

                        <div className="flex items-center gap-2.5 flex-wrap">
                            <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-xl px-2.5 py-1.5">
                                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="text-[13px] bg-transparent outline-none cursor-pointer pr-1"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="most-listings">Most Options</option>
                                </select>
                            </div>
                            <span className="text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {allListings.length} listings across {grouped.length} models
                            </span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="w-8 h-8 border-2 border-b-transparent border-[var(--gold)] rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-[14px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Searching across {platformNames.length} platforms…</p>
                        </div>
                    ) : viewMode === 'grouped' ? (
                        <div className="space-y-3">
                            {sortedGrouped.map((group: WatchGroup) => (
                                <div key={`${group.brand}-${group.reference}`} className="bg-white rounded-2xl shadow-soft border border-slate-100/60 overflow-hidden transition-all duration-400 hover:shadow-elevated">
                                    <div className="p-4 md:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-1.5 pb-3 border-b border-slate-100/80">
                                            <div className="flex items-center gap-3">
                                                {group.listings[0]?.image ? (
                                                    <img src={group.listings[0].image} alt={`${group.brand} ${group.model}`} className="w-14 h-14 rounded-xl object-cover bg-slate-50 shrink-0" />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-xl bg-[var(--gold-subtle)] flex items-center justify-center shrink-0">
                                                        <span className="text-lg font-bold text-[var(--gold)]">{group.brand.charAt(0)}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-[15px] md:text-[17px] font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        {group.brand} {group.model}
                                                    </h3>
                                                    <p className="text-[12px] text-muted-foreground mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        Ref: {group.reference} · {group.listingCount} listing{group.listingCount > 1 ? 's' : ''} found
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <span className="text-xl md:text-2xl font-semibold stat-number" style={{ fontFamily: 'Inter, sans-serif' }}>${group.lowestPrice.toLocaleString()}</span>
                                                {group.listingCount > 1 && group.highestPrice > group.lowestPrice && (
                                                    <>
                                                        <span className="text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                            to ${group.highestPrice.toLocaleString()}
                                                        </span>
                                                        <Badge className="text-[11px] flex items-center gap-1 text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 font-medium">
                                                            <TrendingDown className="h-3 w-3" />
                                                            Save ${(group.highestPrice - group.lowestPrice).toLocaleString()}
                                                        </Badge>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            {group.listings.sort((a, b) => a.price - b.price).map((listing: Watch, idx: number) => (
                                                <div
                                                    key={listing.id}
                                                    className={`flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl transition-all duration-300 ${idx === 0 ? 'bg-emerald-50/70 ring-1 ring-emerald-200/50' : 'bg-[var(--warm-50)]/50 hover:bg-[var(--warm-50)]'}`}
                                                >
                                                    {listing.image && (
                                                        <img src={listing.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-50 shrink-0 hidden md:block" />
                                                    )}
                                                    {idx === 0 && <Badge className="bg-emerald-600 text-white text-[11px] shrink-0 font-medium">Best</Badge>}
                                                    <Badge variant="outline" className="text-[11px] shrink-0 border-slate-200/80">{listing.marketplace}</Badge>
                                                    <span className="text-[12px] md:text-[13px] text-muted-foreground truncate flex-1 min-w-0" style={{ fontFamily: 'Inter, sans-serif' }}>{listing.seller}</span>
                                                    <span className={`font-semibold shrink-0 stat-number ${idx === 0 ? 'text-base md:text-lg' : 'text-[13px]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        ${listing.price.toLocaleString()}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant={idx === 0 ? "default" : "outline"}
                                                        asChild
                                                        className={`rounded-lg text-[11px] px-2.5 md:px-3 shrink-0 h-8 min-w-[52px] transition-all duration-300 ${idx === 0 ? 'btn-navy border-0' : 'border-slate-200/80 hover:border-[var(--gold)] hover:text-[var(--gold)]'}`}
                                                    >
                                                        <a href={listing.affiliate_url || listing.listing_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                            View <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {sortedAll.map((watch: Watch) => (
                                <div key={watch.id} className="bg-white rounded-2xl shadow-soft border border-slate-100/60 overflow-hidden transition-all duration-400 hover:shadow-elevated group">
                                    {watch.image ? (
                                        <div className="w-full h-40 bg-slate-50 overflow-hidden">
                                            <img src={watch.image} alt={`${watch.brand} ${watch.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-40 bg-[var(--warm-50)] flex items-center justify-center">
                                            <WatchIcon className="h-10 w-10 text-slate-200" />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge variant="outline" className="text-[11px] border-slate-200/80">{watch.marketplace}</Badge>
                                            {watch.trusted && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                                        </div>
                                        <h3 className="font-semibold text-[15px] mb-1 text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{watch.brand} {watch.model}</h3>
                                        <p className="text-[12px] text-muted-foreground mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Ref: {watch.reference} · {watch.condition}</p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xl font-semibold stat-number" style={{ fontFamily: 'Inter, sans-serif' }}>${watch.price.toLocaleString()}</span>
                                                {watch.original_price && watch.original_price > watch.price && (
                                                    <span className="text-[12px] text-muted-foreground line-through ml-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        ${watch.original_price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <Button size="sm" variant="outline" asChild className="rounded-lg text-[11px] px-3 h-8 border-slate-200/80 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300">
                                                <a href={watch.affiliate_url || watch.listing_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                    View <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </Button>
                                        </div>
                                        <div className="mt-2.5 pt-2.5 border-t border-slate-100/60 text-[12px] text-muted-foreground flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {watch.seller} · <Star className="h-3 w-3 text-[var(--gold)]" /> {watch.rating}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && allListings.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--gold-subtle)] flex items-center justify-center mx-auto mb-4">
                                <Search className="h-6 w-6 text-[var(--gold)]" />
                            </div>
                            <h3 className="text-[17px] font-semibold mb-2">No watches found</h3>
                            <p className="text-[14px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BrowseMarketplace;
