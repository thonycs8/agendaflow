import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  Settings,
  BarChart3,
  Shield,
  FileText,
  UserCog,
  Building2,
  Scissors,
  DollarSign,
  Package,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserRole } from "@/hooks/use-user-role";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const AppSidebar = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const { isAdmin, isBusinessOwner, isProfessional, roleOverride, actualIsAdmin } = useUserRole();

  const isActive = (path: string) => location.pathname === path;

  // Admin Navigation
  const adminNavigation = [
    { title: "Dashboard", url: "/admin", icon: Shield },
    { title: "Usuários", url: "/admin#usuarios", icon: Users },
    { title: "Negócios", url: "/admin#negocios", icon: Building2 },
    { title: "Blog", url: "/admin#blog", icon: FileText },
    { title: "Landing Page", url: "/admin#landing-page", icon: Settings },
    { title: "Configurações", url: "/admin#configuracoes", icon: Settings },
  ];

  // Business Owner Navigation
  const businessNavigation = [
    { title: "Dashboard", url: "/business", icon: LayoutDashboard },
    { title: "Agenda", url: "/business/agenda", icon: Calendar },
    { title: "Clientes", url: "/business/clientes", icon: Users },
    { title: "Profissionais", url: "/business/profissionais", icon: UserCog },
    { title: "Serviços", url: "/business/servicos", icon: Scissors },
    { title: "Financeiro", url: "/business/financeiro", icon: DollarSign },
    { title: "Assinaturas", url: "/business/assinaturas", icon: Package },
    { title: "Analytics", url: "/business/analytics", icon: BarChart3 },
    { title: "Configurações", url: "/business/configuracoes", icon: Settings },
  ];

  // Professional Navigation
  const professionalNavigation = [
    { title: "Dashboard", url: "/professional", icon: LayoutDashboard },
    { title: "Meus Serviços", url: "/professional/services", icon: Scissors },
    { title: "Minha Agenda", url: "/agenda", icon: Calendar },
    { title: "Meus Clientes", url: "/professional/clientes", icon: Users },
    { title: "Configurações", url: "/profile", icon: Settings },
  ];

  // Client Navigation
  const clientNavigation = [
    { title: "Início", url: "/home", icon: LayoutDashboard },
    { title: "Agendar Serviço", url: "/agendar", icon: Calendar },
    { title: "Minha Agenda", url: "/agenda", icon: Calendar },
    { title: "Meu Perfil", url: "/profile", icon: Settings },
  ];

  // Determine which navigation to show
  let navigationItems = clientNavigation;
  let navigationLabel = "Cliente";

  if (isAdmin) {
    navigationItems = adminNavigation;
    navigationLabel = "Administração";
  } else if (isBusinessOwner) {
    navigationItems = businessNavigation;
    navigationLabel = "Meu Negócio";
  } else if (isProfessional) {
    navigationItems = professionalNavigation;
    navigationLabel = "Profissional";
  }

  return (
    <Sidebar className={cn(open ? "w-64" : "w-16")}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            {open && <span>{navigationLabel}</span>}
            {actualIsAdmin && roleOverride && open && (
              <Badge variant="outline" className="text-xs">
                Modo Teste
              </Badge>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
