import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Search, X, ArrowRight, Trophy, TrendingDown
} from 'lucide-react';

interface CompareWatch {
    id: string;
    brand: string;
    model: string;
    reference: string;
    price: number;
    condition: string;
    seller: string;
    rating: number;
    year: number;
    movement: string;
    caseMaterial: string;
    strapType: string;
    marketplace: string;
}

const presetWatches: CompareWatch[] = [
    {
        id: 'cmp-1', brand: 'Rolex', model: 'Submariner Date', reference: '126610LN',
        price: 13200, condition: 'Excellent', seller: 'Crown & Caliber', rating: 4.9,
        year: 2023, movement: 'Automatic (Cal. 3235)', caseMaterial: 'Oystersteel',
        strapType: 'Oyster Bracelet', marketplace: 'Chrono24',
    },
    {
        id: 'cmp-2', brand: 'Omega', model: 'Seamaster 300M', reference: '210.30.42',
        price: 4800, condition: 'Very Good', seller: 'Hodinkee Shop', rating: 4.8,
        year: 2022, movement: 'Automatic (Cal. 8800)', caseMaterial: 'Stainless Steel',
        strapType: 'Steel Bracelet', marketplace: 'Hodinkee',
    },
    {
        id: 'cmp-3', brand: 'Tudor', model: 'Black Bay 58', reference: '79030N',
        price: 3650, condition: 'Unworn', seller: 'WatchBox', rating: 4.7,
        year: 2024, movement: 'Automatic (MT5402)', caseMaterial: 'Stainless Steel',
        strapType: 'Fabric Strap', marketplace: 'WatchBox',
    },
];

const COMPARE_ROWS: { label: string; key: keyof CompareWatch; format?: (val: any) => string }[] = [
    { label: 'Price', key: 'price', format: (v) => `$${v.toLocaleString()}` },
    { label: 'Condition', key: 'condition' },
    { label: 'Year', key: 'year', format: (v) => String(v) },
    { label: 'Movement', key: 'movement' },
    { label: 'Case', key: 'caseMaterial' },
    { label: 'Strap', key: 'strapType' },
    { label: 'Seller', key: 'seller' },
    { label: 'Rating', key: 'rating', format: (v) => `${v} ★` },
    { label: 'Platform', key: 'marketplace' },
];

