import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        <div className="min-h-screen bg-[var(--warm-white)]">
            <Helmet>
                <title>Compare Watches | Hours</title>
                <meta name="description" content="Compare luxury watches side by side. See prices, conditions, and features at a glance." />
            </Helmet>
            <Header />

            <main className="pt-20 md:pt-24 pb-10 md:pb-16 px-5">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-10">
                        <p className="text-[11px] text-[var(--gold)] mb-2 uppercase tracking-[0.25em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Side by Side</p>
                        <h1 className="text-[1.6rem] md:text-[2.25rem] tracking-tight text-foreground mb-2">
                            Compare Watches
                        </h1>
                        <p className="text-[13px] md:text-[14px] text-muted-foreground max-w-md mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Compare up to 3 watches side by side to find the perfect timepiece
                        </p>
                    </div>

                    {watches.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--gold-subtle)] flex items-center justify-center mx-auto mb-4">
                                <Search className="h-6 w-6 text-[var(--gold)]" />
                            </div>
                            <h3 className="text-[17px] font-semibold mb-2">No watches to compare</h3>
                            <p className="text-[14px] text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>Add watches from the marketplace to start comparing</p>
                            <Button asChild className="btn-navy rounded-xl px-6 text-[13px] h-10 border-0">
                                <Link to="/browse" style={{ fontFamily: 'Inter, sans-serif' }}>Browse Marketplace</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Mobile: stacked cards */}
                            <div className="md:hidden space-y-3">
                                {watches.map(watch => (
                                    <div key={watch.id} className={`bg-white rounded-2xl shadow-soft border transition-all duration-300 ${watch.id === cheapestId ? 'ring-2 ring-emerald-400/60 border-emerald-200/40' : 'border-slate-100/60'}`}>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    {watch.id === cheapestId && (
                                                        <Badge className="bg-emerald-600 text-white text-[11px] mb-2 flex items-center gap-1 w-fit font-medium">
                                                            <Trophy className="h-3 w-3" /> Best Price
                                                        </Badge>
                                                    )}
                                                    <h3 className="font-semibold text-[15px] text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{watch.brand} {watch.model}</h3>
                                                    <p className="text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Ref: {watch.reference}</p>
                                                </div>
                                                <button onClick={() => removeWatch(watch.id)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                                    <X className="h-4 w-4 text-slate-400" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[13px]">
                                                {COMPARE_ROWS.map(row => {
                                                    const val = watch[row.key];
                                                    const formatted = row.format ? row.format(val) : String(val);
                                                    const isCheapest = row.key === 'price' && watch.id === cheapestId;
                                                    return (
                                                        <React.Fragment key={row.key}>
                                                            <span className="text-muted-foreground text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>{row.label}</span>
                                                            <span className={`text-[12px] ${isCheapest ? 'font-bold text-emerald-700' : ''}`} style={{ fontFamily: 'Inter, sans-serif' }}>{formatted}</span>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop: table grid */}
                            <div className="hidden md:block">
                                <div className="grid gap-4" style={{ gridTemplateColumns: `160px repeat(${watches.length}, 1fr)${watches.length < 3 ? ' 1fr' : ''}` }}>
                                    <div />
                                    {watches.map(watch => (
                                        <div key={watch.id} className={`bg-white rounded-2xl shadow-soft border overflow-hidden transition-all duration-300 ${watch.id === cheapestId ? 'ring-2 ring-emerald-400/60 border-emerald-200/40' : 'border-slate-100/60'}`}>
                                            <div className="p-5 text-center relative">
                                                <button onClick={() => removeWatch(watch.id)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                                                    <X className="h-3.5 w-3.5 text-slate-400" />
                                                </button>
                                                {watch.id === cheapestId && (
                                                    <Badge className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] flex items-center gap-1 font-medium">
                                                        <Trophy className="h-3 w-3" /> Best
                                                    </Badge>
                                                )}
                                                <div className="w-12 h-12 rounded-xl bg-[var(--gold-subtle)] flex items-center justify-center mx-auto mb-3 mt-3">
                                                    <span className="text-lg font-bold text-[var(--gold)]">{watch.brand.charAt(0)}</span>
                                                </div>
                                                <h3 className="font-semibold text-[14px] text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{watch.brand}</h3>
                                                <p className="text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{watch.model}</p>
                                                <p className="text-[11px] text-muted-foreground/60" style={{ fontFamily: 'Inter, sans-serif' }}>Ref: {watch.reference}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {watches.length < 3 && (
                                        <div className="border-2 border-dashed border-slate-200/80 rounded-2xl flex items-center justify-center min-h-[160px] hover:border-[var(--gold)]/40 transition-all duration-400 cursor-pointer group">
                                            <div className="text-center">
                                                <span className="text-2xl text-slate-300 group-hover:text-[var(--gold)] transition-colors duration-400">+</span>
                                                <p className="text-[12px] text-muted-foreground mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Add Watch</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Comparison Table */}
                                <div className="mt-5 rounded-2xl overflow-hidden bg-white shadow-soft border border-slate-100/60">
                                    {COMPARE_ROWS.map((row, rowIdx) => (
                                        <div
                                            key={row.key}
                                            className={`grid items-center ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-[var(--warm-50)]/40'} ${rowIdx < COMPARE_ROWS.length - 1 ? 'border-b border-slate-100/40' : ''}`}
                                            style={{ gridTemplateColumns: `160px repeat(${watches.length}, 1fr)${watches.length < 3 ? ' 1fr' : ''}` }}
                                        >
                                            <div className="px-5 py-3.5 text-[13px] font-medium text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                {row.label}
                                            </div>
                                            {watches.map(watch => {
                                                const val = watch[row.key];
                                                const formatted = row.format ? row.format(val) : String(val);
                                                const isCheapest = row.key === 'price' && watch.id === cheapestId;
                                                return (
                                                    <div key={watch.id} className={`px-5 py-3.5 text-[13px] text-center ${isCheapest ? 'font-bold text-emerald-700 text-base' : 'text-muted-foreground'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        {isCheapest && <TrendingDown className="h-3.5 w-3.5 text-emerald-500 inline mr-1" />}
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
                                <div className="mt-5 p-4 md:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                                            <Trophy className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[14px] text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                Best Deal: {watches.find(w => w.id === cheapestId)?.brand} {watches.find(w => w.id === cheapestId)?.model}
                                            </p>
                                            <p className="text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                Save up to ${(Math.max(...watches.map(w => w.price)) - Math.min(...watches.map(w => w.price))).toLocaleString()} compared to other options
                                            </p>
                                        </div>
                                    </div>
                                    <Button className="btn-navy rounded-xl px-5 text-[13px] flex items-center gap-2 shrink-0 h-9 border-0">
                                        View Listing <ArrowRight className="h-3.5 w-3.5" />
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
