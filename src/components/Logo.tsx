
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
  const sizeClasses: Record<string, string> = {
    sm: 'h-8 w-auto md:h-9',
    md: 'h-10 w-auto md:h-12',
    lg: 'h-12 w-auto md:h-14',
    xl: 'h-14 w-auto md:h-16',
  };

  const img = (
    <img
      src="/lovable-uploads/hours-logo.jpg"
      alt="Hours — Luxury Watch Meta-Marketplace"
      className={`${sizeClasses[size] || sizeClasses.md} ${className}`}
      loading="lazy"
    />
  );

  if (variant === 'header') {
    return (
      <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
        {img}
      </Link>
    );
  }

  if (variant === 'footer') {
    return (
      <Link to="/" className="inline-block">
        {img}
      </Link>
    );
  }

  return img;
};
