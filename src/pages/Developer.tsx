import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Code2, Palette, Rocket, Users } from "lucide-react";

const Developer = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Missão Design
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transformando ideias em experiências digitais memoráveis
            </p>
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
              <a 
                href="https://missaodesign.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Visitar Website
              </a>
            </Button>
          </div>

          {/* About Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Sobre a Missão Design</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                A Missão Design é uma agência especializada em desenvolvimento web e design digital, 
                com foco em criar soluções inovadoras que impulsionam o crescimento dos negócios.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Com uma abordagem centrada no usuário e expertise em tecnologias modernas, 
                desenvolvemos aplicações web responsivas, intuitivas e de alto desempenho que 
                ajudam empresas a alcançar seus objetivos digitais.
              </p>
            </div>
          </section>

          {/* Services Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Nossos Serviços</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border/40 bg-card hover:shadow-elegant transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shrink-0">
                    <Code2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Desenvolvimento Web</h3>
                    <p className="text-muted-foreground">
                      Criação de aplicações web modernas utilizando as melhores tecnologias 
                      como React, TypeScript e frameworks modernos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border/40 bg-card hover:shadow-elegant transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shrink-0">
                    <Palette className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Design UI/UX</h3>
                    <p className="text-muted-foreground">
                      Design de interfaces intuitivas e experiências de usuário que 
                      convertem visitantes em clientes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border/40 bg-card hover:shadow-elegant transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shrink-0">
                    <Rocket className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Otimização & Performance</h3>
                    <p className="text-muted-foreground">
                      Garantimos aplicações rápidas e otimizadas para todos os 
                      dispositivos e navegadores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border/40 bg-card hover:shadow-elegant transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shrink-0">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Consultoria Digital</h3>
                    <p className="text-muted-foreground">
                      Orientação estratégica para transformação digital e crescimento 
                      sustentável do seu negócio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center p-8 rounded-lg bg-muted/30 border border-border/40">
            <h2 className="text-3xl font-bold mb-4">Tem um Projeto em Mente?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Entre em contato conosco para discutir como podemos ajudar a transformar 
              sua visão em realidade digital.
            </p>
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
              <a 
                href="https://missaodesign.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Fale Conosco
              </a>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Developer;
