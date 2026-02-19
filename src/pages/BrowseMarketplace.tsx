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
    X, ArrowUpDown, TrendingDown
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
        <div className="min-h-screen bg-[var(--ivory)]">
            <Helmet>
                <title>Search the Meta-Marketplace | Hours</title>
                <meta name="description" content="Hours aggregates luxury watch listings from eBay, Chrono24, WatchBox, and vetted independents. Search once, see every listing, find the best price." />
            </Helmet>
            <Header />

            <main className="py-8 md:py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-4xl tracking-tight text-foreground mb-2 md:mb-3">
                            Search the Meta-Marketplace
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Every listing from {platformNames.length} platforms + vetted independents, in one search
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-6 md:mb-8">
                        <div className="relative search-glow rounded-2xl transition-all duration-300">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search by brand, model, or reference..."
                                className="pl-11 pr-12 py-3 rounded-2xl text-base border-slate-200 bg-white shadow-sm focus:border-[var(--gold)]"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-[var(--gold-muted)]"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="max-w-3xl mx-auto mb-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-medium mb-1.5 text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Min Price</label>
                                    <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="$0" className="py-2 text-sm rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5 text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Max Price</label>
                                    <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="No max" className="py-2 text-sm rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5 text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Condition</label>
                                    <select
                                        value={selectedCondition}
                                        onChange={(e) => setSelectedCondition(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-white"
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

                            {/* Platform Filter */}
                            <div>
                                <label className="block text-xs font-medium mb-2 text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Platforms</label>
                                <div className="flex flex-wrap gap-2">
                                    {platformNames.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => togglePlatform(p)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${selectedPlatforms.includes(p) || selectedPlatforms.length === 0
                                                ? 'bg-[var(--navy)] text-white border-[var(--navy)]'
                                                : 'bg-white border-slate-200 text-muted-foreground hover:border-[var(--gold)]'
                                                }`}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="mt-3 text-xs text-[var(--gold)] hover:underline flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    <X className="h-3 w-3" /> Clear all filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Controls Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grouped')}
                                className={`px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewMode === 'grouped' ? 'bg-[var(--navy)] text-white' : 'bg-white border border-slate-200 hover:border-[var(--gold)] text-muted-foreground'}`}
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Grouped by Model
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-[var(--navy)] text-white' : 'bg-white border border-slate-200 hover:border-[var(--gold)] text-muted-foreground'}`}
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                All Listings
                            </button>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="text-sm border border-slate-200 rounded-xl px-2 py-1.5"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="most-listings">Most Options</option>
                                </select>
                            </div>
                            <span className="text-xs md:text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {allListings.length} listings across {grouped.length} models
                            </span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="w-8 h-8 border-2 border-b-transparent border-[var(--gold)] rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Searching across {platformNames.length} platforms...</p>
                        </div>
                    ) : viewMode === 'grouped' ? (
                        <div className="space-y-4">
                            {sortedGrouped.map((group: WatchGroup) => (
                                <Card key={`${group.brand}-${group.reference}`} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden premium-card">
                                    <CardContent className="p-3 md:p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-1 md:gap-2 pb-3 border-b border-slate-100">
                                            <div>
                                                <h3 className="text-base md:text-lg font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                    {group.brand} {group.model}
                                                </h3>
                                                <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                    Ref: {group.reference} · {group.listingCount} listing{group.listingCount > 1 ? 's' : ''} found
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <span className="text-xl md:text-2xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>${group.lowestPrice.toLocaleString()}</span>
                                                {group.listingCount > 1 && group.highestPrice > group.lowestPrice && (
                                                    <>
                                                        <span className="text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                            to ${group.highestPrice.toLocaleString()}
                                                        </span>
                                                        <Badge className="text-xs flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200">
                                                            <TrendingDown className="h-3 w-3" />
                                                            Save ${(group.highestPrice - group.lowestPrice).toLocaleString()}
                                                        </Badge>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 md:space-y-2">
                                            {group.listings.sort((a, b) => a.price - b.price).map((listing: Watch, idx: number) => (
                                                <div
                                                    key={listing.id}
                                                    className={`flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-xl transition-all ${idx === 0 ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-slate-50/50 hover:bg-slate-50'}`}
                                                >
                                                    {idx === 0 && <Badge className="bg-emerald-600 text-white text-xs shrink-0">Best</Badge>}
                                                    <Badge variant="outline" className="text-xs shrink-0">{listing.marketplace}</Badge>
                                                    <span className="text-xs md:text-sm text-muted-foreground truncate flex-1 min-w-0" style={{ fontFamily: 'Inter, sans-serif' }}>{listing.seller}</span>
                                                    <span className={`font-semibold shrink-0 ${idx === 0 ? 'text-base md:text-lg' : 'text-sm'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        ${listing.price.toLocaleString()}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant={idx === 0 ? "default" : "outline"}
                                                        asChild
                                                        className={`rounded-xl text-xs px-2.5 md:px-3 shrink-0 h-8 min-w-[52px] ${idx === 0 ? 'btn-navy border-0' : 'hover:border-[var(--gold)] hover:text-[var(--gold)]'}`}
                                                    >
                                                        <a href={listing.affiliate_url || listing.listing_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                            View <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sortedAll.map((watch: Watch) => (
                                <Card key={watch.id} className="border border-slate-100 shadow-sm rounded-2xl premium-card">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge variant="outline" className="text-xs">{watch.marketplace}</Badge>
                                            {watch.trusted && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                                        </div>
                                        <h3 className="font-semibold mb-1 text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{watch.brand} {watch.model}</h3>
                                        <p className="text-xs text-muted-foreground mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Ref: {watch.reference} · {watch.condition}</p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>${watch.price.toLocaleString()}</span>
                                                {watch.original_price && watch.original_price > watch.price && (
                                                    <span className="text-xs text-muted-foreground line-through ml-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        ${watch.original_price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <Button size="sm" variant="outline" asChild className="rounded-xl text-xs px-3 hover:border-[var(--gold)] hover:text-[var(--gold)]">
                                                <a href={watch.affiliate_url || watch.listing_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                    View <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </Button>
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {watch.seller} · <Star className="h-3 w-3 text-[var(--gold)]" /> {watch.rating}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!isLoading && allListings.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--gold-muted)] flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-[var(--gold)]" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No watches found</h3>
                            <p className="text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BrowseMarketplace;
