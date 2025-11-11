import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "2,99",
    description: "Perfeito para começar",
    professionals: "1 profissional",
    features: [
      "Agendamentos ilimitados",
      "Perfil profissional",
      "Menu de serviços",
      "Notificações por email",
      "Suporte por email",
    ],
  },
  {
    name: "Professional",
    price: "4,99",
    description: "Para pequenas equipas",
    professionals: "Até 2 profissionais",
    featured: true,
    features: [
      "Tudo do Starter",
      "2 perfis profissionais",
      "Relatórios básicos",
      "Lembretes SMS",
      "Suporte prioritário",
    ],
  },
  {
    name: "Business",
    price: "9,99",
    description: "Para negócios em crescimento",
    professionals: "Até 5 profissionais",
    features: [
      "Tudo do Professional",
      "5 perfis profissionais",
      "Relatórios avançados",
      "Pagamentos online",
      "Gestão de inventário",
      "Suporte 24/7",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section id="precos" className="py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Preços Simples e Transparentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Sem custos escondidos. Sem taxas por agendamento. Apenas um preço fixo mensal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.featured
                  ? "bg-gradient-primary text-primary-foreground shadow-strong scale-105"
                  : "bg-card border border-border shadow-soft"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? "" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-bold ${plan.featured ? "" : "text-foreground"}`}>
                    {plan.price}€
                  </span>
                  <span className={`${plan.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    /mês
                  </span>
                </div>
                <p className={`text-sm mt-2 ${plan.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.professionals}
                </p>
              </div>

              <Button
                variant={plan.featured ? "secondary" : "default"}
                className="w-full mb-6"
                size="lg"
                asChild
              >
                <Link to="/signup">Começar Agora</Link>
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className={`h-5 w-5 shrink-0 mt-0.5 ${
                      plan.featured ? "text-primary-foreground" : "text-secondary"
                    }`} />
                    <span className={`text-sm ${
                      plan.featured ? "text-primary-foreground/90" : "text-foreground/80"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-12 max-w-2xl mx-auto">
          Todos os planos incluem 14 dias de teste grátis. Sem cartão de crédito necessário.
        </p>
      </div>
    </section>
  );
};
