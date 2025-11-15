import { Check, X } from "lucide-react";
import mockup1 from "@/assets/dashboard-mockup-1.jpg";
import mockup2 from "@/assets/dashboard-mockup-2.jpg";
import mockup3 from "@/assets/dashboard-mockup-3.jpg";

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
      { name: "Lembretes automáticos por email", starter: true, business: true, premium: true },
      { name: "Lembretes SMS", starter: false, business: true, premium: true },
      { name: "Notificações push", starter: false, business: false, premium: true },
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
      { name: "Gestão de pagamentos manual", starter: true, business: true, premium: true },
      { name: "Pagamentos online integrados (Em breve)", starter: false, business: false, premium: false },
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
        <div className="space-y-16">
          {/* Mockup 1 - Main Dashboard */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={mockup1}
                alt="Dashboard principal do Agenda Flow"
                className="rounded-xl shadow-strong border border-border/50"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Dashboard Completo e Intuitivo
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Visualize todos os agendamentos do dia, acompanhe receitas em tempo real, 
                e gerencie múltiplos profissionais numa única tela. Tudo desenhado para 
                maximizar sua produtividade.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Visão geral de agendamentos e receitas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Gestão completa de múltiplos profissionais</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Relatórios e análises em tempo real</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mockup 2 - Scheduling */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Agendamento Simplificado
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Sistema de agendamento inteligente que seus clientes adoram usar. 
                Disponibilidade em tempo real, confirmações automáticas e lembretes 
                que reduzem faltas.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Agendamento online 24/7 para seus clientes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Sincronização automática entre profissionais</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Lembretes automáticos por email e SMS</span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src={mockup2}
                alt="Sistema de agendamento do Agenda Flow"
                className="rounded-xl shadow-strong border border-border/50"
              />
            </div>
          </div>

          {/* Mockup 3 - Financial Management */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={mockup3}
                alt="Gestão financeira do Agenda Flow"
                className="rounded-xl shadow-strong border border-border/50"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Controlo Financeiro Total
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Gerencie receitas, despesas e comissões de profissionais com facilidade. 
                Pagamentos integrados e relatórios detalhados para tomada de decisões 
                informadas.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Pagamentos online integrados com Stripe</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Gestão automática de comissões de profissionais</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Planos de assinatura recorrentes para clientes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Features Highlight */}
        <div className="mt-16 bg-gradient-primary rounded-2xl p-8 md:p-12 text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Funcionalidades Únicas
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Recursos que fazem a diferença no dia-a-dia do seu negócio
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h4 className="font-semibold text-lg mb-2">Transferência de Propriedade</h4>
                <p className="opacity-90">
                  Facilidade única de transferir o negócio para outro profissional com 
                  aprovação administrativa. Ideal para expansão e franchising.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h4 className="font-semibold text-lg mb-2">Planos Recorrentes</h4>
                <p className="opacity-90">
                  Crie e gerencie planos de assinatura facilmente. Aumente sua receita 
                  previsível com memberships personalizados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
