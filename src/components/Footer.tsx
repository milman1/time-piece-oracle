import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

const Footer = () => {
  return (
    <footer className="bg-[var(--navy)] relative grain">
      <div className="divider-gold" />
      <div className="max-w-5xl mx-auto px-5 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size="sm" variant="footer" />
            </div>
            <p className="text-[13px] text-white/25 mb-3 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              The luxury watch meta-marketplace.
            </p>
            <p className="text-[11px] text-white/12" style={{ fontFamily: 'Inter, sans-serif' }}>
              We may earn a commission when you buy through links on our site.
            </p>
          </div>

          {[
            {
              title: 'For Buyers',
              links: [
                { to: '/browse', label: 'Search' },
                { to: '/compare', label: 'Compare' },
                { to: '/price-alert', label: 'Alerts' },
              ]
            },
            {
              title: 'For Sellers',
              links: [
                { to: '/for-sellers', label: 'Join Network' },
                { to: '/for-sellers#pricing', label: 'Pricing' },
                { to: '/seller-application', label: 'Apply' },
              ]
            },
            {
              title: 'Company',
              links: [
                { to: '/blog', label: 'Blog' },
                { to: '#', label: 'Privacy' },
                { to: '#', label: 'Terms' },
              ]
            },
          ].map(section => (
            <div key={section.title}>
              <h3 className="text-[11px] font-semibold text-white/40 mb-4 uppercase tracking-[0.2em]" style={{ fontFamily: 'Inter, sans-serif' }}>{section.title}</h3>
              <ul className="space-y-2.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[13px] text-white/25 hover:text-[var(--gold)] transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider-gold mt-10 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-white/15" style={{ fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} Hours. All rights reserved.
          </p>
          <p className="text-[11px] text-white/10 text-center md:text-right" style={{ fontFamily: 'Inter, sans-serif' }}>
            Aggregated listings — no inventory held, no transactions processed.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;