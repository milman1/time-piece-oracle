import React from 'react';
import { ShieldCheck, Search, TrendingUp, Users } from 'lucide-react';

export const TrustSection = () => {
  const features = [
    {
      icon: Search,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms match exact models across hundreds of marketplaces.'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Sellers',
      description: 'Partnered exclusively with reputable dealers and authenticated platforms.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Pricing',
      description: 'Live tracking across all major platforms — never miss a deal.'
    },
    {
      icon: Users,
      title: 'Community Trust',
      description: 'Verified reviews from collectors help you buy with confidence.'
    }
  ];

  return (
    <section className="py-20 md:py-28 px-5 bg-[var(--navy)] relative overflow-hidden grain">
      {/* Ambient orbs */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[var(--gold)] rounded-full blur-[200px] opacity-[0.03]" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-[var(--gold)] rounded-full blur-[180px] opacity-[0.025]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14 md:mb-18">
          <p className="text-[11px] text-[var(--gold)]/80 mb-3 uppercase tracking-[0.25em] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Why Hours</p>
          <h2 className="text-2xl md:text-[2.5rem] leading-tight tracking-tight text-white">
            Built for Serious Collectors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 md:p-7 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500 text-center"
              >
                <div className="mb-5">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.04] group-hover:bg-[var(--gold-subtle)] flex items-center justify-center mx-auto transition-all duration-500">
                    <Icon className="h-5 w-5 text-white/40 group-hover:text-[var(--gold)] transition-colors duration-500" />
                  </div>
                </div>
                <h3 className="text-[15px] font-medium mb-2 text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-[13px] text-white/30 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="divider-gold mx-auto max-w-[200px] mb-8" />
          <p className="text-[11px] text-white/15 uppercase tracking-[0.25em] mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>Trusted by collectors worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Chrono24', 'WatchBox', 'Crown & Caliber', 'Hodinkee', "Bob's Watches"].map(name => (
              <span key={name} className="text-[13px] md:text-sm text-white/15 hover:text-white/30 transition-colors duration-400 tracking-wide cursor-default" style={{ fontFamily: 'Inter, sans-serif' }}>{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
