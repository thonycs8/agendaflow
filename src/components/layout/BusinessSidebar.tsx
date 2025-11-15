import { useState, useEffect } from "react";
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
  Eye,
  ChevronLeft
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

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
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("business-sidebar-collapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("business-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const isActive = (section: string) => {
    if (section === "overview") {
      return location.pathname === "/business" && !location.hash;
    }
    return hash === section;
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? "64px" : "256px" }}
      className={cn("hidden md:flex flex-col border-r bg-background")}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-semibold text-sm"
          >
            Painel do Proprietário
          </motion.span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <Sidebar className="border-0">
        <SidebarContent>
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.section)}
                      title={collapsed ? item.title : undefined}
                    >
                      <Link to={item.url} target={item.external ? "_blank" : undefined}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </motion.aside>
  );
};
