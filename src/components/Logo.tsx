import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'footer' | 'standalone';
  className?: string;
}

const IconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="60 200 90 120" fill="none" className={className} aria-hidden="true">
    <line x1="81" y1="219" x2="129" y2="294" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
    <line x1="84" y1="260" x2="129" y2="294" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
    <line x1="97" y1="270" x2="120" y2="303" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" opacity="0.95" />
    <line x1="122" y1="225" x2="107" y2="292" stroke="#E11D2A" strokeWidth="12" strokeLinecap="round" />
    <rect x="101" y="286" width="18" height="18" rx="2" fill="#E11D2A" transform="rotate(20 110 295)" />
  </svg>
);

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'standalone',
  className = '',
}) => {
  const sizeClasses: Record<string, { text: string; icon: string; gap: string }> = {
    sm: { text: 'text-xl md:text-2xl', icon: 'w-8 h-8 md:w-9 md:h-9', gap: 'gap-2' },
    md: { text: 'text-2xl md:text-[1.7rem]', icon: 'w-9 h-9 md:w-10 md:h-10', gap: 'gap-2' },
    lg: { text: 'text-3xl md:text-4xl', icon: 'w-10 h-10 md:w-12 md:h-12', gap: 'gap-2.5' },
    xl: { text: 'text-4xl md:text-5xl', icon: 'w-12 h-12 md:w-14 md:h-14', gap: 'gap-3' },
  };

  const s = sizeClasses[size] || sizeClasses.md;

  const logo = (
    <span className={`flex items-center ${s.gap} select-none ${className}`}>
      <IconSvg className={s.icon} />
      <span
        className={`${s.text} font-medium tracking-[0.28em] uppercase text-white`}
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
