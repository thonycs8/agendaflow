import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  services_included: any;
  business_id: string;
  businesses?: {
    name: string;
  };
}

const Assinaturas = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*, businesses(name)")
        .eq("is_active", true)
        .order("price");

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planId: string) => {
    toast({
      title: "Em breve!",
      description: "A integração com Stripe será implementada em breve",
    });
  };

  const getPlanIcon = (index: number) => {
    if (index === 0) return Star;
    if (index === plans.length - 1) return Crown;
    return Check;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Torne-se Premium</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Economize tempo e dinheiro com nossos planos de assinatura mensal.
            Garanta seus horários favoritos e aproveite benefícios exclusivos.
          </p>
        </div>

        <div className="bg-gradient-primary text-primary-foreground rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">
            💎 Vantagens de ser Premium
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2 justify-center">
              <Check className="h-5 w-5" />
              <span>Economia de até 40%</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="h-5 w-5" />
              <span>Prioridade no agendamento</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="h-5 w-5" />
              <span>Cancelamento flexível</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando planos...</p>
          </div>
        ) : plans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum plano disponível no momento
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = getPlanIcon(index);
              const isPopular = index === 1; // Middle plan is popular

              return (
                <Card
                  key={plan.id}
                  className={`relative hover:shadow-xl transition-all ${
                    isPopular
                      ? "border-primary shadow-lg scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Mais Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center space-y-4 pt-8">
                    <div
                      className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center ${
                        isPopular
                          ? "bg-gradient-primary"
                          : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 ${
                          isPopular
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>

                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {plan.name}
                      </CardTitle>
                      {plan.businesses && (
                        <Badge variant="outline">{plan.businesses.name}</Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-4xl font-bold">
                        €{plan.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        por {plan.duration_days} dias
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {plan.description && (
                      <p className="text-sm text-muted-foreground text-center">
                        {plan.description}
                      </p>
                    )}

                    {plan.services_included &&
                      Array.isArray(plan.services_included) &&
                      plan.services_included.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Incluído:</p>
                          <ul className="space-y-2">
                            {plan.services_included.map((service: any, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>
                                  {typeof service === "string"
                                    ? service
                                    : service.name || "Serviço"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <Button
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      Assinar Agora
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Cancele a qualquer momento
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="bg-muted/50 border-none">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-center mb-4">
              Perguntas Frequentes
            </h3>
            <div className="space-y-3 text-sm max-w-2xl mx-auto">
              <div>
                <strong>Como funciona a cobrança?</strong>
                <p className="text-muted-foreground">
                  A cobrança é feita mensalmente de forma automática no seu
                  cartão de crédito.
                </p>
              </div>
              <div>
                <strong>Posso cancelar a qualquer momento?</strong>
                <p className="text-muted-foreground">
                  Sim! Você pode cancelar sua assinatura quando quiser, sem
                  multas ou taxas adicionais.
                </p>
              </div>
              <div>
                <strong>O que acontece com os créditos não utilizados?</strong>
                <p className="text-muted-foreground">
                  Os créditos não utilizados expiram no final do período de
                  assinatura, mas você sempre pode remarcar seus agendamentos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Assinaturas;
