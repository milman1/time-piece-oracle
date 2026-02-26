import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'footer' | 'standalone';
  className?: string;
}

const IconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 120" fill="none" className={className} aria-hidden="true">
    {/* Pivot point at (58, 72) — all hands pass through here */}
    {/* Long hand — upper-left to lower-right, passing through pivot */}
    <line x1="18" y1="8" x2="78" y2="100" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    {/* Second hand — upper-center to lower-left, passing through pivot */}
    <line x1="38" y1="12" x2="68" y2="98" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
    {/* Gold accent hand (seconds) — going up-right from pivot */}
    <line x1="58" y1="72" x2="68" y2="8" stroke="#b8975a" strokeWidth="4.5" strokeLinecap="round" />
    {/* Small gold dot at pivot point */}
    <circle cx="58" cy="72" r="4" fill="#b8975a" />
  </svg>
);

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'standalone',
  className = '',
}) => {
  const sizeClasses: Record<string, { text: string; icon: string; gap: string }> = {
    sm: { text: 'text-xl md:text-2xl', icon: 'w-8 h-8 md:w-9 md:h-9', gap: 'gap-2' },
    md: { text: 'text-2xl md:text-[1.7rem]', icon: 'w-9 h-9 md:w-10 md:h-10', gap: 'gap-2.5' },
    lg: { text: 'text-3xl md:text-4xl', icon: 'w-10 h-10 md:w-12 md:h-12', gap: 'gap-3' },
    xl: { text: 'text-4xl md:text-5xl', icon: 'w-12 h-12 md:w-14 md:h-14', gap: 'gap-3' },
  };

  const s = sizeClasses[size] || sizeClasses.md;

  const logo = (
    <span className={`flex items-center ${s.gap} select-none ${className}`}>
      <IconSvg className={s.icon} />
      <span
        className={`${s.text} font-light tracking-[0.35em] uppercase text-white`}
        style={{ fontFamily: "'Montserrat', 'Inter', Helvetica, Arial, sans-serif" }}
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
