-- Add user_id column to price_alerts table for proper RLS
ALTER TABLE public.price_alerts 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update existing records to link them to users based on email
UPDATE public.price_alerts 
SET user_id = auth.users.id 
FROM auth.users 
WHERE price_alerts.email = auth.users.email;

-- Drop old RLS policies that use email matching
DROP POLICY IF EXISTS "Authenticated users can create price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can delete their own price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can update their own price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can view their own price alerts" ON public.price_alerts;

-- Create new secure RLS policies using user_id
CREATE POLICY "Users can create their own price alerts" 
ON public.price_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own price alerts" 
ON public.price_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own price alerts" 
ON public.price_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price alerts" 
ON public.price_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Make user_id NOT NULL after updating existing records
ALTER TABLE public.price_alerts 
ALTER COLUMN user_id SET NOT NULL;