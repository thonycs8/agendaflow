import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Privacidade = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Informações que Coletamos</h2>
            <p>
              No Agenda Flow, levamos a sua privacidade a sério. Coletamos apenas as informações necessárias para fornecer e melhorar os nossos serviços:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Informações de conta (nome, email, telefone)</li>
              <li>Informações do negócio (nome comercial, endereço, tipo de serviço)</li>
              <li>Dados de agendamento e transações</li>
              <li>Informações técnicas (endereço IP, tipo de navegador)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer e manter o serviço de agendamento</li>
              <li>Processar transações e pagamentos</li>
              <li>Enviar notificações sobre agendamentos</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Comunicar atualizações e novidades importantes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Compartilhamento de Dados</h2>
            <p>
              Não vendemos suas informações pessoais. Compartilhamos dados apenas com:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processadores de pagamento (Stripe) para transações seguras</li>
              <li>Provedores de serviços de email para notificações</li>
              <li>Autoridades legais quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Segurança dos Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia SSL/TLS para todos os dados em trânsito</li>
              <li>Armazenamento seguro em servidores protegidos</li>
              <li>Acesso restrito apenas a pessoal autorizado</li>
              <li>Monitoramento contínuo de segurança</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Seus Direitos</h2>
            <p>De acordo com o GDPR, você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar exclusão de dados</li>
              <li>Exportar seus dados</li>
              <li>Revogar consentimento a qualquer momento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Cookies</h2>
            <p>
              Utilizamos cookies essenciais para o funcionamento da plataforma e cookies de análise para melhorar nossos serviços. Você pode gerenciar as preferências de cookies nas configurações do navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Contato</h2>
            <p>
              Para questões sobre privacidade ou para exercer seus direitos, entre em contato:
            </p>
            <p className="font-medium">
              Email: privacidade@agendaflow.com<br />
              Telefone: +351 123 456 789
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

export default Privacidade;
