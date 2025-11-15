import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Termos = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a plataforma Agenda Flow, você concorda com estes Termos de Uso. Se não concordar com algum termo, não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Descrição do Serviço</h2>
            <p>
              O Agenda Flow é uma plataforma de gestão de agendamentos para negócios de serviços. Oferecemos:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sistema de agendamento online</li>
              <li>Gestão de clientes e profissionais</li>
              <li>Processamento de pagamentos</li>
              <li>Relatórios e análises</li>
              <li>Notificações automáticas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Conta de Usuário</h2>
            <p>Para usar nossos serviços, você deve:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Fornecer informações verdadeiras e completas</li>
              <li>Manter a segurança da sua palavra-passe</li>
              <li>Notificar-nos imediatamente sobre uso não autorizado</li>
              <li>Ser responsável por todas as atividades na sua conta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Planos e Pagamentos</h2>
            <p>
              Os planos de assinatura são cobrados mensalmente:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Starter: 2,99€/mês (1 profissional)</li>
              <li>Professional: 4,99€/mês (2 profissionais)</li>
              <li>Business: 9,99€/mês (5 profissionais)</li>
            </ul>
            <p className="mt-4">
              Todos os planos incluem 14 dias de teste grátis. O pagamento é processado automaticamente no início de cada período de faturação.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Cancelamento e Reembolsos</h2>
            <p>
              Você pode cancelar sua assinatura a qualquer momento. O acesso continua até o final do período pago. Não oferecemos reembolsos proporcionais, exceto conforme exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Uso Aceitável</h2>
            <p>Você concorda em não:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usar o serviço para atividades ilegais</li>
              <li>Tentar acessar contas de outros usuários</li>
              <li>Interferir com a operação da plataforma</li>
              <li>Fazer engenharia reversa do software</li>
              <li>Usar o serviço para spam ou phishing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da plataforma Agenda Flow (design, código, logotipos, textos) é propriedade do Agenda Flow e protegido por leis de direitos autorais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Limitação de Responsabilidade</h2>
            <p>
              O Agenda Flow fornece o serviço "como está". Não garantimos operação ininterrupta ou livre de erros. Nossa responsabilidade é limitada ao valor pago nos últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Modificações</h2>
            <p>
              Podemos modificar estes termos a qualquer momento. Notificaremos sobre mudanças significativas por email. O uso continuado após modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis de Portugal. Quaisquer disputas serão resolvidas nos tribunais de Lisboa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Contato</h2>
            <p>Para questões sobre estes termos:</p>
            <p className="font-medium">
              Email: suporte@agendaflow.com<br />
              Telefone: +351 123 456 789<br />
              Endereço: Lisboa, Portugal
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Última atualização: Janeiro 2024
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Termos;
