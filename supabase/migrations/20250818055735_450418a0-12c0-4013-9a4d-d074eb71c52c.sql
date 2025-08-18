-- Create sellers table
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  trust_score NUMERIC(3,2) DEFAULT 0,
  commission_rate NUMERIC(5,4) DEFAULT 0,
  affiliate_base_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate_clicks table
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  watch_id INTEGER REFERENCES public.watches(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Public read access for sellers
CREATE POLICY "Public read access for sellers"
ON public.sellers
FOR SELECT
USING (true);

-- Public read access for affiliate clicks (for analytics)
CREATE POLICY "Public read access for affiliate clicks"
ON public.affiliate_clicks
FOR SELECT
USING (true);

-- Authenticated users can insert affiliate clicks
CREATE POLICY "Anyone can create affiliate clicks"
ON public.affiliate_clicks
FOR INSERT
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_watch_id ON public.affiliate_clicks (watch_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_seller_id ON public.affiliate_clicks (seller_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON public.affiliate_clicks (clicked_at);
CREATE INDEX IF NOT EXISTS idx_sellers_name ON public.sellers (name);

-- Add trigger for sellers updated_at
CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample sellers
INSERT INTO public.sellers (name, website, trust_score, commission_rate, affiliate_base_url) VALUES
  ('Chrono24', 'https://www.chrono24.com', 4.8, 0.05, 'https://www.chrono24.com/search/index.htm'),
  ('eBay', 'https://www.ebay.com', 4.5, 0.03, 'https://www.ebay.com/sch/i.html'),
  ('WatchBox', 'https://www.thewatchbox.com', 4.9, 0.06, 'https://www.thewatchbox.com/watches/'),
  ('Crown & Caliber', 'https://www.crownandcaliber.com', 4.7, 0.04, 'https://www.crownandcaliber.com/search'),
  ('Hodinkee Shop', 'https://shop.hodinkee.com', 4.6, 0.05, 'https://shop.hodinkee.com/search');

-- Add seller_id to watches table
ALTER TABLE public.watches ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.sellers(id);
ALTER TABLE public.watches ADD COLUMN IF NOT EXISTS affiliate_url TEXT;

-- Update existing watches with seller_id based on marketplace
UPDATE public.watches 
SET seller_id = (
  SELECT id FROM public.sellers 
  WHERE sellers.name = watches.marketplace
  LIMIT 1
);