import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Briefcase, TrendingUp, DollarSign } from "lucide-react";
import { ProfessionalClients } from "@/components/professional/ProfessionalClients";

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const { isProfessional, loading } = useUserRole();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    revenue: 0,
    clientsCount: 0,
  });

  useEffect(() => {
    if (!loading && !isProfessional) {
      navigate("/dashboard");
    }
  }, [isProfessional, loading, navigate]);

  useEffect(() => {
    const fetchProfessionalData = async () => {
      if (!user) return;

      const { data: profData } = await supabase
        .from("professionals")
        .select("*, businesses(name)")
        .eq("user_id", user.id)
        .single();

      if (profData) {
        setProfessional(profData);

        const { count: appointmentsCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("professional_id", profData.id);

        const { count: completedCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("professional_id", profData.id)
          .eq("status", "completed");

        const { data: revenueData } = await supabase
          .from("appointments")
          .select("payment_amount")
          .eq("professional_id", profData.id)
          .eq("payment_status", "paid");

        const totalRevenue = revenueData?.reduce(
          (sum, app) => sum + (app.payment_amount || 0),
          0
        ) || 0;

        const { count: clientsCount } = await supabase
          .from("professional_clients")
          .select("*", { count: "exact", head: true })
          .eq("professional_id", profData.id);

        setStats({
          totalAppointments: appointmentsCount || 0,
          completedAppointments: completedCount || 0,
          revenue: totalRevenue,
          clientsCount: clientsCount || 0,
        });
      }
    };

    if (isProfessional) {
      fetchProfessionalData();
    }
  }, [user, isProfessional]);

  if (loading || !professional) return null;

  return (
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAppointments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.revenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clientsCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="promotions">Promoções</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <ProfessionalClients professionalId={professional.id} />
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promoções</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade de promoções em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalDashboard;
