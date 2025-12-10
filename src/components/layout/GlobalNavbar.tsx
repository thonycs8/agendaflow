import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole, UserRole } from "@/hooks/use-user-role";
import {
  Menu,
  Home,
  LogOut,
  Settings,
  Calendar,
  Users,
  Briefcase,
  BarChart3,
  Shield,
  Building2,
  DollarSign,
  FileText,
  User,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface NavLink {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const GlobalNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const {
    isAdmin,
    isBusinessOwner,
    isProfessional,
    loading,
    actualIsAdmin,
    roleOverride,
    setAdminRoleOverride,
  } = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Sessão encerrada");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao sair");
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getNavLinks = (): NavLink[] => {
    if (!user) return [];

    if (isAdmin) {
      return [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin#usuarios", label: "Usuários", icon: Users },
        { to: "/admin#negocios", label: "Negócios", icon: Building2 },
        { to: "/admin#landing", label: "Landing Page", icon: FileText },
      ];
    }

    if (isBusinessOwner) {
      return [
        { to: "/business", label: "Dashboard", icon: LayoutDashboard },
        { to: "/profile", label: "Perfil", icon: User },
      ];
    }

    if (isProfessional) {
      return [
        { to: "/professional", label: "Dashboard", icon: LayoutDashboard },
        { to: "/agenda", label: "Agenda", icon: Calendar },
        { to: "/professional/services", label: "Meus Serviços", icon: Briefcase },
        { to: "/professional/clientes", label: "Meus Clientes", icon: Users },
      ];
    }

    // Cliente
    return [
      { to: "/home", label: "Início", icon: Home },
      { to: "/servicos", label: "Serviços", icon: Briefcase },
      { to: "/profissionais", label: "Profissionais", icon: Users },
      { to: "/agenda", label: "Minha Agenda", icon: Calendar },
    ];
  };

  const handleRoleSwitch = (role: UserRole | null) => {
    setAdminRoleOverride(role);
    const roleLabel =
      role === "business_owner"
        ? "Proprietário"
        : role === "professional"
        ? "Profissional"
        : role === "client"
        ? "Cliente"
        : "Admin";
    toast.success(`Visualizando como ${roleLabel}`);
    navigate(
      role === "business_owner"
        ? "/business"
        : role === "professional"
        ? "/professional"
        : role === "client"
        ? "/home"
        : "/admin"
    );
  };

  const getRoleLabel = () => {
    if (roleOverride) {
      return roleOverride === "business_owner"
        ? "Proprietário (teste)"
        : roleOverride === "professional"
        ? "Profissional (teste)"
        : roleOverride === "client"
        ? "Cliente (teste)"
        : "Admin";
    }
    if (isAdmin) return "Administrador";
    if (isBusinessOwner) return "Proprietário";
    if (isProfessional) return "Profissional";
    return "Cliente";
  };

  const navLinks = getNavLinks();

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "flex flex-col gap-2" : "flex items-center gap-1"}>
      {navLinks.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.to);
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => mobile && setIsOpen(false)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={user ? (isAdmin ? "/admin" : isBusinessOwner ? "/business" : isProfessional ? "/professional" : "/home") : "/"} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl hidden sm:inline">Agenda Flow</span>
        </Link>

        {/* Desktop Navigation */}
        {!loading && user && <div className="hidden md:block flex-1 px-8">
          <NavLinks />
        </div>}

        {/* User Menu */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm">{getRoleLabel()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>

                  {actualIsAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Trocar Visualização</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleRoleSwitch(null)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleSwitch("business_owner")}>
                        <Building2 className="mr-2 h-4 w-4" />
                        Proprietário
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleSwitch("professional")}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Profissional
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleSwitch("client")}>
                        <User className="mr-2 h-4 w-4" />
                        Cliente
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col gap-6 mt-6">
                    <div className="flex items-center gap-2 pb-4 border-b">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="font-bold">Agenda Flow</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {getRoleLabel()}
                    </div>
                    <NavLinks mobile />
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Criar Conta</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
