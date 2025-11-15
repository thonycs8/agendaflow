-- Adicionar campos para tipos de profissionais
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS employment_type TEXT CHECK (employment_type IN ('employee', 'commission', 'independent')) DEFAULT 'employee',
ADD COLUMN IF NOT EXISTS commission_percentage NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_rent NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fixed_salary NUMERIC(10,2) DEFAULT 0;

-- Criar tabela de planos de fidelização
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 30,
  services_included JSONB NOT NULL DEFAULT '[]',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela de assinaturas de clientes
CREATE TABLE IF NOT EXISTS public.client_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.membership_plans(id) ON DELETE SET NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
  usage_count INTEGER DEFAULT 0,
  max_usage INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela de transações financeiras
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Adicionar campos em appointments
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Criar tabela de bloqueios de horário
CREATE TABLE IF NOT EXISTS public.schedule_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies para membership_plans
CREATE POLICY "Business owners can manage their membership plans"
ON public.membership_plans FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = membership_plans.business_id
    AND businesses.owner_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Anyone can view active membership plans"
ON public.membership_plans FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies para client_memberships
CREATE POLICY "Clients can view their memberships"
ON public.client_memberships FOR SELECT
USING (
  client_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = client_memberships.business_id
    AND businesses.owner_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Business owners can manage client memberships"
ON public.client_memberships FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = client_memberships.business_id
    AND businesses.owner_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies para financial_transactions
CREATE POLICY "Business owners can manage their transactions"
ON public.financial_transactions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = financial_transactions.business_id
    AND businesses.owner_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies para schedule_blocks
CREATE POLICY "Professionals can manage their schedule blocks"
ON public.schedule_blocks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.professionals
    WHERE professionals.id = schedule_blocks.professional_id
    AND professionals.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Business owners can view schedule blocks"
ON public.schedule_blocks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.professionals p
    JOIN public.businesses b ON b.id = p.business_id
    WHERE p.id = schedule_blocks.professional_id
    AND b.owner_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Triggers para updated_at
CREATE TRIGGER update_membership_plans_updated_at
BEFORE UPDATE ON public.membership_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_memberships_updated_at
BEFORE UPDATE ON public.client_memberships
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at
BEFORE UPDATE ON public.financial_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();