
-- Create influencers table to store influencer profile information
CREATE TABLE public.influencers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  handle text NOT NULL UNIQUE,
  profile_url text NOT NULL,
  description text NOT NULL,
  image_url text,
  platform text NOT NULL DEFAULT 'instagram',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_influencers_updated_at
  BEFORE UPDATE ON public.influencers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample influencer data
INSERT INTO public.influencers (handle, profile_url, description, image_url, platform) VALUES
('@hodinkee', 'https://instagram.com/hodinkee', 'Editorial reviews and watch journalism', 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=150&h=150&fit=crop&crop=face', 'instagram'),
('@watchanish', 'https://instagram.com/watchanish', 'Luxury watch lifestyle and reviews', 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face', 'instagram'),
('@teddybaldassarre', 'https://instagram.com/teddybaldassarre', 'Watch enthusiast and collector', 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=150&h=150&fit=crop&crop=face', 'instagram'),
('@watchfinder', 'https://youtube.com/watchfinder', 'Premium watch marketplace and reviews', 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=150&h=150&fit=crop&crop=face', 'youtube'),
('@crownandcaliber', 'https://instagram.com/crownandcaliber', 'Pre-owned luxury watch marketplace', 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face', 'instagram');

-- Enable Row Level Security (RLS) - making it publicly readable since this is public influencer data
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to influencers
CREATE POLICY "Public read access for influencers" 
  ON public.influencers 
  FOR SELECT 
  TO public 
  USING (true);
