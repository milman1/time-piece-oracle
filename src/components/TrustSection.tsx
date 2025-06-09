
import React from 'react';
import { ShieldCheck, Search, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const TrustSection = () => {
  const features = [
    {
      icon: Search,
      title: 'AI-Powered Matching',
      description: 'Our advanced algorithms match exact watch models across hundreds of marketplaces, ensuring you see every available option.'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Sellers Only',
      description: 'We partner exclusively with reputable dealers and authenticated marketplaces to protect your investment.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Pricing',
      description: 'Live price tracking across all major platforms ensures you never miss a deal or pay more than necessary.'
    },
    {
      icon: Users,
      title: 'Community Trust',
      description: 'Seller ratings and verified reviews from our community of watch enthusiasts help you buy with confidence.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light tracking-tight text-foreground mb-4">
            How Hours Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We use advanced technology and trusted partnerships to make luxury watch buying transparent, secure, and effortless.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Icon className="h-8 w-8 text-slate-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">Trusted by watch enthusiasts worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-lg font-light">Chrono24</div>
            <div className="text-lg font-light">WatchBox</div>
            <div className="text-lg font-light">Crown & Caliber</div>
            <div className="text-lg font-light">Hodinkee Shop</div>
            <div className="text-lg font-light">Bob's Watches</div>
          </div>
        </div>
      </div>
    </section>
  );
};
