-- Make seller_id nullable on affiliate_clicks and drop the FK constraint
-- so clicks can be recorded for scraped listings that don't have a seller_id

-- 1. Drop the foreign key constraint (seller_id may be null or not in sellers table)
ALTER TABLE public.affiliate_clicks
  DROP CONSTRAINT IF EXISTS affiliate_clicks_seller_id_fkey;

-- 2. Change seller_id from UUID to TEXT so it can accept any value or null
ALTER TABLE public.affiliate_clicks
  ALTER COLUMN seller_id DROP NOT NULL,
  ALTER COLUMN seller_id TYPE TEXT USING seller_id::TEXT;
