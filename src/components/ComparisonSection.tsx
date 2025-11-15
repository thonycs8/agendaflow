import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

const competitors = [
  {
    name: "Agenda Flow",
    price: "2,99€",
    features: {
      professionals: "1-5+",
      calendar: true,
      payments: true,
      reports: true,
      notifications: true,
      transfers: true,
      memberships: true,
      mobile: true,
      support: "24/7",
      setup: "5 min",
    },
  },
  {
    name: "Calendly",
    price: "8€+",
    features: {
      professionals: "1",
      calendar: true,
      payments: false,
      reports: false,
      notifications: true,
      transfers: false,
      memberships: false,
      mobile: true,
      support: "Email",
      setup: "15 min",
    },
  },
  {
    name: "Acuity",
    price: "16€+",
    features: {
      professionals: "1-6",
      calendar: true,
      payments: true,
      reports: true,
      notifications: true,
      transfers: false,
      memberships: false,
      mobile: true,
      support: "Email",
      setup: "30 min",
    },
  },
];

const featureLabels = {
  professionals: "Profissionais",
  calendar: "Agenda Online",
  payments: "Pagamentos",
  reports: "Relatórios",
  notifications: "Notificações",
  transfers: "Transferência de Propriedade",
  memberships: "Planos de Assinatura",
  mobile: "App Mobile",
  support: "Suporte",
  setup: "Tempo de Setup",
};

export const ComparisonSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por Que Escolher o Agenda Flow?
          </h2>
          <p className="text-lg text-muted-foreground">
            Mais funcionalidades, melhor preço, suporte dedicado
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="grid grid-cols-4 gap-4 min-w-[800px]">
              {/* Header */}
              <div className="font-semibold text-sm text-muted-foreground py-4">
                Funcionalidade
              </div>
              {competitors.map((competitor, idx) => (
                <Card
                  key={idx}
                  className={`p-4 text-center ${
                    idx === 0 ? "bg-gradient-primary text-primary-foreground border-primary" : ""
                  }`}
                >
                  <h3 className={`font-bold text-lg mb-2 ${idx === 0 ? "" : "text-foreground"}`}>
                    {competitor.name}
                  </h3>
                  <p className={`text-2xl font-bold ${idx === 0 ? "" : "text-foreground"}`}>
                    {competitor.price}
                    <span className="text-sm font-normal">/mês</span>
                  </p>
                </Card>
              ))}

              {/* Features */}
              {Object.entries(featureLabels).map(([key, label]) => (
                <>
                  <div className="py-3 text-sm font-medium border-t border-border/50">
                    {label}
                  </div>
                  {competitors.map((competitor, idx) => {
                    const value = competitor.features[key as keyof typeof competitor.features];
                    const isFirst = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`py-3 text-center border-t border-border/50 ${
                          isFirst ? "bg-primary/5" : ""
                        }`}
                      >
                        {typeof value === "boolean" ? (
                          value ? (
                            <Check className={`h-5 w-5 mx-auto ${isFirst ? "text-primary" : "text-green-500"}`} />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className={`text-sm font-medium ${isFirst ? "text-primary" : ""}`}>
                            {value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
