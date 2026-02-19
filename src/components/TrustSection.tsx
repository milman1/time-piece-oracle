
import React from 'react';
import { ShieldCheck, Search, TrendingUp, Users } from 'lucide-react';

export const TrustSection = () => {
  const features = [
    {
      icon: Search,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms match exact watch models across hundreds of marketplaces, ensuring you see every available option.'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Sellers Only',
      description: 'We partner exclusively with reputable dealers and authenticated marketplaces to protect your investment.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Pricing',
      description: 'Live price tracking across all major platforms ensures you never miss a deal or overpay.'
    },
    {
      icon: Users,
      title: 'Community Trust',
      description: 'Seller ratings and verified reviews from our community of watch enthusiasts help you buy with confidence.'
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-[var(--navy)] relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--gold)] rounded-full blur-[180px] opacity-5" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--gold)] rounded-full blur-[180px] opacity-5" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl tracking-tight text-white mb-4">
            Why Collectors Choose Hours
          </h2>
          <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Technology and trust, designed for serious watch buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glass-card-dark rounded-2xl p-6 md:p-8 text-center premium-card group">
                <div className="mb-5">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-[var(--gold-muted)] transition-colors duration-500">
                    <Icon className="h-6 w-6 text-[var(--gold)]" />
                  </div>
                </div>
                <h3 className="text-base font-medium mb-2 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-white/35 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Platform logos */}
        <div className="mt-14 md:mt-16 text-center">
          <div className="divider-gold mx-auto max-w-xs mb-8" />
          <p className="text-xs text-white/20 mb-6 uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>Trusted by watch enthusiasts worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {['Chrono24', 'WatchBox', 'Crown & Caliber', 'Hodinkee', "Bob's Watches"].map(name => (
              <span key={name} className="text-sm md:text-base text-white/20 tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
