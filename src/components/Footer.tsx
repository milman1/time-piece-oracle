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
              Compare prices from the world's most trusted watch dealers and marketplaces.
            </p>
            <p className="text-xs text-muted-foreground">
              We may earn a commission when you buy through links on our site.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/price-alert" className="text-muted-foreground hover:text-foreground transition-colors">Price Alerts</Link></li>
              <li><Link to="/trusted-sellers" className="text-muted-foreground hover:text-foreground transition-colors">Trusted Sellers</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Popular Brands</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">Rolex</span></li>
              <li><span className="text-muted-foreground">Omega</span></li>
              <li><span className="text-muted-foreground">Patek Philippe</span></li>
              <li><span className="text-muted-foreground">Audemars Piguet</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>help@hours.com</p>
              <p>Follow market trends and get the best deals</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 Hours. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Affiliate Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;