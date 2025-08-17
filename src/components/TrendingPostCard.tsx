import React from 'react';
import { ExternalLink, Instagram, Play, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InfluencerAvatar } from '@/components/InfluencerAvatar';
import { EnrichedSocialPost } from '@/hooks/useTrendingPosts';

interface TrendingPostCardProps {
  post: EnrichedSocialPost;
}

export const TrendingPostCard = ({ post }: TrendingPostCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const truncateCaption = (caption: string, maxLength: number = 120) => {
    return caption.length > maxLength ? caption.substring(0, maxLength) + '...' : caption;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={post.thumbnail}
          alt="Watch post thumbnail"
          className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Platform badge */}
        <div className="absolute top-2 md:top-3 left-2 md:left-3">
          <Badge className={`${
            post.platform === 'instagram' 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
              : 'bg-black'
          } text-white font-medium rounded-full px-2 md:px-3 py-1 text-xs`}>
            {post.platform === 'instagram' ? (
              <Instagram className="h-2 w-2 md:h-3 md:w-3 mr-1" />
            ) : (
              <Play className="h-2 w-2 md:h-3 md:w-3 mr-1" />
            )}
            <span className="hidden sm:inline">
              {post.platform === 'instagram' ? 'Instagram' : 'TikTok'}
            </span>
          </Badge>
        </div>

        {/* Engagement stats */}
        <div className="absolute top-2 md:top-3 right-2 md:right-3">
          <Badge variant="secondary" className="bg-black/70 text-white border-0 rounded-full px-2 py-1 text-xs">
            {post.likes ? `${formatNumber(post.likes)}` : `${formatNumber(post.views!)}`}
            <span className="hidden sm:inline ml-1">
              {post.likes ? 'likes' : 'views'}
            </span>
          </Badge>
        </div>

        {/* Play button overlay for TikTok */}
        {post.platform === 'tiktok' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="h-6 w-6 md:h-8 md:w-8 text-slate-900 ml-1" fill="currentColor" />
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4 md:p-6">
        {/* Influencer Profile Section */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <InfluencerAvatar 
              imageUrl={post.influencer?.image_url} 
              handle={post.author}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {post.author}
              </p>
              {post.influencer?.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {post.influencer.description}
                </p>
              )}
            </div>
          </div>
          
          <p className="text-sm md:text-base text-foreground leading-relaxed line-clamp-3">
            {truncateCaption(post.caption, 80)}
          </p>
        </div>

        <div className="space-y-2">
          <Button 
            asChild
            size="sm"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-xs md:text-sm"
          >
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <span className="hidden sm:inline">View Original Post</span>
              <span className="sm:hidden">View</span>
              <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
            </a>
          </Button>

          {/* View Profile Button */}
          {post.influencer?.profile_url && (
            <Button 
              asChild
              variant="outline"
              size="sm"
              className="w-full rounded-lg text-xs md:text-sm"
            >
              <a 
                href={post.influencer.profile_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <User className="h-3 w-3 md:h-4 md:w-4" />
                <span>View Profile</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};