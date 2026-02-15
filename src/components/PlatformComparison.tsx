import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trophy, TrendingDown, ShieldCheck, Star } from 'lucide-react';

interface PlatformPrice {
    platform: string;
    price: number;
    condition: string;
    seller: string;
    rating: number;
    url: string;
    trusted: boolean;
}

interface PlatformComparisonProps {
    watchName: string;
    prices: PlatformPrice[];
}

const defaultPrices: PlatformPrice[] = [
    { platform: 'Chrono24', price: 13200, condition: 'Excellent', seller: 'WatchMaster DE', rating: 4.9, url: '#', trusted: true },
    { platform: 'WatchBox', price: 13500, condition: 'Very Good', seller: 'WatchBox Official', rating: 4.8, url: '#', trusted: true },
    { platform: 'eBay', price: 12800, condition: 'Excellent', seller: 'LuxTimeNY', rating: 4.7, url: '#', trusted: true },
    { platform: "Bob's Watches", price: 13750, condition: 'Excellent', seller: "Bob's Watches", rating: 4.9, url: '#', trusted: true },
    { platform: 'Crown & Caliber', price: 13400, condition: 'Very Good', seller: 'Crown & Caliber', rating: 4.8, url: '#', trusted: true },
    { platform: 'Hodinkee', price: 14200, condition: 'New', seller: 'Hodinkee Shop', rating: 4.9, url: '#', trusted: true },
];

export const PlatformComparison = ({
    watchName = 'Rolex Submariner 126610LN',
    prices = defaultPrices
}: Partial<PlatformComparisonProps>) => {
    const sorted = [...prices].sort((a, b) => a.price - b.price);
    const cheapest = sorted[0]?.price || 0;
    const mostExpensive = sorted[sorted.length - 1]?.price || 0;
    const savings = mostExpensive - cheapest;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-foreground">
                        Price Comparison Across Platforms
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {watchName} — {sorted.length} platforms compared
                    </p>
                </div>
                {savings > 0 && (
                    <Badge variant="secondary" className="text-sm px-3 py-1 flex items-center gap-1 text-emerald-700 bg-emerald-50">
                        <TrendingDown className="h-3.5 w-3.5" />
                        Save up to ${savings.toLocaleString()}
                    </Badge>
                )}
            </div>

            <div className="space-y-3">
                {sorted.map((item, idx) => {
                    const isCheapest = idx === 0;
                    const priceDiff = item.price - cheapest;
                    const barWidth = cheapest > 0 ? (item.price / mostExpensive) * 100 : 50;

                    return (
                        <Card
                            key={item.platform}
                            className={`overflow-hidden transition-all hover:shadow-md ${isCheapest ? 'ring-2 ring-emerald-400 shadow-md' : ''}`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Platform Name */}
                                    <div className="w-32 md:w-40 flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            {isCheapest && <Trophy className="h-4 w-4 text-emerald-600" />}
                                            <span className="font-medium text-sm">{item.platform}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            {item.trusted && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                                            <Star className="h-3 w-3 text-yellow-500" />
                                            <span className="text-xs text-muted-foreground">{item.rating}</span>
                                        </div>
                                    </div>

                                    {/* Price Bar */}
                                    <div className="flex-1">
                                        <div className="relative h-8 bg-slate-50 rounded-lg overflow-hidden">
                                            <div
                                                className={`absolute left-0 top-0 h-full rounded-lg transition-all duration-500 ${isCheapest ? 'bg-emerald-200' : 'bg-slate-200'}`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                            <div className="absolute inset-0 flex items-center px-3">
                                                <span className={`text-sm font-bold ${isCheapest ? 'text-emerald-800' : 'text-slate-600'}`}>
                                                    ${item.price.toLocaleString()}
                                                </span>
                                                {priceDiff > 0 && (
                                                    <span className="text-xs text-slate-400 ml-2">
                                                        +${priceDiff.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Condition & CTA */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <Badge variant="outline" className="text-xs hidden md:inline-flex">
                                            {item.condition}
                                        </Badge>
                                        <Button
                                            size="sm"
                                            variant={isCheapest ? "default" : "outline"}
                                            className="rounded-lg text-xs px-3"
                                        >
                                            View <ExternalLink className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
