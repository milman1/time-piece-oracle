
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
    sm: 'h-6 w-auto',
    md: 'h-7 w-auto md:h-8',
    lg: 'h-8 w-auto md:h-9',
    xl: 'h-10 w-auto md:h-12',
  };

  const img = (
    <img
      src="/lovable-uploads/58d3d69f-fc2b-454f-ae3e-0248ad8c28b5.png"
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
