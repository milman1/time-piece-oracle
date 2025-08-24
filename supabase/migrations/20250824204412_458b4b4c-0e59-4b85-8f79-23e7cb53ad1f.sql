-- CRITICAL SECURITY FIXES
-- Phase 1: Immediate Data Protection

-- 1. Secure Price Alerts Table (Remove public access to customer emails)
DROP POLICY IF EXISTS "Anyone can view price alerts" ON public.price_alerts;

CREATE POLICY "Users can view their own price alerts"
ON public.price_alerts
FOR SELECT
USING (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Update price alerts policies to require authentication
DROP POLICY IF EXISTS "Anyone can create price alerts" ON public.price_alerts;

CREATE POLICY "Authenticated users can create price alerts"
ON public.price_alerts
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Add update and delete policies for price alerts
CREATE POLICY "Users can update their own price alerts"
ON public.price_alerts
FOR UPDATE
USING (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own price alerts"
ON public.price_alerts
FOR DELETE
USING (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 2. Secure User Subscriptions Table (Remove public access)
DROP POLICY IF EXISTS "Anyone can create subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Anyone can update subscriptions" ON public.user_subscriptions;

CREATE POLICY "Authenticated users can create their own subscription"
ON public.user_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.user_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow system (Stripe webhooks) to update subscriptions via service role
CREATE POLICY "Service role can manage subscriptions"
ON public.user_subscriptions
FOR ALL
USING (current_setting('role') = 'service_role');

-- 3. Secure Affiliate Clicks Table (Remove public access to tracking data)
DROP POLICY IF EXISTS "Public read access for affiliate clicks" ON public.affiliate_clicks;

-- Only allow creation of affiliate clicks (for tracking), no read access for users
CREATE POLICY "System can read affiliate clicks"
ON public.affiliate_clicks
FOR SELECT
USING (current_setting('role') = 'service_role');

-- 4. Add missing constraints for data integrity
ALTER TABLE public.user_subscriptions 
ADD CONSTRAINT valid_plan_type 
CHECK (plan_type IN ('free', 'pro'));

ALTER TABLE public.user_subscriptions 
ADD CONSTRAINT valid_subscription_status 
CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing'));

-- 5. Create audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage audit logs"
ON public.audit_logs
FOR ALL
USING (current_setting('role') = 'service_role');