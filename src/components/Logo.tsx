import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'footer' | 'standalone';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'standalone',
  className = '',
}) => {
  const sizeClasses: Record<string, { text: string; icon: string }> = {
    sm: { text: 'text-lg md:text-xl', icon: 'w-5 h-5 md:w-6 md:h-6' },
    md: { text: 'text-xl md:text-2xl', icon: 'w-6 h-6 md:w-7 md:h-7' },
    lg: { text: 'text-2xl md:text-3xl', icon: 'w-7 h-7 md:w-8 md:h-8' },
    xl: { text: 'text-3xl md:text-4xl', icon: 'w-8 h-8 md:w-9 md:h-9' },
  };

  const s = sizeClasses[size] || sizeClasses.md;

  const logo = (
    <span className={`flex items-center gap-2 select-none ${className}`}>
      <svg viewBox="0 0 32 32" fill="none" className={s.icon} aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="var(--gold)" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="12" stroke="var(--gold)" strokeWidth="0.5" opacity="0.4" />
        <line x1="16" y1="6" x2="16" y2="16" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="16" x2="22" y2="20" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="16" cy="16" r="1.2" fill="var(--gold)" />
      </svg>
      <span
        className={`${s.text} font-light tracking-[0.15em] uppercase text-white`}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Hours
      </span>
    </span>
  );

  if (variant === 'header') {
    return (
      <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
        {logo}
      </Link>
    );
  }

  if (variant === 'footer') {
    return (
      <Link to="/" className="inline-block">
        {logo}
      </Link>
    );
  }

  return logo;
};
