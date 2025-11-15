import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Euro, TrendingUp, Users, Award, Briefcase } from "lucide-react";
import { format, startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth } from "date-fns";
import { pt } from "date-fns/locale";

interface DashboardStats {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayAppointments: number;
  totalClients: number;
  avgRating: number;
  topProfessionals: Array<{
    name: string;
    revenue: number;
    appointments: number;
  }>;
  topServices: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
}

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const { isBusinessOwner, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    todayAppointments: 0,
    totalClients: 0,
    avgRating: 0,
    topProfessionals: [],
    topServices: [],
  });
  const [businessId, setBusinessId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isBusinessOwner) {
      navigate("/login");
    }
  }, [isBusinessOwner, roleLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // Get business
      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (!business) {
        setLoading(false);
        return;
      }

      setBusinessId(business.id);

      const now = new Date();
      const todayStart = startOfDay(now);
      const weekStart = startOfWeek(now, { locale: pt });
      const monthStart = startOfMonth(now);

      // Revenue calculations
      const { data: todayTransactions } = await supabase
        .from("financial_transactions")
        .select("amount")
        .eq("business_id", business.id)
        .eq("type", "income")
        .gte("transaction_date", todayStart.toISOString());

      const { data: weekTransactions } = await supabase
        .from("financial_transactions")
        .select("amount")
        .eq("business_id", business.id)
        .eq("type", "income")
        .gte("transaction_date", weekStart.toISOString());

      const { data: monthTransactions } = await supabase
        .from("financial_transactions")
        .select("amount")
        .eq("business_id", business.id)
        .eq("type", "income")
        .gte("transaction_date", monthStart.toISOString());

      // Appointments today
      const { data: todayAppts, count: todayCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact" })
        .eq("business_id", business.id)
        .gte("appointment_date", todayStart.toISOString())
        .lte("appointment_date", endOfDay(now).toISOString());

      // Total unique clients
      const { data: clients } = await supabase
        .from("appointments")
        .select("client_id")
        .eq("business_id", business.id);

      const uniqueClients = new Set(clients?.map((a) => a.client_id) || []);

      // Business rating
      const { data: businessData } = await supabase
        .from("businesses")
        .select("rating")
        .eq("id", business.id)
        .single();

      // Top professionals by revenue
      const { data: professionalRevenue } = await supabase
        .from("financial_transactions")
        .select("professional_id, amount, professionals(name)")
        .eq("business_id", business.id)
        .eq("type", "income")
        .not("professional_id", "is", null);

      const profMap = new Map();
      professionalRevenue?.forEach((t: any) => {
        const id = t.professional_id;
        if (!profMap.has(id)) {
          profMap.set(id, {
            name: t.professionals?.name || "Unknown",
            revenue: 0,
            appointments: 0,
          });
        }
        profMap.get(id).revenue += Number(t.amount);
        profMap.get(id).appointments += 1;
      });

      const topProfs = Array.from(profMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Top services
      const { data: serviceData } = await supabase
        .from("appointments")
        .select("service_id, payment_amount, services(name)")
        .eq("business_id", business.id)
        .not("service_id", "is", null);

      const serviceMap = new Map();
      serviceData?.forEach((a: any) => {
        const id = a.service_id;
        if (!serviceMap.has(id)) {
          serviceMap.set(id, {
            name: a.services?.name || "Unknown",
            count: 0,
            revenue: 0,
          });
        }
        serviceMap.get(id).count += 1;
        serviceMap.get(id).revenue += Number(a.payment_amount || 0);
      });

      const topSvcs = Array.from(serviceMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        todayRevenue: todayTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        weekRevenue: weekTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        monthRevenue: monthTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        todayAppointments: todayCount || 0,
        totalClients: uniqueClients.size,
        avgRating: Number(businessData?.rating || 0),
        topProfessionals: topProfs,
        topServices: topSvcs,
      });

      setLoading(false);
    };

    fetchStats();
  }, [user]);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agenda Flow</h1>
          <p className="text-muted-foreground">Dashboard de Análise</p>
        </div>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mês</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{stats.todayRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClients}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Semana</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{stats.weekRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mês</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{stats.monthRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Profissionais</CardTitle>
            <CardDescription>Por receita gerada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProfessionals.map((prof, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{prof.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€{prof.revenue.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {prof.appointments} atendimentos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Serviços Mais Vendidos</CardTitle>
            <CardDescription>Por número de atendimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topServices.map((svc, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{svc.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{svc.count}x</div>
                    <div className="text-xs text-muted-foreground">
                      €{svc.revenue.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
