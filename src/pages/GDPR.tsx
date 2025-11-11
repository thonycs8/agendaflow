import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const GDPR = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Conformidade GDPR</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Compromisso com o GDPR</h2>
            <p>
              A BookPro está totalmente comprometida com o Regulamento Geral de Proteção de Dados (GDPR) da União Europeia. Esta página explica como cumprimos com as exigências do GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Base Legal para Processamento</h2>
            <p>Processamos seus dados pessoais com base em:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consentimento:</strong> Para envio de comunicações de marketing</li>
              <li><strong>Execução de contrato:</strong> Para fornecer nossos serviços de agendamento</li>
              <li><strong>Obrigação legal:</strong> Para cumprimento de requisitos fiscais e legais</li>
              <li><strong>Interesse legítimo:</strong> Para melhorar nossos serviços e prevenir fraude</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Seus Direitos sob o GDPR</h2>
            <p>Como titular de dados, você tem os seguintes direitos:</p>
            
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-foreground">1. Direito de Acesso</h3>
                <p>Você pode solicitar uma cópia de todos os dados pessoais que mantemos sobre você.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">2. Direito de Retificação</h3>
                <p>Você pode solicitar correção de dados pessoais imprecisos ou incompletos.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">3. Direito ao Esquecimento</h3>
                <p>Você pode solicitar a exclusão de seus dados pessoais, sujeito a certas condições.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">4. Direito à Portabilidade</h3>
                <p>Você pode solicitar seus dados em formato estruturado e legível por máquina.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">5. Direito de Objeção</h3>
                <p>Você pode objetar ao processamento de seus dados pessoais.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">6. Direito de Restrição</h3>
                <p>Você pode solicitar limitação do processamento de seus dados.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Como Exercer Seus Direitos</h2>
            <p>
              Para exercer qualquer um dos seus direitos sob o GDPR, entre em contato conosco:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: gdpr@bookpro.com</li>
              <li>Formulário online em nosso portal de privacidade</li>
              <li>Carta registrada para nosso Encarregado de Proteção de Dados</li>
            </ul>
            <p className="mt-4">
              Responderemos à sua solicitação dentro de 30 dias. Em casos complexos, podemos estender este prazo por mais 60 dias, notificando-o da extensão.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Transferência Internacional de Dados</h2>
            <p>
              Seus dados são armazenados em servidores localizados na União Europeia. Quando transferimos dados para fora da UE, garantimos proteção adequada através de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cláusulas contratuais padrão aprovadas pela Comissão Europeia</li>
              <li>Verificação de decisões de adequação</li>
              <li>Outras salvaguardas legais apropriadas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Retenção de Dados</h2>
            <p>Retemos seus dados pessoais apenas pelo tempo necessário:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dados de conta: Durante a vigência da sua assinatura e 3 anos após cancelamento</li>
              <li>Dados de transação: 7 anos para fins fiscais</li>
              <li>Dados de marketing: Até que você retire o consentimento</li>
              <li>Logs técnicos: 90 dias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Segurança de Dados</h2>
            <p>Implementamos medidas técnicas e organizacionais robustas:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controles de acesso baseados em funções</li>
              <li>Auditorias regulares de segurança</li>
              <li>Testes de penetração anuais</li>
              <li>Treinamento de equipe em proteção de dados</li>
              <li>Plano de resposta a incidentes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Violações de Dados</h2>
            <p>
              Em caso de violação de dados que possa resultar em alto risco para seus direitos e liberdades, notificaremos você e a autoridade de supervisão relevante dentro de 72 horas da descoberta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Encarregado de Proteção de Dados</h2>
            <p>Nosso Encarregado de Proteção de Dados pode ser contactado em:</p>
            <p className="font-medium">
              Email: dpo@bookpro.com<br />
              Endereço: Encarregado de Proteção de Dados, BookPro, Lisboa, Portugal
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Direito de Reclamação</h2>
            <p>
              Se não estiver satisfeito com a forma como tratamos seus dados pessoais, você tem o direito de apresentar uma reclamação à autoridade de supervisão competente:
            </p>
            <p className="font-medium">
              Comissão Nacional de Proteção de Dados (CNPD)<br />
              Website: www.cnpd.pt<br />
              Email: geral@cnpd.pt
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Cookies e Rastreamento</h2>
            <p>
              Usamos cookies essenciais e de análise. Você pode gerenciar suas preferências de cookies através do nosso banner de cookies ou nas configurações do navegador. Consulte nossa Política de Cookies para mais detalhes.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Esta página foi atualizada pela última vez em: Janeiro 2024
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GDPR;
