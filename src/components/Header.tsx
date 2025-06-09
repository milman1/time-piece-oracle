
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-light tracking-wide text-foreground hover:text-muted-foreground transition-colors">
            Hours
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/price-alert" className="text-muted-foreground hover:text-foreground transition-colors">
            Price Alerts
          </Link>
          <Link to="/trusted-sellers" className="text-muted-foreground hover:text-foreground transition-colors">
            Trusted Sellers
          </Link>
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-muted-foreground">
            Sign In
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
