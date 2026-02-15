import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
    CheckCircle, ArrowRight, ShieldCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SELLER_TIERS } from '@/services/sellerService';

const BRAND_OPTIONS = [
    'Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Tudor',
    'IWC', 'Cartier', 'Breitling', 'Panerai', 'Hublot', 'TAG Heuer',
    'Vacheron Constantin', 'Grand Seiko', 'Other'
];

const SellerApplication = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const [form, setForm] = useState({
        businessName: '',
        contactName: '',
        email: '',
        website: '',
        inventorySize: '',
        yearsInBusiness: 0,
        tier: 'premium',
        message: '',
    });

    const updateForm = (updates: Partial<typeof form>) => setForm(prev => ({ ...prev, ...updates }));

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.businessName || !form.email || !form.website) {
            toast({ title: 'Please fill in required fields', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);
        try {
            // Insert into Supabase seller_applications table
            const { error } = await supabase.from('seller_applications').insert({
                business_name: form.businessName,
                contact_name: form.contactName,
                email: form.email,
                website: form.website,
                marketplaces: selectedBrands.join(', ') || null,
                monthly_listings: form.inventorySize || null,
                notes: [
                    form.yearsInBusiness ? `Years in business: ${form.yearsInBusiness}` : '',
                    form.tier ? `Preferred tier: ${form.tier}` : '',
                    form.message || '',
                ].filter(Boolean).join('\n') || null,
            });

            if (error) throw error;

            setSubmitted(true);
            toast({ title: 'Application Submitted!', description: 'We\'ll review and respond within 2 business days.' });
        } catch (err) {
            console.error('Error submitting seller application:', err);
            toast({ title: 'Error', description: 'Failed to submit. Please try again.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center py-32 px-4">
                    <Card className="max-w-md text-center">
                        <CardContent className="p-10">
                            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-medium mb-3">Application Received!</h2>
                            <p className="text-muted-foreground mb-6">
                                Our team will review your application and get back to you within 2 business days.
                            </p>
                            <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-8">
                                <a href="/">Back to Home</a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Seller Application | Hours</title>
                <meta name="description" content="Apply to join the Hours verified seller network. Reach thousands of luxury watch buyers." />
            </Helmet>
            <Header />

            <main className="py-10 md:py-16 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs">
                            <ShieldCheck className="h-3 w-3 mr-1" /> Verified Seller Network
                        </Badge>
                        <h1 className="text-3xl font-light text-foreground mb-3">
                            Apply to Join Hours
                        </h1>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            Tell us about your business and we'll get you set up in no time.
                        </p>
                    </div>

                    <Card className="shadow-sm">
                        <CardContent className="p-6 md:p-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Business Name *</label>
                                    <Input
                                        value={form.businessName}
                                        onChange={(e) => updateForm({ businessName: e.target.value })}
                                        placeholder="e.g. Crown & Caliber"
                                        className="py-3"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Contact Name *</label>
                                        <Input
                                            value={form.contactName}
                                            onChange={(e) => updateForm({ contactName: e.target.value })}
                                            placeholder="Your name"
                                            className="py-3"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email *</label>
                                        <Input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => updateForm({ email: e.target.value })}
                                            placeholder="you@company.com"
                                            className="py-3"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Website *</label>
                                    <Input
                                        value={form.website}
                                        onChange={(e) => updateForm({ website: e.target.value })}
                                        placeholder="https://yourstore.com"
                                        className="py-3"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Inventory Size</label>
                                        <select
                                            value={form.inventorySize}
                                            onChange={(e) => updateForm({ inventorySize: e.target.value })}
                                            className="w-full border rounded-lg py-3 px-3 text-sm bg-white"
                                        >
                                            <option value="">Select...</option>
                                            <option value="<50">&lt;50 watches</option>
                                            <option value="50-200">50-200 watches</option>
                                            <option value="200+">200+ watches</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Years in Business</label>
                                        <Input
                                            type="number"
                                            value={form.yearsInBusiness || ''}
                                            onChange={(e) => updateForm({ yearsInBusiness: parseInt(e.target.value) || 0 })}
                                            placeholder="e.g. 5"
                                            className="py-3"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3">Brands Carried</label>
                                    <div className="flex flex-wrap gap-2">
                                        {BRAND_OPTIONS.map(brand => (
                                            <button
                                                key={brand}
                                                type="button"
                                                onClick={() => toggleBrand(brand)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${selectedBrands.includes(brand)
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : 'bg-white border-slate-200 hover:border-slate-400 text-muted-foreground'
                                                    }`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3">Preferred Tier</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {SELLER_TIERS.map(tier => (
                                            <button
                                                key={tier.id}
                                                type="button"
                                                onClick={() => updateForm({ tier: tier.id })}
                                                className={`p-4 rounded-lg text-center transition-all border ${form.tier === tier.id
                                                    ? 'border-slate-900 shadow-md bg-slate-50'
                                                    : 'bg-white border-slate-200 hover:border-slate-400'
                                                    }`}
                                            >
                                                <div className="text-sm font-medium">{tier.name}</div>
                                                <div className="text-lg font-semibold">${tier.price}<span className="text-xs text-muted-foreground">/mo</span></div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                                    <textarea
                                        value={form.message}
                                        onChange={(e) => updateForm({ message: e.target.value })}
                                        rows={3}
                                        placeholder="Tell us anything else about your business..."
                                        className="w-full border rounded-lg p-4 text-sm resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-slate-900 hover:bg-slate-800 text-white w-full rounded-lg py-3 text-base flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SellerApplication;
