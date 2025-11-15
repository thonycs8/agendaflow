import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Reembolso = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1>Política de Reembolso</h1>
          <p className="lead">
            Última atualização: {new Date().toLocaleDateString("pt-PT")}
          </p>

          <section>
            <h2>1. Reembolso de Agendamentos</h2>
            <p>
              Os agendamentos individuais podem ser cancelados e reembolsados de acordo com
              as seguintes condições:
            </p>
            <ul>
              <li>
                <strong>Cancelamento com mais de 24 horas de antecedência:</strong> Reembolso
                integral do valor pago
              </li>
              <li>
                <strong>Cancelamento entre 12 e 24 horas:</strong> Reembolso de 50% do valor
                pago
              </li>
              <li>
                <strong>Cancelamento com menos de 12 horas:</strong> Sem direito a reembolso
              </li>
              <li>
                <strong>Ausência sem aviso (no-show):</strong> Sem direito a reembolso
              </li>
            </ul>
          </section>

          <section>
            <h2>2. Reembolso de Planos de Assinatura</h2>
            <p>Para planos mensais e recorrentes:</p>
            <ul>
              <li>
                <strong>Cancelamento no primeiro mês:</strong> Reembolso proporcional aos
                dias não utilizados, deduzidos serviços já consumidos
              </li>
              <li>
                <strong>Cancelamento após primeiro mês:</strong> Sem reembolso, mas o plano
                permanece ativo até o fim do período pago
              </li>
              <li>
                <strong>Serviços não utilizados:</strong> Não são reembolsáveis nem
                transferíveis
              </li>
              <li>
                <strong>Renovação:</strong> Pode ser cancelada a qualquer momento, com efeito
                no próximo ciclo de cobrança
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Situações Especiais</h2>
            <h3>3.1. Emergências e Casos de Força Maior</h3>
            <p>
              Em situações comprovadas de emergência médica, luto familiar ou força maior, o
              estabelecimento pode conceder reembolso integral independentemente do prazo de
              cancelamento. É necessário apresentar documentação comprobatória.
            </p>

            <h3>3.2. Problemas Técnicos</h3>
            <p>
              Se você não conseguiu utilizar o serviço devido a problemas no sistema ou erro
              do estabelecimento, terá direito a reembolso integral ou reagendamento sem
              custo adicional.
            </p>

            <h3>3.3. Insatisfação com o Serviço</h3>
            <p>
              Se você não ficou satisfeito com o serviço prestado, entre em contato com o
              estabelecimento em até 48 horas após o atendimento. O estabelecimento pode
              oferecer um novo atendimento gratuito ou reembolso parcial, conforme avaliação
              do caso.
            </p>
          </section>

          <section>
            <h2>4. Processo de Reembolso</h2>
            <h3>4.1. Como Solicitar</h3>
            <p>Para solicitar reembolso:</p>
            <ol>
              <li>Acesse sua conta no Agenda Flow</li>
              <li>Vá até "Minhas Reservas"</li>
              <li>Selecione o agendamento desejado</li>
              <li>Clique em "Cancelar e Solicitar Reembolso"</li>
              <li>Informe o motivo do cancelamento</li>
            </ol>

            <h3>4.2. Prazo de Processamento</h3>
            <ul>
              <li>
                <strong>Análise da solicitação:</strong> Até 2 dias úteis
              </li>
              <li>
                <strong>Processamento do reembolso:</strong> Até 7 dias úteis após aprovação
              </li>
              <li>
                <strong>Estorno no cartão:</strong> Até 2 faturas do cartão de crédito,
                conforme operadora
              </li>
            </ul>

            <h3>4.3. Métodos de Reembolso</h3>
            <p>
              O reembolso será processado através do mesmo método de pagamento utilizado na
              compra. Não é possível alterar o método de reembolso.
            </p>
          </section>

          <section>
            <h2>5. Créditos em Conta</h2>
            <p>
              Em alguns casos, o estabelecimento pode oferecer créditos em conta como
              alternativa ao reembolso:
            </p>
            <ul>
              <li>Os créditos têm validade de 6 meses</li>
              <li>Podem ser usados em qualquer serviço do estabelecimento</li>
              <li>Não são transferíveis ou reembolsáveis em dinheiro</li>
            </ul>
          </section>

          <section>
            <h2>6. Exceções</h2>
            <p>Não são reembolsáveis:</p>
            <ul>
              <li>Produtos físicos já utilizados</li>
              <li>Serviços já prestados</li>
              <li>Vouchers e gift cards (seguem regras específicas)</li>
              <li>Promoções especiais com desconto acima de 50%</li>
            </ul>
          </section>

          <section>
            <h2>7. Direitos do Consumidor</h2>
            <p>
              Esta política não afeta seus direitos como consumidor previstos no Código de
              Defesa do Consumidor e demais legislações aplicáveis. Em caso de dúvidas ou
              disputas, você pode:
            </p>
            <ul>
              <li>Contactar nosso suporte: suporte@agendaflow.com</li>
              <li>Acionar os órgãos de defesa do consumidor</li>
              <li>Buscar resolução através de mediação ou arbitragem</li>
            </ul>
          </section>

          <section>
            <h2>8. Alterações nesta Política</h2>
            <p>
              Esta política pode ser atualizada periodicamente. Alterações significativas
              serão comunicadas por email e no sistema. O uso continuado dos serviços após
              alterações constitui aceitação da nova política.
            </p>
          </section>

          <section>
            <h2>9. Contato</h2>
            <p>Para questões sobre reembolsos:</p>
            <ul>
              <li>Email: suporte@agendaflow.com</li>
              <li>Telefone: +351 123 456 789</li>
              <li>Horário: Segunda a Sexta, 9h às 18h</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reembolso;
