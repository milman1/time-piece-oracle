import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

const Footer = () => {
  return (
    <footer className="bg-[var(--navy)] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size="sm" variant="footer" />
            </div>
            <p className="text-sm text-white/30 mb-3 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              The luxury watch meta-marketplace. Aggregating listings from every major platform.
            </p>
            <p className="text-xs text-white/15" style={{ fontFamily: 'Inter, sans-serif' }}>
              We may earn a commission when you buy through links on our site.
            </p>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>For Buyers</h3>
            <ul className="space-y-2.5 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li><Link to="/browse" className="text-white/30 hover:text-[var(--gold)] transition-colors">Search Watches</Link></li>
              <li><Link to="/compare" className="text-white/30 hover:text-[var(--gold)] transition-colors">Compare Prices</Link></li>
              <li><Link to="/price-alert" className="text-white/30 hover:text-[var(--gold)] transition-colors">Price Alerts</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>For Sellers</h3>
            <ul className="space-y-2.5 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li><Link to="/for-sellers" className="text-white/30 hover:text-[var(--gold)] transition-colors">Join Network</Link></li>
              <li><Link to="/for-sellers#pricing" className="text-white/30 hover:text-[var(--gold)] transition-colors">Pricing</Link></li>
              <li><Link to="/seller-application" className="text-white/30 hover:text-[var(--gold)] transition-colors">Apply Now</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Company</h3>
            <ul className="space-y-2.5 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li><Link to="/blog" className="text-white/30 hover:text-[var(--gold)] transition-colors">Blog</Link></li>
              <li><a href="#" className="text-white/30 hover:text-[var(--gold)] transition-colors">Privacy</a></li>
              <li><a href="#" className="text-white/30 hover:text-[var(--gold)] transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="divider-gold mt-10 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/20" style={{ fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} Hours. All rights reserved.
          </p>
          <p className="text-xs text-white/15 text-center md:text-right" style={{ fontFamily: 'Inter, sans-serif' }}>
            We aggregate listings — we don't hold inventory or process transactions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;