
-- Add avg_price column to the watches table
ALTER TABLE public.watches 
ADD COLUMN avg_price NUMERIC;

-- Update existing records with some sample average prices for demonstration
-- (In a real scenario, you'd calculate these based on market data)
UPDATE public.watches 
SET avg_price = CASE 
  WHEN reference = 'REF-116610LN' THEN 9500  -- Rolex Submariner
  WHEN reference = 'REF-311.30.42.30.01.005' THEN 3800  -- Omega Speedmaster
  WHEN reference = 'REF-5711/1A-010' THEN 60000  -- Patek Philippe Nautilus
  WHEN reference = 'REF-15400ST.OO.1220ST.03' THEN 22000  -- AP Royal Oak
  WHEN reference = 'REF-WSSA0009' THEN 5200  -- Cartier Santos
  WHEN reference = 'REF-CAW2111.FC6183' THEN 2800  -- Tag Heuer Monaco
  WHEN reference = 'REF-SBGA211' THEN 4200  -- Grand Seiko Snowflake
  WHEN reference = 'REF-A23322121B2X1' THEN 3900  -- Breitling Navitimer
  ELSE price * 1.2  -- Default to 20% above current price for other watches
END;
