import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  ShoppingBag,
  UsersRound,
  DollarSign,
  Award,
  Megaphone,
  Settings,
  Eye,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/business" },
  { icon: Calendar, label: "Agenda do Negócio", path: "/business/agenda" },
  { icon: Users, label: "Profissionais", path: "/business/profissionais" },
  { icon: Briefcase, label: "Serviços", path: "/business/servicos" },
  { icon: ShoppingBag, label: "Produtos", path: "/business/produtos" },
  { icon: UsersRound, label: "Clientes (CRM)", path: "/business/clientes" },
  { icon: DollarSign, label: "Financeiro", path: "/business/financeiro" },
  { icon: Award, label: "Assinaturas", path: "/business/assinaturas" },
  { icon: Megaphone, label: "Promoções & Banners", path: "/business/promocoes" },
  { icon: Settings, label: "Configurações", path: "/business/configuracoes" },
  { icon: Eye, label: "Página Pública", path: "/business/preview" },
];

export const OwnerSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <span className="font-semibold text-sm">Painel do Proprietário</span>
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

      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
};
