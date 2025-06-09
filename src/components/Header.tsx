
import React from 'react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-light tracking-wide text-foreground">
            Hours
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Brands
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
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
