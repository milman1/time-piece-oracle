import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

interface Influencer {
  id: string;
  handle: string;
  profile_url: string;
  description: string;
  image_url?: string | null;
  platform: string;
}

export interface EnrichedSocialPost extends SocialPost {
  influencer?: Influencer;
}

export const useTrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState<EnrichedSocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        // Fetch social posts
        const { data: postsData, error: postsError } = await supabase
          .from('social_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (postsError) {
          console.error('Error fetching social posts:', postsError);
          return;
        }

        // Fetch influencers
        const { data: influencersData, error: influencersError } = await supabase
          .from('influencers')
          .select('*');

        if (influencersError) {
          console.error('Error fetching influencers:', influencersError);
        }

        // Transform and enrich data
        const transformedData: EnrichedSocialPost[] = (postsData || []).map(post => {
          const matchingInfluencer = influencersData?.find(
            influencer => influencer.handle === post.author
          );

          return {
            id: post.id,
            platform: post.platform as 'instagram' | 'tiktok',
            thumbnail: post.thumbnail,
            caption: post.caption,
            author: post.author,
            url: post.url,
            likes: post.likes,
            views: post.views,
            influencer: matchingInfluencer || undefined,
          };
        });

        setTrendingPosts(transformedData);
      } catch (error) {
        console.error('Error fetching social posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  return { trendingPosts, loading };
};