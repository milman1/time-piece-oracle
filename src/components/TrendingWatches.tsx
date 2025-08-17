import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingPostCard } from '@/components/TrendingPostCard';
import { useTrendingPosts } from '@/hooks/useTrendingPosts';

export const TrendingWatches = () => {
  const { trendingPosts, loading } = useTrendingPosts();

  if (loading) {
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
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading trending posts...</p>
          </div>
        </div>
      </section>
    );
  }

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

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {trendingPosts.map((post) => (
            <TrendingPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Follow the latest watch trends and join the conversation
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
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
