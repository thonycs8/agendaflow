import { Button } from "@/components/ui/button";
import { Calendar, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-barbershop.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent/30 to-background pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
              <Star className="h-4 w-4 fill-current" />
              <span>Plataforma nº1 em agendamentos</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Agendamentos{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Simples
              </span>
              {" "}para o Seu Negócio
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Pare de pagar caro por plataformas complexas. Gerencie agendamentos, clientes e pagamentos num só lugar. A partir de apenas 2,99€/mês.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup">
                  <Calendar className="h-5 w-5" />
                  Começar Agora
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="#precos">Ver Preços</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/admin">Acesso Admin</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/business">Dashboard Business</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <div className="text-sm">
                  <div className="font-semibold">+500</div>
                  <div className="text-muted-foreground">Negócios ativos</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary fill-current" />
                <div className="text-sm">
                  <div className="font-semibold">4.9/5</div>
                  <div className="text-muted-foreground">Avaliação média</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Espaço profissional moderno" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-medium p-4 max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">1.2K+</div>
                  <div className="text-sm text-muted-foreground">Agendamentos hoje</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
