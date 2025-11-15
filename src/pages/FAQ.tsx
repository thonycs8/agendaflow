import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Perguntas Frequentes</h1>
          <p className="text-muted-foreground mb-8">
            Encontre respostas para as dúvidas mais comuns sobre o Agenda Flow
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>Como funciona o Agenda Flow?</AccordionTrigger>
              <AccordionContent>
                O Agenda Flow é uma plataforma completa de gestão para salões e barbearias.
                Permite agendar serviços, gerenciar profissionais, controlar finanças e criar
                planos de fidelização para seus clientes. Tudo em um único sistema integrado.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Como faço para agendar um serviço?</AccordionTrigger>
              <AccordionContent>
                Após fazer login, você pode navegar até a página de Serviços, escolher o
                serviço desejado, selecionar o profissional e o horário disponível. O sistema
                confirmará automaticamente seu agendamento.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Posso cancelar um agendamento?</AccordionTrigger>
              <AccordionContent>
                Sim, você pode cancelar seus agendamentos através da página "Minhas Reservas"
                no menu do perfil. Verifique a política de cancelamento do estabelecimento,
                pois alguns podem ter prazos específicos para cancelamento sem cobrança.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>O que são os planos de assinatura?</AccordionTrigger>
              <AccordionContent>
                Os planos de assinatura (mensalidades) oferecem serviços recorrentes com
                desconto. Por exemplo, você pode assinar um plano mensal que inclui cortes de
                cabelo semanais a um preço fixo. É uma forma de economizar e garantir seu
                horário preferido.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Como funcionam os pagamentos?</AccordionTrigger>
              <AccordionContent>
                Aceitamos diversos métodos de pagamento através do Stripe. Para planos de
                assinatura, o pagamento é processado automaticamente todo mês. Para
                agendamentos avulsos, você pode pagar no momento do serviço ou online no ato
                da reserva.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Posso avaliar o serviço?</AccordionTrigger>
              <AccordionContent>
                Sim! Após receber o serviço, você pode deixar uma avaliação com estrelas (1 a
                5) e comentários sobre sua experiência. Isso ajuda outros clientes e também os
                profissionais a melhorarem continuamente.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>
                Como os profissionais gerenciam sua agenda?
              </AccordionTrigger>
              <AccordionContent>
                Profissionais têm acesso a um painel exclusivo onde podem visualizar todos os
                agendamentos, bloquear horários, definir disponibilidade e gerenciar seus
                serviços. O sistema evita conflitos automaticamente.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>
                Sou proprietário, como adiciono profissionais?
              </AccordionTrigger>
              <AccordionContent>
                No painel administrativo, acesse a seção "Profissionais" e clique em "Adicionar
                Profissional". Você pode definir nome, especialidades, tipos de contrato
                (comissão, salário fixo ou aluguel de cadeira) e serviços que cada profissional
                oferece.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>O Agenda Flow tem app mobile?</AccordionTrigger>
              <AccordionContent>
                O Agenda Flow é uma aplicação web responsiva, otimizada para funcionar
                perfeitamente em smartphones e tablets através do navegador. Não é necessário
                baixar nada, basta acessar pelo navegador do seu dispositivo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>Como entro em contato com o suporte?</AccordionTrigger>
              <AccordionContent>
                Você pode entrar em contato através da página de Contacto ou enviando um email
                para suporte@agendaflow.com. Nossa equipe responde em até 24 horas úteis.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
