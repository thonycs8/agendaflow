-- Create table for professional's client list
CREATE TABLE IF NOT EXISTS public.professional_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_address TEXT,
  share_with_business BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(professional_id, client_id)
);

-- Enable RLS
ALTER TABLE public.professional_clients ENABLE ROW LEVEL SECURITY;

-- Professionals can view and manage their own clients
CREATE POLICY "Professionals can manage their clients"
ON public.professional_clients
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.professionals
    WHERE professionals.id = professional_clients.professional_id
    AND professionals.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
);

-- Business owners can view clients that are shared with business
CREATE POLICY "Business owners can view shared clients"
ON public.professional_clients
FOR SELECT
USING (
  (share_with_business = true AND EXISTS (
    SELECT 1 FROM public.professionals p
    JOIN public.businesses b ON b.id = p.business_id
    WHERE p.id = professional_clients.professional_id
    AND b.owner_id = auth.uid()
  ))
  OR has_role(auth.uid(), 'admin')
);

-- Admins can view all clients
CREATE POLICY "Admins can view all clients"
ON public.professional_clients
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_professional_clients_updated_at
BEFORE UPDATE ON public.professional_clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();