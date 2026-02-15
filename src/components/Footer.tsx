import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">About Hours</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The luxury watch meta-marketplace. Aggregating listings from eBay, Chrono24, WatchBox, and vetted independents.
            </p>
            <p className="text-xs text-muted-foreground">
              We may earn a commission when you buy through links on our site.
            </p>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Buyers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors">Search Watches</Link></li>
              <li><Link to="/compare" className="text-muted-foreground hover:text-foreground transition-colors">Compare Prices</Link></li>
              <li><Link to="/price-alert" className="text-muted-foreground hover:text-foreground transition-colors">Price Alerts</Link></li>
              <li><Link to="/trusted-sellers" className="text-muted-foreground hover:text-foreground transition-colors">Trusted Sellers</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/for-sellers" className="text-muted-foreground hover:text-foreground transition-colors">Join Our Network</Link></li>
              <li><Link to="/for-sellers#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/seller-application" className="text-muted-foreground hover:text-foreground transition-colors">Apply Now</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Affiliate Disclosure</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Hours. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Hours aggregates listings from major platforms and vetted independents. We don't hold inventory or process transactions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;