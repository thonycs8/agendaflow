import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import AdminUserList from "@/components/admin/AdminUserList";
import AdminBusinessList from "@/components/admin/AdminBusinessList";
import AdminSettings from "./AdminSettings";
import { GlobalNav } from "@/components/layout/GlobalNav";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandingPageSections } from "@/components/admin/LandingPageSections";
import { FeatureComparisonManager } from "@/components/admin/FeatureComparisonManager";
import { TemplateManager } from "@/components/admin/TemplateManager";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalUsers: 0,
    totalAppointments: 0,
  });

  const activeTab = location.hash.replace("#", "") || "overview";

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

  if (loading) return null;

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case "negocios":
          return <AdminBusinessList />;
        case "usuarios":
          return <AdminUserList />;
        case "configuracoes":
          return <AdminSettings />;
        case "landing-page":
          return (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Gestão da Landing Page</h2>
                <p className="text-muted-foreground">
                  Edite seções, funcionalidades e templates da página inicial
                </p>
              </div>
              
              <Tabs defaultValue="sections" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="sections">Seções</TabsTrigger>
                  <TabsTrigger value="features">Funcionalidades</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sections" className="mt-6">
                  <LandingPageSections />
                </TabsContent>
                
                <TabsContent value="features" className="mt-6">
                  <FeatureComparisonManager />
                </TabsContent>
                
                <TabsContent value="templates" className="mt-6">
                  <TemplateManager />
                </TabsContent>
              </Tabs>
            </div>
          );
        default:
          return (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Visão Geral</h2>
                <p className="text-muted-foreground">
                  Gerencie todos os aspectos da plataforma
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Negócios</CardTitle>
                    <Building2 className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalBusinesses}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estabelecimentos cadastrados
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                    <Users className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Usuários registrados
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalAppointments}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reservas realizadas
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          );
      }
    })();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col">
        <GlobalNav />
        
        <div className="flex flex-1">
          <AdminSidebar />
          
          <main className="flex-1 overflow-auto">
            <div className="container py-6">
              <div className="flex items-center gap-2 mb-6 md:hidden">
                <SidebarTrigger />
                <h1 className="text-xl font-bold">Menu Admin</h1>
              </div>
              
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
