import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, TrendingUp, Clock } from "lucide-react";

export const CtaBanner = () => {
  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Users className="h-5 w-5" />
              <span className="text-sm font-semibold">500+ Profissionais</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-semibold">+40% Crescimento</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-semibold">Setup em 5min</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para Transformar o Seu Negócio?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a centenas de profissionais que já economizam tempo e aumentam receita com o Agenda Flow
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="secondary"
              size="lg"
              className="text-lg px-8 hover-scale shadow-strong"
              asChild
            >
              <Link to="/signup">
                Começar Grátis Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
              asChild
            >
              <Link to="/demo">Ver Demo ao Vivo</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm opacity-75">
            Sem cartão de crédito • Cancele quando quiser • Suporte em português
          </p>
        </div>
      </div>
    </section>
  );
};
