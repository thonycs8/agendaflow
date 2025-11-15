import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Briefcase, TrendingUp, DollarSign } from "lucide-react";
import { ProfessionalLayout } from "@/components/layout/ProfessionalLayout";

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const { isProfessional, loading } = useUserRole();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalServices: 0,
    avgRating: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    if (!loading && !isProfessional) {
      navigate("/login");
    }
  }, [isProfessional, loading, navigate]);

  useEffect(() => {
    const fetchProfessionalData = async () => {
      if (!user) return;

      const { data: professionalData } = await supabase
        .from("professionals")
        .select("*, businesses(name, logo_url)")
        .eq("user_id", user.id)
        .single();

      if (professionalData) {
        setProfessional(professionalData);

        const [appointmentsRes, servicesRes, transactionsRes] = await Promise.all([
          supabase
            .from("appointments")
            .select("id", { count: "exact", head: true })
            .eq("professional_id", professionalData.id),
          supabase
            .from("services")
            .select("id", { count: "exact", head: true })
            .eq("created_by_id", user.id),
          supabase
            .from("financial_transactions")
            .select("amount")
            .eq("professional_id", professionalData.id)
            .eq("type", "income")
            .gte("transaction_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        ]);

        const monthlyRevenue = transactionsRes.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        setStats({
          totalAppointments: appointmentsRes.count || 0,
          totalServices: servicesRes.count || 0,
          avgRating: professionalData.rating || 0,
          monthlyRevenue,
        });
      }
    };

    if (isProfessional) {
      fetchProfessionalData();
    }
  }, [user, isProfessional]);

  if (loading || !professional) return null;

  return (
    <ProfessionalLayout title="Dashboard">
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{professional.name}</h2>
          <p className="text-muted-foreground">
            {professional.businesses?.name || "Profissional"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">Total de atendimentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Serviços</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
              <p className="text-xs text-muted-foreground">Serviços cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Média de estrelas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{stats.monthlyRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Neste mês</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao seu Painel Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Aqui você pode gerir sua agenda, serviços e promoções. Use o menu lateral para navegar entre as diferentes seções.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProfessionalLayout>
  );
};

export default ProfessionalDashboard;
