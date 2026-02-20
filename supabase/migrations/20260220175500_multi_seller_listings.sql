-- Migration: Enable multiple listings per reference
-- Changes UNIQUE(reference) to UNIQUE(reference, marketplace, seller)
-- Adds listing_url and marketplace index

-- 1. Drop the old unique constraint on reference
ALTER TABLE public.watches DROP CONSTRAINT IF EXISTS watches_reference_key;

-- 2. Add composite unique to allow same watch from different sellers/platforms
ALTER TABLE public.watches ADD CONSTRAINT watches_ref_market_seller_unique
  UNIQUE (reference, marketplace, seller);

-- 3. Add listing_url column (original URL, separate from affiliate_url)
ALTER TABLE public.watches ADD COLUMN IF NOT EXISTS listing_url TEXT;

-- 4. Add index on marketplace for faster platform-specific queries
CREATE INDEX IF NOT EXISTS idx_watches_marketplace ON public.watches(marketplace);

-- 5. Add index on brand for faster brand searches
CREATE INDEX IF NOT EXISTS idx_watches_brand ON public.watches(brand);

-- 6. Add scraped_at column to track freshness
ALTER TABLE public.watches ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMP WITH TIME ZONE DEFAULT now();
