import { Calendar, Users, CreditCard, Star, BarChart3, Clock, Building2, ArrowRightLeft, Repeat, Shield, Smartphone, Zap } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Inteligente",
    description: "Sistema intuitivo que seus clientes vão adorar. Agendamentos 24/7 sem complicações.",
  },
  {
    icon: Users,
    title: "Gestão Completa de Profissionais",
    description: "Adicione múltiplos profissionais, defina horários individuais, comissões e acompanhe performance de cada um.",
  },
  {
    icon: ArrowRightLeft,
    title: "Transferência de Propriedade",
    description: "Facilidade única de transferir o negócio para outro profissional com aprovação administrativa.",
  },
  {
    icon: Repeat,
    title: "Planos de Assinatura",
    description: "Crie e gerencie planos recorrentes facilmente. Aumente sua receita previsível com memberships.",
  },
  {
    icon: CreditCard,
    title: "Pagamentos Integrados",
    description: "Aceite pagamentos online de forma segura. Stripe integrado nativamente com relatórios financeiros.",
  },
  {
    icon: Star,
    title: "Avaliações e Reviews",
    description: "Construa reputação com avaliações reais dos seus clientes e destaque profissionais.",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Análises Avançadas",
    description: "Dashboards completos com métricas de performance, receita, ocupação e crescimento.",
  },
  {
    icon: Clock,
    title: "Lembretes Automáticos",
    description: "Reduza faltas com notificações automáticas por email e SMS. Configure antecedência e mensagens.",
  },
  {
    icon: Building2,
    title: "Multi-Estabelecimentos",
    description: "Gerencie vários negócios numa única conta. Perfeito para franquias e grupos empresariais.",
  },
  {
    icon: Shield,
    title: "Segurança e Privacidade",
    description: "Conformidade GDPR, dados encriptados e backup automático. Seus dados estão seguros.",
  },
  {
    icon: Smartphone,
    title: "Totalmente Responsivo",
    description: "Interface otimizada para mobile, tablet e desktop. Gerencie de qualquer dispositivo.",
  },
  {
    icon: Zap,
    title: "Rápido e Eficiente",
    description: "Performance otimizada, carregamento instantâneo e sincronização em tempo real.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="funcionalidades" className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que Precisa para Crescer
          </h2>
          <p className="text-lg text-muted-foreground">
            Funcionalidades profissionais sem a complexidade das grandes plataformas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
