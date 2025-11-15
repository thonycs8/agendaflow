import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Calendar,
  Settings
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
    url: "/admin",
    icon: LayoutDashboard,
    section: "overview"
  },
  {
    title: "Negócios",
    url: "/admin#negocios",
    icon: Building2,
    section: "negocios"
  },
  {
    title: "Usuários",
    url: "/admin#usuarios",
    icon: Users,
    section: "usuarios"
  },
  {
    title: "Agendamentos",
    url: "/admin#agendamentos",
    icon: Calendar,
    section: "agendamentos"
  },
  {
    title: "Configurações",
    url: "/admin#configuracoes",
    icon: Settings,
    section: "configuracoes"
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const hash = location.hash.replace("#", "") || "overview";

  const isActive = (section: string) => {
    if (section === "overview") {
      return location.pathname === "/admin" && !location.hash;
    }
    return hash === section;
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.section)}
                  >
                    <Link to={item.url}>
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
