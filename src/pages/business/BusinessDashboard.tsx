import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Star, LogOut } from "lucide-react";
import BusinessServices from "@/components/business/BusinessServices";
import BusinessProfessionals from "@/components/business/BusinessProfessionals";
import BusinessAppointments from "@/components/business/BusinessAppointments";
import AnalyticsDashboard from "./AnalyticsDashboard";
import ClientsManagement from "./ClientsManagement";
import MembershipPlans from "./MembershipPlans";
import FinancialManagement from "./FinancialManagement";

const BusinessDashboard = () => {
  const { user, signOut } = useAuth();
  const { isBusinessOwner, loading } = useUserRole();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalProfessionals: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (!loading && !isBusinessOwner) {
      navigate("/login");
    }
  }, [isBusinessOwner, loading, navigate]);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) return;

      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (businessData) {
        setBusiness(businessData);

        const [appointmentsRes, professionalsRes] = await Promise.all([
          supabase
            .from("appointments")
            .select("id", { count: "exact", head: true })
            .eq("business_id", businessData.id),
          supabase
            .from("professionals")
            .select("id", { count: "exact", head: true })
            .eq("business_id", businessData.id),
        ]);

        setStats({
          totalAppointments: appointmentsRes.count || 0,
          totalProfessionals: professionalsRes.count || 0,
          averageRating: businessData.rating || 0,
        });
      }
    };

    if (isBusinessOwner) {
      fetchBusinessData();
    }
  }, [user, isBusinessOwner]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (loading || !business) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <p className="text-sm text-muted-foreground">{business.category}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
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
              <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProfessionals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)} ⭐</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Agenda</TabsTrigger>
            <TabsTrigger value="professionals">Profissionais</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="plans">Fidelização</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="appointments">
            <BusinessAppointments businessId={business.id} />
          </TabsContent>

          <TabsContent value="professionals">
            <BusinessProfessionals businessId={business.id} />
          </TabsContent>

          <TabsContent value="services">
            <BusinessServices businessId={business.id} />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsManagement />
          </TabsContent>

          <TabsContent value="plans">
            <MembershipPlans />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BusinessDashboard;
