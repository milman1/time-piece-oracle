
-- Create the watches table
CREATE TABLE public.watches (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  condition TEXT NOT NULL,
  seller TEXT NOT NULL,
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER DEFAULT 0,
  marketplace TEXT NOT NULL,
  image TEXT,
  trusted BOOLEAN DEFAULT false,
  year INTEGER,
  description TEXT,
  style TEXT,
  movement TEXT,
  strap TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach trigger to watches table
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.watches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample watch data to test the search functionality
INSERT INTO public.watches (brand, model, reference, price, original_price, condition, seller, rating, reviews, marketplace, image, trusted, year, description, style, movement, strap) VALUES
('Rolex', 'Submariner', 'REF-116610LN', 8500, 9000, 'Excellent', 'Crown & Caliber', 4.8, 156, 'Crown & Caliber', '/placeholder.svg', true, 2018, 'Classic black dial Submariner in excellent condition', 'diver', 'automatic', 'metal'),
('Omega', 'Speedmaster Professional', 'REF-311.30.42.30.01.005', 3200, NULL, 'Very Good', 'Hodinkee Shop', 4.9, 89, 'Hodinkee Shop', '/placeholder.svg', true, 2019, 'Moonwatch with hesalite crystal', 'chronograph', 'manual', 'metal'),
('Patek Philippe', 'Nautilus', 'REF-5711/1A-010', 55000, NULL, 'Unworn', 'Tourneau', 5.0, 23, 'Tourneau', '/placeholder.svg', true, 2021, 'Blue dial steel Nautilus, discontinued model', 'sport', 'automatic', 'metal'),
('Audemars Piguet', 'Royal Oak', 'REF-15400ST.OO.1220ST.03', 18500, 20000, 'Excellent', 'Bobs Watches', 4.7, 67, 'Bobs Watches', '/placeholder.svg', true, 2017, 'White dial Royal Oak 41mm', 'sport', 'automatic', 'metal'),
('Cartier', 'Santos', 'REF-WSSA0009', 4800, NULL, 'Very Good', 'WatchStation', 4.6, 34, 'WatchStation', '/placeholder.svg', true, 2020, 'Medium steel Santos with leather strap', 'dress', 'automatic', 'leather'),
('Tag Heuer', 'Monaco', 'REF-CAW2111.FC6183', 2100, 2400, 'Good', 'eBay', 4.2, 12, 'eBay', '/placeholder.svg', false, 2016, 'Blue dial Monaco chronograph', 'chronograph', 'automatic', 'leather'),
('Grand Seiko', 'Snowflake', 'REF-SBGA211', 3800, NULL, 'Excellent', 'Seiko Authorized Dealer', 4.9, 45, 'Seiko', '/placeholder.svg', true, 2020, 'Spring Drive with power reserve indicator', 'dress', 'automatic', 'leather'),
('Breitling', 'Navitimer', 'REF-A23322121B2X1', 3500, NULL, 'Very Good', 'Chrono24', 4.5, 78, 'Chrono24', '/placeholder.svg', true, 2018, 'Blue dial pilot chronograph', 'pilot', 'automatic', 'leather');
