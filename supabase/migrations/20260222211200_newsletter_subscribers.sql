-- Newsletter subscribers table for email capture
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'blog',  -- which page/article they signed up from
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint on email (prevent duplicates)
ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email);

-- RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup form)
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Only service role can read (admin/edge function use)
CREATE POLICY "Service role can read subscribers" ON public.newsletter_subscribers FOR SELECT USING (auth.role() = 'service_role');
