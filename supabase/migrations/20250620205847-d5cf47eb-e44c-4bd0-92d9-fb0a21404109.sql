
-- Create the price_alerts table
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  email TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert price alerts (public feature)
CREATE POLICY "Anyone can create price alerts" 
  ON public.price_alerts 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reading price alerts (for admin purposes)
CREATE POLICY "Anyone can view price alerts" 
  ON public.price_alerts 
  FOR SELECT 
  USING (true);

-- Add indexes for better query performance
CREATE INDEX idx_price_alerts_brand ON public.price_alerts(brand);
CREATE INDEX idx_price_alerts_model ON public.price_alerts(model);
CREATE INDEX idx_price_alerts_email ON public.price_alerts(email);
CREATE INDEX idx_price_alerts_created_at ON public.price_alerts(created_at);
