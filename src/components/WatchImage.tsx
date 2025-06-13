
import React, { useState } from 'react';
import { getWatchImage } from '@/services/imageService';

interface WatchImageProps {
  reference: string;
  brand: string;
  model: string;
  className?: string;
}

export const WatchImage = ({ reference, brand, model, className = '' }: WatchImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const watchImage = getWatchImage(reference);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-slate-300 rounded-full mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-medium">{brand}</p>
          <p className="text-xs text-slate-400">{model}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
        </div>
      )}
      <img
        src={watchImage.url}
        alt={watchImage.alt}
        width={watchImage.width}
        height={watchImage.height}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />
    </div>
  );
};
