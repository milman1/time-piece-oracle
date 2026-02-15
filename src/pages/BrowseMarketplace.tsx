import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('price-asc');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('grouped');

    const platformNames = getAllPlatformNames();

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
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Search the Meta-Marketplace | Hours</title>
                <meta name="description" content="Hours aggregates luxury watch listings from eBay, Chrono24, WatchBox, and vetted independents. Search once, see every listing, find the best price." />
            </Helmet>
            <Header />

            <main className="py-8 md:py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-3">
                            Search the Meta-Marketplace
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Every listing from {platformNames.length} platforms + vetted independents, in one search
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search by brand, model, or reference..."
                                className="pl-12 pr-12 py-3 rounded-xl text-base"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="max-w-3xl mx-auto mb-8 p-5 bg-slate-50 rounded-xl border">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-medium mb-1.5">Min Price</label>
                                    <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="$0" className="py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5">Max Price</label>
                                    <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="No max" className="py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5">Condition</label>
                                    <select
                                        value={selectedCondition}
                                        onChange={(e) => setSelectedCondition(e.target.value)}
                                        className="w-full border rounded-lg py-2 px-3 text-sm bg-white"
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
                                <label className="block text-xs font-medium mb-2">Platforms</label>
                                <div className="flex flex-wrap gap-2">
                                    {platformNames.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => togglePlatform(p)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${selectedPlatforms.includes(p) || selectedPlatforms.length === 0
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : 'bg-white border-slate-200 text-muted-foreground hover:border-slate-400'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="mt-3 text-xs text-slate-500 hover:underline flex items-center gap-1">
                                    <X className="h-3 w-3" /> Clear all filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Controls Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grouped')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grouped' ? 'bg-slate-900 text-white' : 'bg-white border hover:border-slate-400 text-muted-foreground'
                                    }`}
                            >
                                Grouped by Model
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-white border hover:border-slate-400 text-muted-foreground'
                                    }`}
                            >
                                All Listings
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="text-sm border rounded-lg px-3 py-1.5"
                            >
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="most-listings">Most Options</option>
                            </select>
                            <span className="text-sm text-muted-foreground ml-2">
                                {allListings.length} listings across {grouped.length} models
                            </span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="w-8 h-8 border-2 border-b-transparent border-slate-400 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Searching across {platformNames.length} platforms...</p>
                        </div>
                    ) : viewMode === 'grouped' ? (
                        <div className="space-y-4">
                            {sortedGrouped.map((group: WatchGroup) => (
                                <Card key={`${group.brand}-${group.reference}`} className="border">
                                    <CardContent className="p-5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                            <div>
                                                <h3 className="text-lg font-medium text-foreground">
                                                    {group.brand} {group.model}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Ref: {group.reference} · {group.listingCount} listing{group.listingCount > 1 ? 's' : ''} found
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-semibold">${group.lowestPrice.toLocaleString()}</span>
                                                {group.listingCount > 1 && group.highestPrice > group.lowestPrice && (
                                                    <>
                                                        <span className="text-xs text-muted-foreground">
                                                            to ${group.highestPrice.toLocaleString()}
                                                        </span>
                                                        <Badge variant="secondary" className="text-xs flex items-center gap-1 text-emerald-700 bg-emerald-50">
                                                            <TrendingDown className="h-3 w-3" />
                                                            Save ${(group.highestPrice - group.lowestPrice).toLocaleString()}
                                                        </Badge>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {group.listings.sort((a, b) => a.price - b.price).map((listing: Watch, idx: number) => (
                                                <div
                                                    key={listing.id}
                                                    className={`flex items-center gap-4 p-3 rounded-lg ${idx === 0 ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-slate-50'
                                                        }`}
                                                >
                                                    {idx === 0 && <Badge className="bg-emerald-600 text-white text-xs flex-shrink-0">Best Price</Badge>}
                                                    <Badge variant="outline" className="text-xs flex-shrink-0">{listing.marketplace}</Badge>
                                                    <span className="text-sm text-muted-foreground truncate flex-1">{listing.seller}</span>
                                                    <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                                                        {listing.trusted && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                                                        <Star className="h-3 w-3 text-yellow-500" />
                                                        {listing.rating}
                                                    </div>
                                                    <Badge variant="outline" className="text-xs hidden sm:inline-flex">{listing.condition}</Badge>
                                                    <span className={`font-semibold flex-shrink-0 ${idx === 0 ? 'text-lg' : 'text-sm'}`}>
                                                        ${listing.price.toLocaleString()}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant={idx === 0 ? "default" : "outline"}
                                                        asChild
                                                        className="rounded-lg text-xs px-3 flex-shrink-0"
                                                    >
                                                        <a href={listing.listing_url || listing.affiliate_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
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
                                <Card key={watch.id} className="border">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge variant="outline" className="text-xs">{watch.marketplace}</Badge>
                                            {watch.trusted && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                                        </div>
                                        <h3 className="font-medium mb-1">{watch.brand} {watch.model}</h3>
                                        <p className="text-xs text-muted-foreground mb-3">Ref: {watch.reference} · {watch.condition}</p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xl font-semibold">${watch.price.toLocaleString()}</span>
                                                {watch.original_price && watch.original_price > watch.price && (
                                                    <span className="text-xs text-muted-foreground line-through ml-2">
                                                        ${watch.original_price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <Button size="sm" variant="outline" asChild className="rounded-lg text-xs px-3">
                                                <a href={watch.listing_url || watch.affiliate_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                    View <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </Button>
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                                            {watch.seller} · <Star className="h-3 w-3 text-yellow-500" /> {watch.rating}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!isLoading && allListings.length === 0 && (
                        <div className="text-center py-16">
                            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No watches found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BrowseMarketplace;
