-- Add creator tracking to services and professionals
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS created_by_id uuid REFERENCES auth.users(id);

ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS created_by_id uuid REFERENCES auth.users(id);

-- Add promotion fields to professionals
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS promotion_title text,
ADD COLUMN IF NOT EXISTS promotion_description text,
ADD COLUMN IF NOT EXISTS promotion_discount numeric,
ADD COLUMN IF NOT EXISTS promotion_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_end_date timestamp with time zone;

-- Add banner and display settings to businesses
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS show_membership_banner boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_membership_plans boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_promotions_banner boolean DEFAULT true;

-- Update services RLS policies to allow professionals to create
DROP POLICY IF EXISTS "Business owners can manage their services" ON public.services;

CREATE POLICY "Business owners and professionals can insert services"
ON public.services
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses WHERE businesses.id = services.business_id 
    AND businesses.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM professionals WHERE professionals.business_id = services.business_id 
    AND professionals.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Business owners can update all services, professionals only their own"
ON public.services
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM businesses WHERE businesses.id = services.business_id 
    AND businesses.owner_id = auth.uid()
  )
  OR (
    created_by_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM professionals WHERE professionals.business_id = services.business_id 
      AND professionals.user_id = auth.uid()
    )
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Business owners and professionals can delete services"
ON public.services
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM businesses WHERE businesses.id = services.business_id 
    AND businesses.owner_id = auth.uid()
  )
  OR (
    created_by_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM professionals WHERE professionals.business_id = services.business_id 
      AND professionals.user_id = auth.uid()
    )
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Update professionals RLS to allow professionals to update their own promotions
DROP POLICY IF EXISTS "Business owners can manage their professionals" ON public.professionals;

CREATE POLICY "Business owners can manage all professionals"
ON public.professionals
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM businesses WHERE businesses.id = professionals.business_id 
    AND businesses.owner_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Professionals can update their own profile and promotions"
ON public.professionals
FOR UPDATE
USING (user_id = auth.uid());