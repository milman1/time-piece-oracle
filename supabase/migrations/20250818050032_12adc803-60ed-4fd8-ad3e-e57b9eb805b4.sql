-- Enable Row Level Security on watches table
ALTER TABLE public.watches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to watches
-- This makes sense since watches are meant to be displayed publicly on the marketplace
CREATE POLICY "Public read access for watches"
  ON public.watches
  FOR SELECT
  USING (true);