import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Briefcase, 
  DollarSign, 
  CreditCard, 
  Settings,
  BarChart3,
  PackagePlus,
  Eye
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/business",
    icon: LayoutDashboard,
    section: "overview"
  },
  {
    title: "Agendamentos",
    url: "/business#agendamentos",
    icon: Calendar,
    section: "agendamentos"
  },
  {
    title: "Profissionais",
    url: "/business#profissionais",
    icon: Users,
    section: "profissionais"
  },
  {
    title: "Serviços",
    url: "/business#servicos",
    icon: Briefcase,
    section: "servicos"
  },
  {
    title: "Clientes",
    url: "/business#clientes",
    icon: Users,
    section: "clientes"
  },
  {
    title: "Planos",
    url: "/business#planos",
    icon: CreditCard,
    section: "planos"
  },
  {
    title: "Financeiro",
    url: "/business#financeiro",
    icon: DollarSign,
    section: "financeiro"
  },
  {
    title: "Analytics",
    url: "/business#analytics",
    icon: BarChart3,
    section: "analytics"
  },
  {
    title: "Configurações",
    url: "/business#configuracoes",
    icon: Settings,
    section: "configuracoes"
  },
  {
    title: "Página Pública",
    url: "/negocio/missao-design",
    icon: Eye,
    section: "public",
    external: true
  },
];

export const BusinessSidebar = () => {
  const location = useLocation();
  const hash = location.hash.replace("#", "") || "overview";

  const isActive = (section: string) => {
    if (section === "overview") {
      return location.pathname === "/business" && !location.hash;
    }
    return hash === section;
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.section)}
                  >
                    <Link to={item.url} target={item.external ? "_blank" : undefined}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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
