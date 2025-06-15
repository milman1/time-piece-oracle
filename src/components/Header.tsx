
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Logo size="md" variant="header" />
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

        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" className="text-muted-foreground text-sm md:text-base px-2 md:px-4">
            Sign In
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white text-sm md:text-base px-3 md:px-4">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
