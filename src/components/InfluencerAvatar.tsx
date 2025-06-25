
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface InfluencerAvatarProps {
  imageUrl?: string | null;
  handle: string;
  size?: 'sm' | 'md' | 'lg';
}

export const InfluencerAvatar = ({ imageUrl, handle, size = 'md' }: InfluencerAvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getInitials = (handle: string) => {
    // Remove @ if present and get first two characters
    const cleanHandle = handle.replace('@', '');
    return cleanHandle.substring(0, 2).toUpperCase();
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage 
        src={imageUrl || undefined} 
        alt={`${handle} profile`}
        className="object-cover"
      />
      <AvatarFallback className={`bg-slate-100 text-slate-600 font-medium ${textSizeClasses[size]}`}>
        {getInitials(handle)}
      </AvatarFallback>
    </Avatar>
  );
};
