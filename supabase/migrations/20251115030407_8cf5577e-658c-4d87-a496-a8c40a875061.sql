-- Criar tabela de configurações do negócio
CREATE TABLE IF NOT EXISTS public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL UNIQUE,
  opening_hours JSONB DEFAULT '{}',
  holidays JSONB DEFAULT '[]',
  default_service_duration INTEGER DEFAULT 30,
  booking_buffer_minutes INTEGER DEFAULT 15,
  advance_booking_days INTEGER DEFAULT 30,
  cancellation_hours INTEGER DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Business owners can manage their settings"
ON public.business_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = business_settings.business_id
    AND businesses.owner_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Trigger para updated_at
CREATE TRIGGER update_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();