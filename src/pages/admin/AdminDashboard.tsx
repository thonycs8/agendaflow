import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, LogOut, Calendar } from "lucide-react";
import AdminBusinessList from "@/components/admin/AdminBusinessList";
import AdminUserList from "@/components/admin/AdminUserList";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalUsers: 0,
    totalAppointments: 0,
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/login");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      const [businessesRes, usersRes, appointmentsRes] = await Promise.all([
        supabase.from("businesses").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalBusinesses: businessesRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalAppointments: appointmentsRes.count || 0,
      });
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Painel de Administração</h1>
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
              <CardTitle className="text-sm font-medium">Total de Negócios</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="businesses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="businesses">Negócios</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>
          <TabsContent value="businesses">
            <AdminBusinessList />
          </TabsContent>
          <TabsContent value="users">
            <AdminUserList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
