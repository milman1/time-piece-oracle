
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'footer' | 'standalone';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'standalone',
  className = '',
  showText = true 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-auto';
      case 'md':
        return 'h-10 w-auto md:h-12';
      case 'lg':
        return 'h-12 w-auto md:h-14';
      case 'xl':
        return 'h-14 w-auto md:h-16';
      default:
        return 'h-10 w-auto md:h-12';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'header':
        return 'hover:opacity-80 transition-opacity';
      case 'footer':
        return '';
      case 'standalone':
        return '';
      default:
        return '';
    }
  };

  const logoContent = (
    <img 
      src="/lovable-uploads/58d3d69f-fc2b-454f-ae3e-0248ad8c28b5.png" 
      alt="Hours - Luxury Watch Price Comparison" 
      className={`${getSizeClasses()} ${getVariantClasses()} ${className}`}
      loading="lazy"
    />
  );

  if (variant === 'header' || variant === 'footer') {
    return (
      <Link to="/" className="flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
