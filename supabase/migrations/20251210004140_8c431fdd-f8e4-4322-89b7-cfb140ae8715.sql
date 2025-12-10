-- Create guest_bookings table for external clients without accounts
CREATE TABLE public.guest_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_email text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guest_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert guest bookings (for public booking flow)
CREATE POLICY "Anyone can create guest bookings"
ON public.guest_bookings
FOR INSERT
WITH CHECK (true);

-- Business owners can view guest bookings for their appointments
CREATE POLICY "Business owners can view guest bookings"
ON public.guest_bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM appointments a
    JOIN businesses b ON b.id = a.business_id
    WHERE a.id = guest_bookings.appointment_id
    AND b.owner_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Allow professionals to view guest bookings for their appointments
CREATE POLICY "Professionals can view guest bookings"
ON public.guest_bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM appointments a
    JOIN professionals p ON p.id = a.professional_id
    WHERE a.id = guest_bookings.appointment_id
    AND p.user_id = auth.uid()
  )
);

-- Update appointments policy to allow guest bookings
-- First, create a placeholder UUID for guest clients
CREATE OR REPLACE FUNCTION public.get_guest_client_id()
RETURNS uuid
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT '00000000-0000-0000-0000-000000000000'::uuid;
$$;

-- Allow anyone to insert appointments (for public booking)
DROP POLICY IF EXISTS "Clients can create appointments" ON public.appointments;

CREATE POLICY "Anyone can create appointments for booking"
ON public.appointments
FOR INSERT
WITH CHECK (true);