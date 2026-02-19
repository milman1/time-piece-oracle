
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/browse', label: 'Search' },
    { to: '/compare', label: 'Compare' },
    { to: '/for-sellers', label: 'For Sellers' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <header className="bg-[var(--navy)]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Logo size="md" variant="header" />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-sm text-white/60 hover:text-white transition-colors tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white/70 hover:text-white hover:bg-white/10">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/price-alert" className="flex items-center">
                    Price Alerts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} disabled={loading}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-white/60 hover:text-white hover:bg-white/10 text-sm px-3 hidden sm:inline-flex" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="btn-gold text-sm px-4 md:px-5 rounded-lg border-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2 text-white/70"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-white/5 bg-[var(--navy-light)] px-4 py-3 space-y-1 animate-fade-up">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-3 text-white/50 hover:text-white/80 hover:bg-white/5 rounded-lg text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};
