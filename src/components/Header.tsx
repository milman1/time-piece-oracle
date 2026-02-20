import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/browse', label: 'Search' },
    { to: '/compare', label: 'Compare' },
    { to: '/for-sellers', label: 'For Sellers' },
    { to: '/blog', label: 'Blog' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // On homepage: transparent initially, glass on scroll
  // On other pages: always solid
  const headerBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'glass-dark border-b border-white/[0.04]';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${headerBg}`}>
      <div className="max-w-6xl mx-auto px-5 py-3.5 md:py-4 flex items-center justify-between">
        <Logo size="md" variant="header" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-lg text-[13px] tracking-wide transition-all duration-300 ${isActive(link.to)
                  ? 'text-white bg-white/[0.08]'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/[0.06] rounded-lg h-9 px-3">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline ml-2 text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl shadow-elevated">
                <DropdownMenuItem disabled>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/price-alert">Price Alerts</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} disabled={loading}>
                  <LogOut className="mr-2 h-4 w-4" />Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex text-white/50 hover:text-white hover:bg-white/[0.06] text-[13px] px-3 rounded-lg h-9" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="btn-gold text-[13px] px-4 md:px-5 rounded-lg h-9 border-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-1 text-white/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <nav className="md:hidden glass-dark border-t border-white/[0.04] px-5 py-2 animate-slide-down">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-3 px-3 rounded-lg text-[15px] transition-colors ${isActive(link.to) ? 'text-white bg-white/[0.06]' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link to="/auth" className="block py-3 px-3 rounded-lg text-[15px] text-white/40 hover:text-white/70 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};
