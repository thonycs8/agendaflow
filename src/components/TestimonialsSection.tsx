import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Proprietário - Barbearia Premium",
    image: "/placeholder.svg",
    rating: 5,
    text: "O Agenda Flow transformou completamente a gestão da minha barbearia. Antes perdia tempo ao telefone, agora os clientes agendam online e eu foco no que importa: o serviço.",
    stats: "150+ agendamentos/mês",
  },
  {
    name: "Ana Rodrigues",
    role: "Gestora - Clínica de Estética",
    image: "/placeholder.svg",
    rating: 5,
    text: "A possibilidade de gerir 5 profissionais numa única plataforma por menos de 10€/mês é incrível. Os relatórios ajudam-me a tomar decisões estratégicas.",
    stats: "5 profissionais geridos",
  },
  {
    name: "João Martins",
    role: "CEO - Salão de Beleza Elite",
    image: "/placeholder.svg",
    rating: 5,
    text: "Os planos de assinatura aumentaram nossa receita recorrente em 40%. O sistema é intuitivo e o suporte é excelente.",
    stats: "+40% receita recorrente",
  },
  {
    name: "Maria Costa",
    role: "Proprietária - Nail Studio",
    image: "/placeholder.svg",
    rating: 5,
    text: "Setup em 5 minutos! Já estava a receber agendamentos no mesmo dia. A transferência de propriedade facilitou quando decidi focar noutros projetos.",
    stats: "Setup em 5 minutos",
  },
  {
    name: "Pedro Santos",
    role: "Gestor - Centro de Massagens",
    image: "/placeholder.svg",
    rating: 5,
    text: "As notificações automáticas reduziram as faltas em 60%. Nossos clientes adoram a facilidade de reagendar pelo sistema.",
    stats: "-60% faltas",
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const next = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quem Confia no Agenda Flow
          </h2>
          <p className="text-lg text-muted-foreground">
            Profissionais de todo o país já transformaram seus negócios
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="transition-all duration-500 ease-in-out">
            <Card className="shadow-strong">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={testimonials[currentIndex].image} />
                    <AvatarFallback className="text-lg">
                      {testimonials[currentIndex].name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{testimonials[currentIndex].name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-lg mb-6 leading-relaxed">
                  "{testimonials[currentIndex].text}"
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    {testimonials[currentIndex].stats}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prev}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={next}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlay(false);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Negócios Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50k+</div>
            <div className="text-sm text-muted-foreground">Agendamentos/Mês</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Avaliação Média</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Satisfação</div>
          </div>
        </div>
      </div>
    </section>
  );
};