const CompareWatches = () => {
    const [watches, setWatches] = useState<CompareWatch[]>(presetWatches);

    const removeWatch = (id: string) => {
        setWatches(prev => prev.filter(w => w.id !== id));
    };

    const cheapestId = watches.length > 0
        ? watches.reduce((prev, curr) => curr.price < prev.price ? curr : prev).id
        : null;

    return (
        <div className="min-h-screen bg-[var(--ivory)]">
            <Helmet>
                <title>Compare Watches | Hours</title>
                <meta name="description" content="Compare luxury watches side by side. See prices, conditions, and features at a glance." />
            </Helmet>
            <Header />

            <main className="py-6 md:py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-10">
                        <p className="text-xs text-[var(--gold)] mb-2 uppercase tracking-[0.2em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Side by Side</p>
                        <h1 className="text-2xl md:text-4xl tracking-tight text-foreground mb-2 md:mb-3">
                            Compare Watches
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Compare up to 3 watches side by side to find the perfect timepiece
                        </p>
                    </div>

                    {watches.length === 0 ? (
                        <div className="text-center py-16 md:py-20">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--gold-muted)] flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-[var(--gold)]" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No watches to compare</h3>
                            <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>Add watches from the marketplace to start comparing</p>
                            <Button asChild className="btn-navy rounded-xl px-8 border-0">
                                <Link to="/browse" style={{ fontFamily: 'Inter, sans-serif' }}>Browse Marketplace</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Mobile: stacked cards */}
                            <div className="md:hidden space-y-4">
                                {watches.map(watch => (
                                    <Card key={watch.id} className={`border border-slate-100 shadow-sm rounded-2xl ${watch.id === cheapestId ? 'ring-2 ring-emerald-400' : ''}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    {watch.id === cheapestId && (
                                                        <Badge className="bg-emerald-600 text-white text-xs mb-2 flex items-center gap-1 w-fit">
                                                            <Trophy className="h-3 w-3" /> Best Price
                                                        </Badge>
                                                    )}
                                                    <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{watch.brand} {watch.model}</h3>
                                                    <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Ref: {watch.reference}</p>
                                                </div>
                                                <button onClick={() => removeWatch(watch.id)} className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                                                    <X className="h-4 w-4 text-slate-400" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm">
                                                {COMPARE_ROWS.map(row => {
                                                    const val = watch[row.key];
                                                    const formatted = row.format ? row.format(val) : String(val);
                                                    const isCheapest = row.key === 'price' && watch.id === cheapestId;
                                                    return (
                                                        <React.Fragment key={row.key}>
                                                            <span className="text-muted-foreground text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>{row.label}</span>
                                                            <span className={`text-xs ${isCheapest ? 'font-bold text-emerald-700' : ''}`} style={{ fontFamily: 'Inter, sans-serif' }}>{formatted}</span>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Desktop: table grid */}
                            <div className="hidden md:block">
                                {/* Watch Headers */}
                                <div className="grid gap-4" style={{ gridTemplateColumns: `180px repeat(${watches.length}, 1fr)${watches.length < 3 ? ' 1fr' : ''}` }}>
                                    <div />
                                    {watches.map(watch => (
                                        <Card key={watch.id} className={`border border-slate-100 shadow-sm rounded-2xl overflow-hidden ${watch.id === cheapestId ? 'ring-2 ring-emerald-400' : ''}`}>
                                            <CardContent className="p-5 text-center relative">
                                                <button onClick={() => removeWatch(watch.id)} className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                                                    <X className="h-4 w-4 text-slate-400" />
                                                </button>
                                                {watch.id === cheapestId && (
                                                    <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-xs flex items-center gap-1">
                                                        <Trophy className="h-3 w-3" /> Best Price
                                                    </Badge>
                                                )}
                                                <div className="w-14 h-14 rounded-2xl bg-[var(--gold-muted)] flex items-center justify-center mx-auto mb-3 mt-4">
                                                    <span className="text-xl font-bold text-[var(--gold)]">{watch.brand.charAt(0)}</span>
                                                </div>
                                                <h3 className="font-semibold text-foreground text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{watch.brand}</h3>
                                                <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{watch.model}</p>
                                                <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Ref: {watch.reference}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {watches.length < 3 && (
                                        <div className="border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center min-h-[160px] hover:border-[var(--gold)] transition-colors cursor-pointer group">
                                            <div className="text-center">
                                                <span className="text-2xl text-slate-300 group-hover:text-[var(--gold)] transition-colors">+</span>
                                                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Add Watch</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Comparison Table */}
                                <div className="mt-6 rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm">
                                    {COMPARE_ROWS.map((row, rowIdx) => (
                                        <div
                                            key={row.key}
                                            className={`grid items-center ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                                            style={{ gridTemplateColumns: `180px repeat(${watches.length}, 1fr)${watches.length < 3 ? ' 1fr' : ''}` }}
                                        >
                                            <div className="px-5 py-3.5 text-sm font-medium text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                {row.label}
                                            </div>
                                            {watches.map(watch => {
                                                const val = watch[row.key];
                                                const formatted = row.format ? row.format(val) : String(val);
                                                const isCheapest = row.key === 'price' && watch.id === cheapestId;
                                                return (
                                                    <div key={watch.id} className={`px-5 py-3.5 text-sm text-center ${isCheapest ? 'font-bold text-emerald-700 text-lg' : 'text-muted-foreground'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        {isCheapest && <TrendingDown className="h-4 w-4 text-emerald-500 inline mr-1" />}
                                                        {formatted}
                                                    </div>
                                                );
                                            })}
                                            {watches.length < 3 && <div />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            {cheapestId && (
                                <div className="mt-6 p-4 md:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                                            <Trophy className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                Best Deal: {watches.find(w => w.id === cheapestId)?.brand} {watches.find(w => w.id === cheapestId)?.model}
                                            </p>
                                            <p className="text-xs md:text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                Save up to ${(Math.max(...watches.map(w => w.price)) - Math.min(...watches.map(w => w.price))).toLocaleString()} compared to other options
                                            </p>
                                        </div>
                                    </div>
                                    <Button className="btn-navy rounded-xl px-5 text-sm flex items-center gap-2 shrink-0 border-0">
                                        View Listing <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CompareWatches;
