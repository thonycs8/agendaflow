import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole, UserRole } from "@/hooks/use-user-role";
import { Menu, Home, LogOut, Settings, Calendar, Users, Briefcase, BarChart3, Shield } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UniversalNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin, isBusinessOwner, isProfessional, loading, actualIsAdmin, roleOverride, setAdminRoleOverride } = useUserRole();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Sessão encerrada com sucesso");
    } catch (error) {
      toast.error("Erro ao encerrar sessão");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const getNavLinks = () => {
    const links = [
      { to: "/", label: "Início", icon: Home, show: true },
    ];

    if (isAdmin) {
      links.push(
        { to: "/admin", label: "Admin Dashboard", icon: Shield, show: true },
        { to: "/blog", label: "Blog", icon: BarChart3, show: true }
      );
    }

    if (isBusinessOwner) {
      links.push(
        { to: "/business", label: "Meu Negócio", icon: Briefcase, show: true },
        { to: "/business/agenda", label: "Agenda", icon: Calendar, show: true },
        { to: "/business/clientes", label: "Clientes", icon: Users, show: true }
      );
    }

    if (isProfessional) {
      links.push(
        { to: "/professional", label: "Meu Painel", icon: Briefcase, show: true },
        { to: "/professional/services", label: "Meus Serviços", icon: Settings, show: true }
      );
    }

    if (user && !isAdmin && !isBusinessOwner && !isProfessional) {
      // Client links - only for authenticated clients
      links.push(
        { to: "/agendar", label: "Agendar Serviço", icon: Calendar, show: true },
        { to: "/agenda", label: "Minha Agenda", icon: Calendar, show: true }
      );
    }

    return links.filter(link => link.show);
  };

  const handleRoleSwitch = (role: UserRole | null) => {
    setAdminRoleOverride(role);
    toast.success(`Visualizando como ${role === "business_owner" ? "Proprietário" : role === "professional" ? "Profissional" : role === "client" ? "Cliente" : "Admin"}`);
    window.location.reload();
  };

  const getUserBadge = () => {
    if (!actualIsAdmin) {
      // Non-admin users see their actual role
      if (isAdmin) return <Badge variant="destructive">ADMIN</Badge>;
      if (isBusinessOwner) return <Badge variant="default">PROPRIETÁRIO</Badge>;
      if (isProfessional) return <Badge variant="secondary">PROFISSIONAL</Badge>;
      return <Badge variant="outline">CLIENTE</Badge>;
    }

    // Admin users see a dropdown to switch roles
    const currentRoleLabel = roleOverride 
      ? roleOverride === "business_owner" ? "PROPRIETÁRIO (teste)" 
        : roleOverride === "professional" ? "PROFISSIONAL (teste)"
        : roleOverride === "client" ? "CLIENTE (teste)"
        : "ADMIN"
      : "ADMIN";

    const currentVariant = roleOverride
      ? roleOverride === "business_owner" ? "default"
        : roleOverride === "professional" ? "secondary"
        : roleOverride === "client" ? "outline"
        : "destructive"
      : "destructive";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge variant={currentVariant} className="cursor-pointer hover:opacity-80">
            {currentRoleLabel} ▾
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleRoleSwitch(null)}>
            <Shield className="mr-2 h-4 w-4" />
            Admin (padrão)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleSwitch("business_owner")}>
            <Briefcase className="mr-2 h-4 w-4" />
            Proprietário
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleSwitch("professional")}>
            <Users className="mr-2 h-4 w-4" />
            Profissional
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleSwitch("client")}>
            <Calendar className="mr-2 h-4 w-4" />
            Cliente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const navLinks = getNavLinks();

  const NavLinks = () => (
    <>
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
              isActive(link.to) ? "text-foreground" : "text-muted-foreground"
            )}
            onClick={() => setIsOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </>
  );

  if (loading) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="font-bold text-xl">Agenda Flow</div>
          </Link>
          {user && getUserBadge()}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  Perfil
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="hidden sm:inline-flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                Entrar
              </Button>
            </Link>
          )}

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
                  <span className="font-bold text-lg">Agenda Flow</span>
                  {user && getUserBadge()}
                </div>
                <nav className="flex flex-col gap-4">
                  <NavLinks />
                </nav>
                {user && (
                  <div className="flex flex-col gap-2 pt-4 border-t">
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        Perfil
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
