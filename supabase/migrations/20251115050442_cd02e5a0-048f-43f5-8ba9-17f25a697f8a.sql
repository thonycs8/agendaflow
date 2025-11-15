-- Create landing page configuration table
CREATE TABLE public.landing_page_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for feature comparison configuration
CREATE TABLE public.feature_comparison_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR NOT NULL,
  feature_name VARCHAR NOT NULL,
  starter_value TEXT,
  business_value TEXT,
  premium_value TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  coming_soon BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create landing page templates table
CREATE TABLE public.landing_page_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  template_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.landing_page_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_comparison_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_templates ENABLE ROW LEVEL SECURITY;

-- Policies for landing_page_config (everyone can read, only admins can modify)
CREATE POLICY "Anyone can view landing page config"
  ON public.landing_page_config
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify landing page config"
  ON public.landing_page_config
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Policies for feature_comparison_config
CREATE POLICY "Anyone can view feature comparison config"
  ON public.feature_comparison_config
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify feature comparison config"
  ON public.feature_comparison_config
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Policies for landing_page_templates
CREATE POLICY "Anyone can view landing page templates"
  ON public.landing_page_templates
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify landing page templates"
  ON public.landing_page_templates
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_landing_page_config_updated_at
  BEFORE UPDATE ON public.landing_page_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_comparison_config_updated_at
  BEFORE UPDATE ON public.feature_comparison_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_landing_page_templates_updated_at
  BEFORE UPDATE ON public.landing_page_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default landing page sections
INSERT INTO public.landing_page_config (section, title, subtitle, content, is_active, order_index) VALUES
('hero', 'Simplifique a Gestão da Sua Barbearia', 'Sistema completo de agendamento online', 'Agende, gerencie e cresça seu negócio com a plataforma mais intuitiva do mercado', true, 1),
('features', 'Recursos que Fazem a Diferença', 'Tudo que você precisa em um só lugar', 'Gestão completa de agendamentos, profissionais, clientes e muito mais', true, 2),
('dashboard', 'Dashboard Intuitivo e Poderoso', 'Controle total do seu negócio', 'Visualize métricas, gerencie agendamentos e tome decisões baseadas em dados', true, 3),
('testimonials', 'O Que Nossos Clientes Dizem', 'Histórias de sucesso reais', 'Veja como o Agenda Flow transformou negócios como o seu', true, 4),
('comparison', 'Porque Escolher o Agenda Flow', 'Compare e escolha o melhor para você', 'Transparência total em nossos planos e funcionalidades', true, 5),
('pricing', 'Planos Para Cada Necessidade', 'Escolha o plano ideal para seu negócio', 'Comece grátis e escale conforme cresce', true, 6),
('cta', 'Pronto Para Transformar Seu Negócio?', 'Comece hoje mesmo, sem compromisso', 'Experimente gratuitamente por 30 dias', true, 7);

-- Insert default feature comparison data
INSERT INTO public.feature_comparison_config (category, feature_name, starter_value, business_value, premium_value, is_active, order_index, coming_soon) VALUES
('Funcionalidades Principais', 'Agendamento online 24/7', 'true', 'true', 'true', true, 1, false),
('Funcionalidades Principais', 'Calendário sincronizado', 'true', 'true', 'true', true, 2, false),
('Funcionalidades Principais', 'Gestão de clientes', 'true', 'true', 'true', true, 3, false),
('Funcionalidades Principais', 'Gestão de serviços', 'true', 'true', 'true', true, 4, false),
('Funcionalidades Principais', 'Número de profissionais', '1', 'Até 2', 'Até 5', true, 5, false),
('Comunicação e Lembretes', 'Lembretes automáticos por email', 'false', 'false', 'false', true, 6, true),
('Comunicação e Lembretes', 'Lembretes SMS', 'false', 'false', 'false', true, 7, true),
('Comunicação e Lembretes', 'Notificações push', 'false', 'false', 'false', true, 8, true),
('Comunicação e Lembretes', 'App Mobile', 'false', 'false', 'false', true, 9, true),
('Gestão e Relatórios', 'Relatórios básicos', 'false', 'true', 'true', true, 10, false),
('Gestão e Relatórios', 'Relatórios avançados', 'false', 'false', 'true', true, 11, false),
('Gestão e Relatórios', 'Exportação de dados', 'false', 'true', 'true', true, 12, false),
('Gestão e Relatórios', 'Analytics detalhado', 'false', 'false', 'true', true, 13, false),
('Pagamentos e Finanças', 'Gestão de pagamentos (Manual na barbearia)', 'Manual', 'Manual', 'Manual', true, 14, false),
('Pagamentos e Finanças', 'Pagamentos online integrados', 'false', 'false', 'Breve', true, 15, true),
('Pagamentos e Finanças', 'Maquininha de cartão integrada', 'false', 'false', 'Breve', true, 16, true),
('Pagamentos e Finanças', 'Gestão de comissões', 'false', 'true', 'true', true, 17, false),
('Pagamentos e Finanças', 'Planos de assinatura recorrentes', 'false', 'true', 'true', true, 18, false),
('Funcionalidades Avançadas', 'Sistema de fidelidade', 'false', 'false', 'true', true, 19, false),
('Funcionalidades Avançadas', 'Página personalizada', 'false', 'true', 'true', true, 20, false),
('Funcionalidades Avançadas', 'Domínio personalizado', 'false', 'false', 'true', true, 21, false),
('Funcionalidades Avançadas', 'Transferência de propriedade', 'false', 'true', 'true', true, 22, false),
('Suporte', 'Suporte 24/7', 'true', 'true', 'true', true, 23, false);

-- Insert default templates
INSERT INTO public.landing_page_templates (name, description, is_active, template_data) VALUES
('Original', 'Template original focado em funcionalidades', true, '{"hero_style": "default", "cta_position": "bottom", "emphasis": "features"}'),
('Conversão Alta', 'Template otimizado para conversão com CTAs destacados', false, '{"hero_style": "bold", "cta_position": "multiple", "emphasis": "benefits", "social_proof": true}'),
('Vendas Diretas', 'Template focado em vendas com preços em destaque', false, '{"hero_style": "minimal", "cta_position": "top", "emphasis": "pricing", "urgency": true}');