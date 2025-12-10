import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BusinessServices from "@/components/business/BusinessServices";
import BusinessProfessionals from "@/components/business/BusinessProfessionals";
import BusinessAppointments from "@/components/business/BusinessAppointments";
import AnalyticsDashboard from "./AnalyticsDashboard";
import ClientsManagement from "./ClientsManagement";
import MembershipPlans from "./MembershipPlans";
import FinancialManagement from "./FinancialManagement";
import BusinessSettings from "./BusinessSettings";
import FeatureManagement from "./FeatureManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BusinessDashboard = () => {
  const { user } = useAuth();
  const { isBusinessOwner, loading } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [business, setBusiness] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalProfessionals: 0,
    averageRating: 0,
  });

  const activeTab = location.hash.replace("#", "") || "overview";

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

  if (loading || !business) return null;

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case "agendamentos":
          return <BusinessAppointments businessId={business.id} />;
        case "profissionais":
          return <BusinessProfessionals businessId={business.id} />;
        case "servicos":
          return <BusinessServices businessId={business.id} />;
        case "clientes":
          return <ClientsManagement />;
        case "planos":
          return <MembershipPlans />;
        case "financeiro":
          return <FinancialManagement />;
        case "analytics":
          return <AnalyticsDashboard />;
        case "funcionalidades":
          return <FeatureManagement embedded />;
        case "configuracoes":
          return <BusinessSettings />;
        default:
          return (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{business.name}</h2>
                <p className="text-muted-foreground">{business.category}</p>
              </div>

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
                    <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
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
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => navigate(`#${value}`)}>
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="agendamentos">Agenda</TabsTrigger>
          <TabsTrigger value="profissionais">Profissionais</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="planos">Assinaturas</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="funcionalidades">Funcionalidades</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessDashboard;
