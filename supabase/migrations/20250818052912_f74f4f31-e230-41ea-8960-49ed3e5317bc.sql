-- Enable Row Level Security on social_posts table
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to social posts
-- This makes sense since social posts are meant to be displayed publicly on the website
CREATE POLICY "Public read access for social posts"
  ON public.social_posts
  FOR SELECT
  USING (true);