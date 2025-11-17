import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Developer from "./pages/Developer";
import GDPR from "./pages/GDPR";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import FAQ from "./pages/FAQ";
import Reembolso from "./pages/Reembolso";
import Contacto from "./pages/Contacto";
import BusinessPublic from "./pages/BusinessPublic";
import Servicos from "./pages/Servicos";
import Profissionais from "./pages/Profissionais";
import Agenda from "./pages/Agenda";
import Assinaturas from "./pages/Assinaturas";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Agendar from "./pages/Agendar";

// Protected pages
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";

// Business Owner
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessSettings from "./pages/business/BusinessSettings";
import AnalyticsDashboard from "./pages/business/AnalyticsDashboard";
import ClientsManagement from "./pages/business/ClientsManagement";
import FinancialManagement from "./pages/business/FinancialManagement";
import MembershipPlans from "./pages/business/MembershipPlans";

// Professional
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import ProfessionalServices from "./pages/professional/ProfessionalServices";

// Client
import ClientDashboard from "./pages/client/ClientDashboard";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const publicRoutes = ["/", "/login", "/signup", "/blog", "/developer", "/gdpr", "/privacidade", "/termos", "/faq", "/reembolso", "/contacto"];
  const isPublicRoute = publicRoutes.some(route => location.pathname === route || location.pathname.startsWith("/blog/") || location.pathname.startsWith("/negocio/"));

  if (isPublicRoute) {
    return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/gdpr" element={<GDPR />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/reembolso" element={<Reembolso />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/negocio/:slug" element={<BusinessPublic />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        {/* Protected Routes - Redirect based on role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Authenticated Users */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicos"
          element={
            <ProtectedRoute>
              <Servicos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profissionais"
          element={
            <ProtectedRoute>
              <Profissionais />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <Agenda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agendar"
          element={
            <ProtectedRoute>
              <Agendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assinaturas"
          element={
            <ProtectedRoute>
              <Assinaturas />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* Business Owner Routes */}
        <Route
          path="/business"
          element={
            <ProtectedRoute requiredRole="business_owner">
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/agenda"
          element={
            <ProtectedRoute requiredRole="business_owner">
              <Agenda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/clientes"
          element={
            <ProtectedRoute requiredRole="business_owner">
              <ClientsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/profissionais"
          element={
            <ProtectedRoute requiredRole="business_owner">
              <Profissionais />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/servicos"
          element={
            <ProtectedRoute requiredRole="business_owner">
              <Servicos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/financeiro"
          element={
            <ProtectedRoute requiredRole="business_owner">
              <FinancialManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/assinaturas"
          element={
            <ProtectedRoute requiredRole="business_owner">
              <MembershipPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/analytics"
          element={
            <ProtectedRoute requiredRole="business_owner">
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/configuracoes"
          element={
            <ProtectedRoute requiredRole="business_owner">
              <BusinessSettings />
            </ProtectedRoute>
          }
        />

        {/* Professional Routes */}
        <Route
          path="/professional"
          element={
            <ProtectedRoute requiredRole="professional">
              <ProfessionalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professional/services"
          element={
            <ProtectedRoute requiredRole="professional">
              <ProfessionalServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professional/clientes"
          element={
            <ProtectedRoute requiredRole="professional">
              <ClientsManagement />
            </ProtectedRoute>
          }
        />

        {/* Client Routes */}
        <Route
          path="/client"
          element={
            <ProtectedRoute requiredRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 - ADD ALL CUSTOM ROUTES ABOVE THIS */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
