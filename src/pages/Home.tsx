import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Briefcase, Star, Crown, ArrowUp, ArrowDown, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientMembership {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  usage_count: number;
  max_usage: number | null;
  plan: {
    id: string;
    name: string;
    price: number;
    duration_days: number;
    description: string;
    services_included: any;
  } | null;
  business: {
    name: string;
  } | null;
}

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  description: string;
  services_included: any;
  business_id: string;
}

const Home = () => {
  const { user } = useAuth();
  const { isBusinessOwner, isAdmin } = useUserRole();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [memberships, setMemberships] = useState<ClientMembership[]>([]);
  const [availablePlans, setAvailablePlans] = useState<MembershipPlan[]>([]);
  const [loadingMemberships, setLoadingMemberships] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch client memberships
      const { data: membershipData, error: membershipError } = await supabase
        .from("client_memberships")
        .select(`
          id,
          status,
          start_date,
          end_date,
          usage_count,
          max_usage,
          plan:membership_plans(id, name, price, duration_days, description, services_included),
          business:businesses(name)
        `)
        .eq("client_id", user.id)
        .eq("status", "active");

      if (!membershipError && membershipData) {
        setMemberships(membershipData as unknown as ClientMembership[]);
      }

      // Fetch available plans for upgrade/downgrade
      const { data: plansData } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (plansData) {
        setAvailablePlans(plansData);
      }

      setLoadingMemberships(false);
    };

    fetchData();
  }, [user, navigate]);

  const handlePlanChange = async (planId: string, businessId: string, isUpgrade: boolean) => {
    // For now, show a toast - Stripe integration coming soon
    toast.info(
      isUpgrade ? "Upgrade de plano em breve!" : "Downgrade de plano em breve!",
      { description: "A integração com pagamentos será disponibilizada em breve." }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-2">
              Olá, {profile?.full_name?.split(' ')[0] || 'Bem-vindo'}! 👋
            </h1>
            <p className="text-lg opacity-90">
              Gerencie seus agendamentos de forma simples e eficiente
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/agenda")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Minha Agenda</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">agendamentos ativos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/servicos")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Serviços</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ver Todos</div>
              <p className="text-xs text-muted-foreground">serviços disponíveis</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/profissionais")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ver Todos</div>
              <p className="text-xs text-muted-foreground">profissionais ativos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/assinaturas")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Assinaturas</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ver Planos</div>
              <p className="text-xs text-muted-foreground">economize com planos</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Minhas Assinaturas
            </CardTitle>
            <CardDescription>
              Gerencie seus planos e assinaturas ativas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingMemberships ? (
              <div className="text-center py-4 text-muted-foreground">
                Carregando assinaturas...
              </div>
            ) : memberships.length === 0 ? (
              <div className="text-center py-6 space-y-4">
                <p className="text-muted-foreground">
                  Você ainda não possui nenhuma assinatura ativa.
                </p>
                <Button onClick={() => navigate("/assinaturas")}>
                  <Star className="h-4 w-4 mr-2" />
                  Ver Planos Disponíveis
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {memberships.map((membership) => {
                  const currentPlanPrice = membership.plan?.price || 0;
                  const businessPlans = availablePlans.filter(
                    (p) => membership.plan && availablePlans.some(ap => ap.business_id === membership.plan?.id)
                  );
                  
                  return (
                    <div
                      key={membership.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {membership.plan?.name || "Plano"}
                            </h3>
                            <Badge variant="default" className="bg-primary">
                              Ativo
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {membership.business?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            €{membership.plan?.price?.toFixed(2) || "0.00"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            /{membership.plan?.duration_days || 30} dias
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Início</p>
                          <p className="font-medium">{formatDate(membership.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expira</p>
                          <p className="font-medium">{formatDate(membership.end_date)}</p>
                        </div>
                        {membership.max_usage && (
                          <>
                            <div>
                              <p className="text-muted-foreground">Utilizações</p>
                              <p className="font-medium">
                                {membership.usage_count} / {membership.max_usage}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {membership.plan?.description && (
                        <p className="text-sm text-muted-foreground border-t pt-3">
                          {membership.plan.description}
                        </p>
                      )}

                      {/* Upgrade/Downgrade Options */}
                      <div className="border-t pt-4 space-y-3">
                        <p className="text-sm font-medium">Alterar Plano:</p>
                        <div className="flex flex-wrap gap-2">
                          {availablePlans
                            .filter((plan) => plan.id !== membership.plan?.id)
                            .slice(0, 3)
                            .map((plan) => {
                              const isUpgrade = plan.price > currentPlanPrice;
                              return (
                                <Button
                                  key={plan.id}
                                  variant={isUpgrade ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handlePlanChange(plan.id, plan.business_id, isUpgrade)}
                                  className="flex items-center gap-1"
                                >
                                  {isUpgrade ? (
                                    <ArrowUp className="h-3 w-3" />
                                  ) : (
                                    <ArrowDown className="h-3 w-3" />
                                  )}
                                  {plan.name} - €{plan.price.toFixed(2)}
                                </Button>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comece Agora</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Agende seu próximo serviço com apenas alguns cliques
            </p>
            <Button size="lg" className="w-full md:w-auto" onClick={() => navigate("/agendar")}>
              Agendar Serviço
            </Button>
          </CardContent>
        </Card>
    </div>
  );
};

export default Home;
