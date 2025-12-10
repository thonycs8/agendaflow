-- Fix search_path on the function
CREATE OR REPLACE FUNCTION public.get_guest_client_id()
RETURNS uuid
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT '00000000-0000-0000-0000-000000000000'::uuid;
$$;