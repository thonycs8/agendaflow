-- Add approval system for professionals and business owners
CREATE TABLE IF NOT EXISTS public.pending_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approval_type TEXT NOT NULL CHECK (approval_type IN ('professional', 'business_owner')),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.pending_approvals ENABLE ROW LEVEL SECURITY;

-- Admins can manage all approvals
CREATE POLICY "Admins can manage approvals"
ON public.pending_approvals
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add business features configuration
CREATE TABLE IF NOT EXISTS public.business_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES public.businesses(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'professional', 'business', 'enterprise')),
  max_professionals INTEGER DEFAULT 3,
  max_services INTEGER DEFAULT 10,
  can_create_promotions BOOLEAN DEFAULT false,
  can_create_memberships BOOLEAN DEFAULT false,
  can_export_reports BOOLEAN DEFAULT false,
  can_manage_finances BOOLEAN DEFAULT false,
  can_use_analytics BOOLEAN DEFAULT false,
  can_customize_branding BOOLEAN DEFAULT false,
  can_use_api BOOLEAN DEFAULT false,
  custom_features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_features ENABLE ROW LEVEL SECURITY;

-- Business owners can view their features
CREATE POLICY "Business owners can view their features"
ON public.business_features
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = business_features.business_id
    AND businesses.owner_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can manage all features
CREATE POLICY "Admins can manage features"
ON public.business_features
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add transfer ownership request tracking
CREATE TABLE IF NOT EXISTS public.ownership_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  current_owner_id UUID NOT NULL REFERENCES auth.users(id),
  new_owner_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.ownership_transfers ENABLE ROW LEVEL SECURITY;

-- Admins can manage all transfers
CREATE POLICY "Admins can manage transfers"
ON public.ownership_transfers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Business owners can view their transfer requests
CREATE POLICY "Owners can view their transfers"
ON public.ownership_transfers
FOR SELECT
USING (
  current_owner_id = auth.uid() 
  OR new_owner_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create updated_at trigger for business_features
CREATE TRIGGER update_business_features_updated_at
BEFORE UPDATE ON public.business_features
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();