-- Fix the function search path warning by setting a secure search path
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;