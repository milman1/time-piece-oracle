
import React, { useState } from 'react';
import { Watch as WatchIcon } from 'lucide-react';

interface WatchImageProps {
  src?: string | null;
  alt: string;
  brand?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { container: 'w-8 h-8', icon: 'h-3 w-3', text: 'text-[10px]', rounded: 'rounded-lg' },
  md: { container: 'w-14 h-14', icon: 'h-5 w-5', text: 'text-lg', rounded: 'rounded-xl' },
  lg: { container: 'w-20 h-20', icon: 'h-8 w-8', text: 'text-2xl', rounded: 'rounded-2xl' },
  xl: { container: 'w-full aspect-square', icon: 'h-16 w-16', text: 'text-4xl', rounded: 'rounded-2xl' },
};

// Brand-specific accent colors for fallback badges
const brandColors: Record<string, string> = {
  'Rolex': '#006039',
  'Omega': '#1a1a2e',
  'Patek Philippe': '#1a3a5c',
  'Audemars Piguet': '#1a1a2e',
  'Tudor': '#8B0000',
  'Cartier': '#8B0000',
  'IWC': '#1a1a2e',
  'Breitling': '#FFD700',
  'Tag Heuer': '#006039',
  'Grand Seiko': '#1a3a5c',
};

const WatchImage: React.FC<WatchImageProps> = ({
  src,
  alt,
  brand = '',
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);
  const s = sizeMap[size];

  const brandInitial = brand.charAt(0).toUpperCase();
  const brandColor = brandColors[brand] || 'var(--gold)';

  // No image or load failed → show branded fallback
  if (!src || hasError) {
    return (
      <div
        className={`${s.container} ${s.rounded} flex items-center justify-center shrink-0 ${className}`}
        style={{ backgroundColor: brandColor + '12' }}
      >
        {brandInitial ? (
          <span className={`${s.text} font-bold`} style={{ color: brandColor }}>
            {brandInitial}
          </span>
        ) : (
          <WatchIcon className={`${s.icon} text-slate-300`} />
        )}
      </div>
    );
  }

  return (
    <div className={`${s.container} ${s.rounded} overflow-hidden bg-slate-50 shrink-0 relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default WatchImage;
