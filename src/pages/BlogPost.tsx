import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";

const blogContent: Record<string, any> = {
  "caso-sucesso-barbearia-porto": {
    title: "Como a Barbearia Central do Porto Aumentou 40% a Receita com o Agenda Flow",
    date: "2024-01-15",
    readTime: "5 min",
    category: "Case de Sucesso",
    content: `
      <p>A Barbearia Central, localizada no coração do Porto, é um estabelecimento tradicional que serve a comunidade há mais de 15 anos. Com 4 profissionais e uma base fiel de clientes, enfrentavam desafios típicos de crescimento.</p>

      <h2>Os Desafios</h2>
      <p>Antes do Agenda Flow, a barbearia dependia de agendamentos por telefone e WhatsApp, resultando em:</p>
      <ul>
        <li>30% de taxa de faltas sem aviso prévio</li>
        <li>Horas perdidas em gestão manual de agenda</li>
        <li>Dificuldade em acompanhar receitas e comissões</li>
        <li>Perda de clientes por indisponibilidade telefónica</li>
      </ul>

      <h2>A Implementação</h2>
      <p>A transição para o Agenda Flow foi surpreendentemente simples. Em apenas 2 horas, toda a equipa estava treinada e o sistema estava operacional. Os clientes rapidamente adotaram o agendamento online.</p>

      <h2>Os Resultados em 3 Meses</h2>
      <ul>
        <li><strong>40% de aumento na receita</strong> através de melhor ocupação</li>
        <li><strong>Redução de 80% nas faltas</strong> graças aos lembretes automáticos</li>
        <li><strong>3 horas diárias economizadas</strong> em gestão administrativa</li>
        <li><strong>25% mais clientes novos</strong> pelo agendamento online 24/7</li>
      </ul>

      <h2>O Testemunho do Proprietário</h2>
      <blockquote>
        "O Agenda Flow transformou completamente o nosso negócio. Não só aumentámos a receita, como melhorámos a experiência dos nossos clientes e libertámos tempo para o que realmente importa - o atendimento." 
        <cite>- João Silva, Proprietário</cite>
      </blockquote>

      <h2>Próximos Passos</h2>
      <p>Com o sucesso alcançado, a Barbearia Central planeia abrir uma segunda unidade, usando o Agenda Flow para gerir ambos os estabelecimentos desde o primeiro dia.</p>
    `
  },
  "boas-praticas-agendamento": {
    title: "10 Boas Práticas para Otimizar Agendamentos no Seu Salão",
    date: "2024-01-10",
    readTime: "7 min",
    category: "Boas Práticas",
    content: `
      <p>A gestão eficiente de agendamentos é crucial para o sucesso de qualquer salão de beleza ou barbearia. Aqui estão as 10 melhores práticas para maximizar sua ocupação e satisfação dos clientes.</p>

      <h2>1. Ative Lembretes Automáticos</h2>
      <p>Envie lembretes por email e SMS 24h antes do agendamento. Isto reduz faltas em até 70% e demonstra profissionalismo.</p>

      <h2>2. Defina Políticas de Cancelamento Claras</h2>
      <p>Estabeleça um prazo mínimo para cancelamentos (ex: 6 horas) e comunique-o claramente. Use o sistema para aplicar automaticamente.</p>

      <h2>3. Ofereça Agendamento Online 24/7</h2>
      <p>Permita que clientes marquem serviços a qualquer hora. Estudos mostram que 60% dos agendamentos online acontecem fora do horário comercial.</p>

      <h2>4. Configure Intervalos Entre Serviços</h2>
      <p>Adicione 5-10 minutos entre agendamentos para limpeza e preparação. Isto evita atrasos em cascata.</p>

      <h2>5. Use Categorias de Serviços Inteligentes</h2>
      <p>Agrupe serviços similares e sugira complementares durante o agendamento para aumentar ticket médio.</p>

      <h2>6. Gerencie Horários de Pico</h2>
      <p>Identifique horários de maior procura e ajuste preços ou disponibilidade estrategicamente.</p>

      <h2>7. Implemente Sistema de Avaliações</h2>
      <p>Peça feedback após cada serviço. Isto aumenta a qualidade e gera prova social para novos clientes.</p>

      <h2>8. Crie Planos de Fidelidade</h2>
      <p>Ofereça vantagens a clientes frequentes através de planos de assinatura ou pacotes.</p>

      <h2>9. Analise Relatórios Regularmente</h2>
      <p>Revise métricas semanalmente: taxa de ocupação, receita por profissional, serviços mais populares.</p>

      <h2>10. Treine a Equipa</h2>
      <p>Certifique-se que todos dominam o sistema e entendem a importância de manter agendas atualizadas.</p>

      <h2>Conclusão</h2>
      <p>Implementar estas práticas com o Agenda Flow é simples e os resultados são imediatos. Comece hoje mesmo a otimizar o seu negócio.</p>
    `
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? blogContent[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="container">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Blog
              </Link>
            </Button>
          </div>
        </div>

        {/* Article Header */}
        <section className="py-12 bg-gradient-primary">
          <div className="container">
            <div className="max-w-4xl mx-auto text-primary-foreground">
              <div className="mb-4">
                <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {post.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString('pt-PT')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} de leitura</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="container">
            <article className="max-w-4xl mx-auto prose prose-lg prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-muted-foreground prose-p:leading-relaxed prose-ul:text-muted-foreground prose-li:my-2 prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic">
              <div dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(post.content, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                                 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre', 'cite'],
                  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
                  ALLOW_DATA_ATTR: false
                })
              }} />
            </article>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para Começar?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Experimente o Agenda Flow gratuitamente e veja os resultados no seu negócio
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">
                  Começar Grátis Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
