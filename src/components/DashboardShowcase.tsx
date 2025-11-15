import { Check } from "lucide-react";
import mockup1 from "@/assets/dashboard-mockup-1.jpg";
import mockup2 from "@/assets/dashboard-mockup-2.jpg";
import mockup3 from "@/assets/dashboard-mockup-3.jpg";

const benefits = [
  {
    title: "Simples",
    description: "Interface intuitiva que qualquer profissional consegue usar sem treino complexo"
  },
  {
    title: "Prático",
    description: "Todas as ferramentas que precisa num único lugar - agenda, clientes, finanças"
  },
  {
    title: "Fiável",
    description: "Sistema robusto com backup automático e suporte técnico em português"
  },
  {
    title: "Completo",
    description: "Gestão de profissionais, transferência de propriedade e planos recorrentes"
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
            A solução completa para gestão do seu negócio de beleza e bem-estar
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Mockups */}
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
