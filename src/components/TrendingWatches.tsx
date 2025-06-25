
import React from 'react';
import { ExternalLink, Instagram, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok';
  thumbnail: string;
  caption: string;
  author: string;
  url: string;
  likes?: number;
  views?: number;
}

// Mock data for trending watch posts
const trendingPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    caption: 'Just unboxed this stunning Rolex Submariner! The craftsmanship is absolutely incredible...',
    author: '@watchcollector',
    url: 'https://instagram.com/p/example1',
    likes: 2840
  },
  {
    id: '2',
    platform: 'tiktok',
    thumbnail: 'https://images.unsplash.com/photo-1594576461615-a62a20b9cd87?w=400&h=400&fit=crop',
    caption: 'POV: You finally saved up for your grail watch 🔥 Omega Speedmaster Professional review',
    author: '@watchreview_tiktok',
    url: 'https://tiktok.com/@example2',
    views: 125000
  },
  {
    id: '3',
    platform: 'instagram',
    thumbnail: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop',
    caption: 'Vintage Seiko finds at the local market! Sometimes the best treasures are hiding in plain sight',
    author: '@vintage_timepieces',
    url: 'https://instagram.com/p/example3',
    likes: 1560
  },
  {
    id: '4',
    platform: 'tiktok',
    thumbnail: 'https://images.unsplash.com/photo-1548181080-6d90377cddf9?w=400&h=400&fit=crop',
    caption: 'Watch collecting mistakes I wish I knew before starting my journey. Save your money!',
    author: '@watchnewbie',
    url: 'https://tiktok.com/@example4',
    views: 89400
  },
  {
    id: '5',
    platform: 'instagram',
    thumbnail: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400&h=400&fit=crop',
    caption: 'Tudor Black Bay 58 wrist shot. The perfect daily wear luxury watch that flies under the radar',
    author: '@dailywrist',
    url: 'https://instagram.com/p/example5',
    likes: 3200
  },
  {
    id: '6',
    platform: 'tiktok',
    thumbnail: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop',
    caption: 'How to spot a fake Rolex in 30 seconds! These tips will save you thousands 💰',
    author: '@authenticwatches',
    url: 'https://tiktok.com/@example6',
    views: 456000
  }
];

export const TrendingWatches = () => {
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
    <section className="py-12 md:py-16 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-foreground">
            Trending in Watches
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the latest watch trends, reviews, and collector insights from social media
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 rounded-xl shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={post.thumbnail}
                  alt="Watch post thumbnail"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Platform badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`${
                    post.platform === 'instagram' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-black'
                  } text-white font-medium rounded-full px-3 py-1`}>
                    {post.platform === 'instagram' ? (
                      <Instagram className="h-3 w-3 mr-1" />
                    ) : (
                      <Play className="h-3 w-3 mr-1" />
                    )}
                    {post.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                  </Badge>
                </div>

                {/* Engagement stats */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white border-0 rounded-full px-2 py-1 text-xs">
                    {post.likes ? `${formatNumber(post.likes)} likes` : `${formatNumber(post.views!)} views`}
                  </Badge>
                </div>

                {/* Play button overlay for TikTok */}
                {post.platform === 'tiktok' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-slate-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    {post.author}
                  </p>
                  <p className="text-foreground leading-relaxed">
                    {truncateCaption(post.caption)}
                  </p>
                </div>

                <Button 
                  asChild
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    View Original Post
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Follow the latest watch trends and join the conversation
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="rounded-lg">
              Follow on Instagram
            </Button>
            <Button variant="outline" className="rounded-lg">
              Follow on TikTok
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
