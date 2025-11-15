import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: "caso-sucesso-barbearia-porto",
    title: "Como a Barbearia Central do Porto Aumentou 40% a Receita com o Agenda Flow",
    excerpt: "Descubra como esta barbearia tradicional do Porto modernizou a gestão de agendamentos e multiplicou a receita em apenas 3 meses.",
    date: "2024-01-15",
    readTime: "5 min",
    category: "Case de Sucesso",
    image: "/placeholder.svg"
  },
  {
    id: "boas-praticas-agendamento",
    title: "10 Boas Práticas para Otimizar Agendamentos no Seu Salão",
    excerpt: "Aprenda as melhores estratégias para reduzir faltas, maximizar ocupação e aumentar a satisfação dos clientes.",
    date: "2024-01-10",
    readTime: "7 min",
    category: "Boas Práticas",
    image: "/placeholder.svg"
  },
  {
    id: "gestao-multiplos-profissionais",
    title: "Guia Completo: Gestão Eficiente de Múltiplos Profissionais",
    excerpt: "Dicas práticas para coordenar horários, comissões e performance quando tem vários profissionais no seu estabelecimento.",
    date: "2024-01-05",
    readTime: "6 min",
    category: "Gestão",
    image: "/placeholder.svg"
  },
  {
    id: "caso-sucesso-clinica-estetica",
    title: "Clínica de Estética em Lisboa Reduz 60% das Faltas com Lembretes Automáticos",
    excerpt: "Veja como a automação de lembretes transformou a taxa de comparecimento desta clínica de estética.",
    date: "2023-12-28",
    readTime: "4 min",
    category: "Case de Sucesso",
    image: "/placeholder.svg"
  },
  {
    id: "planos-recorrentes-guia",
    title: "Como Criar Planos de Assinatura que Seus Clientes Vão Adorar",
    excerpt: "Estratégias comprovadas para implementar planos recorrentes e aumentar a receita previsível do seu negócio.",
    date: "2023-12-20",
    readTime: "8 min",
    category: "Boas Práticas",
    image: "/placeholder.svg"
  },
  {
    id: "relatorios-financeiros",
    title: "Use Relatórios Financeiros para Tomar Melhores Decisões de Negócio",
    excerpt: "Aprenda a interpretar métricas chave e usar dados para crescer o seu negócio de forma sustentável.",
    date: "2023-12-15",
    readTime: "6 min",
    category: "Gestão",
    image: "/placeholder.svg"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-primary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Blog Agenda Flow
              </h1>
              <p className="text-xl opacity-90">
                Cases de sucesso, boas práticas e dicas para maximizar o potencial do seu negócio
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden hover:shadow-medium transition-all duration-300 group"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString('pt-PT')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <Button variant="ghost" className="group/btn p-0 h-auto" asChild>
                      <Link to={`/blog/${post.id}`}>
                        Ler mais
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para Transformar o Seu Negócio?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Junte-se aos profissionais que já estão a crescer com o Agenda Flow
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">
                  Começar Grátis
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

export default Blog;
