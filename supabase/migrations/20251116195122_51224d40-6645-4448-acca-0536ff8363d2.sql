-- Fix profiles table RLS policy to prevent public exposure of user names
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create restrictive policy: users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Allow authenticated users to view profiles of professionals they interact with
CREATE POLICY "Authenticated users can view business-related profiles"
ON public.profiles FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    -- Profiles of professionals in businesses user has appointments with
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN professionals p ON p.user_id = profiles.id
      WHERE a.client_id = auth.uid()
    ) OR
    -- Profiles of professionals user can see
    EXISTS (
      SELECT 1 FROM professionals p
      WHERE p.user_id = profiles.id
      AND p.is_active = true
    ) OR
    -- Profiles of business owners for active businesses
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.owner_id = profiles.id
      AND b.is_active = true
    )
  )
);