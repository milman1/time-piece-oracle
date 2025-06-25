
-- Create social_posts table for storing trending watch content from social media
CREATE TABLE public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
  thumbnail TEXT NOT NULL,
  caption TEXT NOT NULL,
  author TEXT NOT NULL,
  url TEXT NOT NULL,
  likes INTEGER,
  views INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON public.social_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data to populate the table with trending watch posts
INSERT INTO public.social_posts (platform, thumbnail, caption, author, url, likes, views) VALUES
('instagram', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 'Just unboxed this stunning Rolex Submariner! The craftsmanship is absolutely incredible...', '@watchcollector', 'https://instagram.com/p/example1', 2840, NULL),
('tiktok', 'https://images.unsplash.com/photo-1594576461615-a62a20b9cd87?w=400&h=400&fit=crop', 'POV: You finally saved up for your grail watch 🔥 Omega Speedmaster Professional review', '@watchreview_tiktok', 'https://tiktok.com/@example2', NULL, 125000),
('instagram', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop', 'Vintage Seiko finds at the local market! Sometimes the best treasures are hiding in plain sight', '@vintage_timepieces', 'https://instagram.com/p/example3', 1560, NULL),
('tiktok', 'https://images.unsplash.com/photo-1548181080-6d90377cddf9?w=400&h=400&fit=crop', 'Watch collecting mistakes I wish I known before starting my journey. Save your money!', '@watchnewbie', 'https://tiktok.com/@example4', NULL, 89400),
('instagram', 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400&h=400&fit=crop', 'Tudor Black Bay 58 wrist shot. The perfect daily wear luxury watch that flies under the radar', '@dailywrist', 'https://instagram.com/p/example5', 3200, NULL),
('tiktok', 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop', 'How to spot a fake Rolex in 30 seconds! These tips will save you thousands 💰', '@authenticwatches', 'https://tiktok.com/@example6', NULL, 456000);
