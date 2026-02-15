import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Star, ShieldCheck, Clock, MessageSquare, MapPin, Calendar,
    Package, Award, ThumbsUp
} from 'lucide-react';

const mockSeller = {
    id: 'seller-001',
    name: 'Crown & Caliber',
    avatar: 'C',
    location: 'Atlanta, GA',
    memberSince: '2019',
    verified: true,
    bio: 'Trusted luxury watch dealer specializing in pre-owned Rolex, Omega, and Patek Philippe. Every timepiece undergoes our rigorous 12-point authentication process.',
    stats: {
        totalSales: 1247,
        rating: 4.9,
        reviews: 892,
        responseTime: '< 2 hours',
        activeListings: 34,
    },
    reviews: [
        { id: 1, author: 'Michael R.', rating: 5, text: 'Excellent transaction. Watch was exactly as described, fast shipping.', date: '2026-01-20' },
        { id: 2, author: 'Jennifer L.', rating: 5, text: 'Beautiful Datejust, arrived in perfect condition. Very professional seller.', date: '2026-01-15' },
        { id: 3, author: 'David K.', rating: 4, text: 'Good experience overall. Communication could have been faster but the watch is great.', date: '2025-12-28' },
    ],
    listings: [
        { id: 'l1', brand: 'Rolex', model: 'Datejust 41', reference: '126334', price: 11500, condition: 'Excellent', year: 2023 },
        { id: 'l2', brand: 'Omega', model: 'Seamaster 300M', reference: '210.30.42.20.03.001', price: 4800, condition: 'Very Good', year: 2022 },
        { id: 'l3', brand: 'Tudor', model: 'Pelagos', reference: '25600TN', price: 3900, condition: 'Excellent', year: 2023 },
        { id: 'l4', brand: 'Rolex', model: 'GMT-Master II', reference: '126710BLRO', price: 17500, condition: 'Unworn', year: 2024 },
    ],
};

const SellerProfile = () => {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-[var(--ivory)]">
            <Helmet>
                <title>{mockSeller.name} | Hours Marketplace</title>
                <meta name="description" content={`View ${mockSeller.name}'s profile, ratings, and active watch listings on Hours Marketplace.`} />
            </Helmet>
            <Header />

            <main className="py-10 md:py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Seller Header */}
                    <div className="flex flex-col md:flex-row gap-6 mb-10 animate-fade-in-up">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center text-3xl font-bold text-[var(--navy)] flex-shrink-0">
                            {mockSeller.avatar}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl md:text-3xl font-semibold text-[var(--navy)]">{mockSeller.name}</h1>
                                {mockSeller.verified && (
                                    <Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Verified
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {mockSeller.location}</span>
                                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Member since {mockSeller.memberSince}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{mockSeller.bio}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <Button className="btn-gold rounded-xl px-6 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> Contact Seller
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 animate-fade-in-up-delay-1">
                        <div className="stat-card">
                            <div className="text-2xl font-bold gold-text">{mockSeller.stats.rating}</div>
                            <div className="flex items-center justify-center gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className={`h-3 w-3 ${s <= Math.round(mockSeller.stats.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                                ))}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Rating</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-2xl font-bold text-[var(--navy)]">{mockSeller.stats.totalSales.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground mt-1">Total Sales</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-2xl font-bold text-[var(--navy)]">{mockSeller.stats.reviews}</div>
                            <div className="text-xs text-muted-foreground mt-1">Reviews</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-2xl font-bold text-[var(--navy)]">{mockSeller.stats.responseTime}</div>
                            <div className="text-xs text-muted-foreground mt-1">Avg Response</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-2xl font-bold text-[var(--navy)]">{mockSeller.stats.activeListings}</div>
                            <div className="text-xs text-muted-foreground mt-1">Active Listings</div>
                        </div>
                    </div>

                    {/* Active Listings */}
                    <section className="mb-10 animate-fade-in-up-delay-2">
                        <h2 className="text-xl font-semibold text-[var(--navy)] mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-[var(--gold)]" /> Active Listings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockSeller.listings.map(listing => (
                                <Card key={listing.id} className="glass-card border-0 group cursor-pointer">
                                    <CardContent className="p-5 flex gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center flex-shrink-0 border">
                                            <span className="text-lg font-bold text-slate-300">{listing.brand.charAt(0)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[var(--navy)] text-sm">{listing.brand} {listing.model}</h3>
                                            <p className="text-xs text-muted-foreground">Ref: {listing.reference} • {listing.year}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-bold gold-text">${listing.price.toLocaleString()}</span>
                                                <Badge variant="outline" className="text-xs">{listing.condition}</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Reviews */}
                    <section className="animate-fade-in-up-delay-3">
                        <h2 className="text-xl font-semibold text-[var(--navy)] mb-4 flex items-center gap-2">
                            <ThumbsUp className="h-5 w-5 text-[var(--gold)]" /> Reviews
                        </h2>
                        <div className="space-y-4">
                            {mockSeller.reviews.map(review => (
                                <Card key={review.id} className="glass-card border-0">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-[var(--champagne)] flex items-center justify-center text-xs font-medium text-[var(--navy)]">
                                                    {review.author.charAt(0)}
                                                </div>
                                                <span className="font-medium text-sm text-[var(--navy)]">{review.author}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{review.text}</p>
                                        <p className="text-xs text-muted-foreground mt-2">{new Date(review.date).toLocaleDateString()}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SellerProfile;
