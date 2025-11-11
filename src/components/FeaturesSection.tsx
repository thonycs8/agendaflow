import { Calendar, Users, CreditCard, Star, BarChart3, Clock } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Inteligente",
    description: "Sistema intuitivo que seus clientes vão adorar. Agendamentos 24/7 sem complicações.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Perfis completos, histórico de serviços e preferências dos seus clientes.",
  },
  {
    icon: CreditCard,
    title: "Pagamentos Integrados",
    description: "Aceite pagamentos online de forma segura. Stripe integrado nativamente.",
  },
  {
    icon: Star,
    title: "Avaliações e Reviews",
    description: "Construa reputação com avaliações reais dos seus clientes.",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Análises",
    description: "Entenda seu negócio com dashboards e relatórios detalhados.",
  },
  {
    icon: Clock,
    title: "Lembretes Automáticos",
    description: "Reduza faltas com notificações automáticas por email e SMS.",
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
