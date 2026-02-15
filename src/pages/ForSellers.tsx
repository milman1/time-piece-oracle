import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
    ShieldCheck, Star, TrendingUp, ArrowRight, CheckCircle,
    Eye, BarChart3, Zap, Award, Globe
} from 'lucide-react';
import { getSellerTiers, getFeaturedSellers, SellerTier, VettedSeller } from '@/services/sellerService';

const ForSellers = () => {
    const tiers = getSellerTiers();

    const { data: featuredSellers = [] } = useQuery({
        queryKey: ['featuredSellers'],
        queryFn: getFeaturedSellers,
        staleTime: 60_000,
    });

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>For Sellers — Join the Meta-Marketplace | Hours</title>
                <meta name="description" content="Your inventory, next to eBay and Chrono24. Join Hours — the luxury watch meta-marketplace — and reach thousands of buyers actively comparing prices." />
            </Helmet>
            <Header />

            {/* Hero */}
            <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <Badge variant="secondary" className="mb-6 px-3 py-1 text-xs">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Vetted Dealer Network
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-light text-foreground mb-5 leading-tight">
                        Your Listings, Next to eBay & Chrono24
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Hours is a meta-marketplace — we aggregate listings from every major platform. As a vetted dealer, your inventory appears right alongside them. Buyers search once; the best price wins.
                    </p>
                    <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 text-base rounded-xl">
                        <Link to="/seller-application" className="flex items-center gap-2">
                            Apply Now <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 px-4 bg-white border-y">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { value: '50K+', label: 'Monthly Searches', icon: Eye },
                            { value: '10K+', label: 'Active Searches / Day', icon: BarChart3 },
                            { value: '6+', label: 'Platforms Aggregated', icon: Globe },
                            { value: '92%', label: 'Buyer Return Rate', icon: TrendingUp },
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i}>
                                    <Icon className="h-5 w-5 text-slate-400 mx-auto mb-2" />
                                    <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Join */}
            <section className="py-12 px-4 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-light text-foreground text-center mb-10">
                        Why Dealers Join Hours
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Eye, title: 'Aggregated Feed', desc: 'Your inventory appears in the same search results as eBay, Chrono24, and WatchBox — buyers see the best price, period.' },
                            { icon: Zap, title: 'Qualified Buyers', desc: 'Buyers on Hours are actively comparing prices and ready to purchase — no window shoppers.' },
                            { icon: ShieldCheck, title: 'Vetted Badge', desc: 'Stand out with our vetted dealer badge, boosting buyer trust and conversion rates.' },
                            { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track views, clicks, and competitive positioning with real-time analytics.' },
                            { icon: Award, title: 'Featured Placement', desc: 'Premium dealers get homepage spotlight and priority position in all search results.' },
                            { icon: Globe, title: 'Direct Traffic', desc: "Buyers click through to YOUR site. We route traffic out — no transactions on our platform, no commissions." },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <Card key={i} className="border">
                                    <CardContent className="p-6">
                                        <Icon className="h-8 w-8 text-slate-600 mb-4" />
                                        <h3 className="font-medium mb-2">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-12 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-light text-foreground text-center mb-3">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
                        No commissions, no hidden fees. A flat monthly rate to appear in the aggregated feed.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiers.map((tier: SellerTier) => (
                            <Card
                                key={tier.id}
                                className={`relative overflow-hidden ${tier.highlight ? 'ring-2 ring-slate-900 shadow-lg' : 'border'
                                    }`}
                            >
                                {tier.highlight && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
                                )}
                                <CardContent className="p-7">
                                    {tier.highlight && (
                                        <Badge className="mb-4 bg-slate-900 text-white text-xs">Most Popular</Badge>
                                    )}
                                    <h3 className="text-xl font-medium mb-1">{tier.name}</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-semibold">${tier.price}</span>
                                        <span className="text-sm text-muted-foreground">/month</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button asChild className={`w-full rounded-lg py-3 ${tier.highlight ? 'bg-slate-900 hover:bg-slate-800 text-white' : ''}`} variant={tier.highlight ? "default" : "outline"}>
                                        <Link to="/seller-application">Get Started</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Sellers */}
            {featuredSellers.length > 0 && (
                <section className="py-12 px-4 bg-slate-50">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-light text-foreground text-center mb-8">
                            Trusted by Leading Dealers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {featuredSellers.map((seller: VettedSeller) => (
                                <Card key={seller.id} className="border">
                                    <CardContent className="p-5 flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-lg font-semibold text-slate-600 flex-shrink-0">
                                            {seller.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium">{seller.name}</h3>
                                                <Badge variant="secondary" className="text-xs flex items-center gap-0.5 text-emerald-700 bg-emerald-50">
                                                    <ShieldCheck className="h-3 w-3" /> Vetted
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2">{seller.location} · {seller.listingCount} listings</p>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Star className="h-3 w-3 text-yellow-500" />
                                                <span className="font-medium">{seller.rating}</span>
                                                <span className="text-muted-foreground">({seller.reviewCount.toLocaleString()} reviews)</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-12 px-4 bg-slate-900 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-light mb-4">
                        Ready to Join the Meta-Marketplace?
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                        Your listings, aggregated alongside eBay, Chrono24, and WatchBox. Buyers find you when they search for the best price.
                    </p>
                    <Button asChild className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-3 text-lg rounded-xl">
                        <Link to="/seller-application" className="flex items-center gap-2">
                            Apply Now <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ForSellers;
