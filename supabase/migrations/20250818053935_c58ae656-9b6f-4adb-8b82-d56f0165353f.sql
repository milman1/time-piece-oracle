-- Table: watch_prices
CREATE TABLE IF NOT EXISTS public.watch_prices (
  id BIGSERIAL PRIMARY KEY,
  watch_id INTEGER NOT NULL REFERENCES public.watches(id) ON DELETE CASCADE,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  price NUMERIC NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_watch_prices_watch_time ON public.watch_prices (watch_id, collected_at);
CREATE INDEX IF NOT EXISTS idx_watch_prices_time ON public.watch_prices (collected_at);

-- Enable RLS
ALTER TABLE public.watch_prices ENABLE ROW LEVEL SECURITY;

-- Public read access for price history
DROP POLICY IF EXISTS "Public read access for watch prices" ON public.watch_prices;
CREATE POLICY "Public read access for watch prices"
  ON public.watch_prices
  FOR SELECT
  USING (true);

-- Authenticated write access
DROP POLICY IF EXISTS "Authenticated users can insert watch prices" ON public.watch_prices;
CREATE POLICY "Authenticated users can insert watch prices"
  ON public.watch_prices
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated update access
DROP POLICY IF EXISTS "Authenticated users can update watch prices" ON public.watch_prices;
CREATE POLICY "Authenticated users can update watch prices"
  ON public.watch_prices
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated delete access
DROP POLICY IF EXISTS "Authenticated users can delete watch prices" ON public.watch_prices;
CREATE POLICY "Authenticated users can delete watch prices"
  ON public.watch_prices
  FOR DELETE
  TO authenticated
  USING (true);