import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Briefcase, Star } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const { isBusinessOwner, isAdmin } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (isAdmin) {
    navigate("/admin");
    return null;
  }

  if (isBusinessOwner) {
    navigate("/business");
    return null;
  }

  return (
    <AppLayout title="Início">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bem-vindo ao Agenda Flow</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus agendamentos de forma simples e eficiente
          </p>
        </div>

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
    </AppLayout>
  );
};

export default Home;
