import { Check, X } from "lucide-react";

const planFeatures = [
  {
    category: "Funcionalidades Principais",
    features: [
      { name: "Agendamentos ilimitados", starter: true, business: true, premium: true },
      { name: "Perfil profissional personalizado", starter: true, business: true, premium: true },
      { name: "Menu de serviços", starter: true, business: true, premium: true },
      { name: "Notificações por email", starter: true, business: true, premium: true },
      { name: "Número de profissionais", starter: "1", business: "Até 2", premium: "Até 5" },
    ]
  },
  {
    category: "Comunicação e Lembretes",
    features: [
      { name: "Lembretes automáticos por email (Em breve)", starter: false, business: false, premium: false },
      { name: "Lembretes SMS (Em breve)", starter: false, business: false, premium: false },
      { name: "Notificações push (Em breve)", starter: false, business: false, premium: false },
      { name: "App Mobile (Em breve)", starter: false, business: false, premium: false },
    ]
  },
  {
    category: "Gestão e Relatórios",
    features: [
      { name: "Dashboard básico", starter: true, business: true, premium: true },
      { name: "Relatórios básicos", starter: false, business: true, premium: true },
      { name: "Relatórios avançados", starter: false, business: false, premium: true },
      { name: "Análises de performance", starter: false, business: false, premium: true },
      { name: "Exportação de dados", starter: false, business: true, premium: true },
    ]
  },
  {
    category: "Pagamentos e Finanças",
    features: [
      { name: "Gestão de pagamentos (Manual na barbearia)", starter: "Manual", business: "Manual", premium: "Manual" },
      { name: "Pagamentos online integrados (Em breve)", starter: false, business: false, premium: "Breve" },
      { name: "Maquininha de cartão integrada (Em breve)", starter: false, business: false, premium: "Breve" },
      { name: "Gestão de comissões", starter: false, business: true, premium: true },
      { name: "Planos de assinatura recorrentes", starter: false, business: true, premium: true },
    ]
  },
  {
    category: "Funcionalidades Avançadas",
    features: [
      { name: "Gestão de inventário", starter: false, business: false, premium: true },
      { name: "Multi-estabelecimentos", starter: false, business: false, premium: true },
      { name: "Transferência de propriedade", starter: false, business: true, premium: true },
      { name: "API access", starter: false, business: false, premium: true },
      { name: "Branding personalizado", starter: false, business: false, premium: true },
    ]
  },
  {
    category: "Suporte",
    features: [
      { name: "Suporte por email", starter: true, business: true, premium: true },
      { name: "Suporte prioritário", starter: true, business: true, premium: true },
      { name: "Suporte 24/7", starter: true, business: true, premium: true },
      { name: "Gestor de conta dedicado", starter: false, business: false, premium: true },
    ]
  }
];

export const DashboardShowcase = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Porque Escolher o Agenda Flow?
          </h2>
          <p className="text-lg text-muted-foreground">
            Compare os planos e escolha o que melhor se adequa ao seu negócio
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mb-16 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-soft rounded-xl border border-border/50">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-card">
                  <tr>
                    <th scope="col" className="py-4 px-6 text-left text-sm font-semibold">
                      Funcionalidades
                    </th>
                    <th scope="col" className="py-4 px-6 text-center text-sm font-semibold">
                      <div className="flex flex-col items-center">
                        <span className="text-lg">Starter</span>
                        <span className="text-2xl font-bold text-primary mt-1">2,99€</span>
                        <span className="text-xs text-muted-foreground">por mês</span>
                      </div>
                    </th>
                    <th scope="col" className="py-4 px-6 text-center text-sm font-semibold bg-gradient-primary/10">
                      <div className="flex flex-col items-center">
                        <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold mb-2">
                          Mais Popular
                        </span>
                        <span className="text-lg">Business</span>
                        <span className="text-2xl font-bold text-primary mt-1">4,99€</span>
                        <span className="text-xs text-muted-foreground">por mês</span>
                      </div>
                    </th>
                    <th scope="col" className="py-4 px-6 text-center text-sm font-semibold">
                      <div className="flex flex-col items-center">
                        <span className="text-lg">Premium</span>
                        <span className="text-2xl font-bold text-primary mt-1">9,99€</span>
                        <span className="text-xs text-muted-foreground">por mês</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {planFeatures.map((category, categoryIdx) => (
                    <>
                      <tr key={`category-${categoryIdx}`} className="bg-muted/30">
                        <td colSpan={4} className="py-3 px-6 text-sm font-semibold">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIdx) => (
                        <tr key={`feature-${categoryIdx}-${featureIdx}`} className="hover:bg-muted/20 transition-colors">
                          <td className="py-4 px-6 text-sm">
                            {feature.name}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {typeof feature.starter === 'boolean' ? (
                              feature.starter ? (
                                <Check className="h-5 w-5 text-primary mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium">{feature.starter}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center bg-gradient-primary/5">
                            {typeof feature.business === 'boolean' ? (
                              feature.business ? (
                                <Check className="h-5 w-5 text-primary mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium">{feature.business}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {typeof feature.premium === 'boolean' ? (
                              feature.premium ? (
                                <Check className="h-5 w-5 text-primary mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium">{feature.premium}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
