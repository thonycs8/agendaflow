import { Calendar, User, LogOut, Settings, LayoutDashboard, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const GlobalNav = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, isBusinessOwner, isProfessional, isClient } = useUserRole();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!user || isAdmin) return;

      // Try to get business from professional
      const { data: professional } = await supabase
        .from("professionals")
        .select("business_id, businesses(id, name, logo_url)")
        .eq("user_id", user.id)
        .single();

      if (professional?.businesses) {
        setBusiness(professional.businesses);
        return;
      }

      // Try to get business from owner
      const { data: ownedBusiness } = await supabase
        .from("businesses")
        .select("id, name, logo_url")
        .eq("owner_id", user.id)
        .single();

      if (ownedBusiness) {
        setBusiness(ownedBusiness);
      }
    };

    fetchBusiness();
  }, [user, isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const showAgendaFlow = isAdmin || !business;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/home" className="flex items-center gap-2">
          {showAgendaFlow ? (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent hidden sm:inline">
                Agenda Flow
              </span>
            </>
          ) : (
            <>
              {business?.logo_url ? (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={business.logo_url} />
                  <AvatarFallback>
                    <Building2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
              <span className="text-lg font-bold text-foreground hidden sm:inline">
                {business?.name}
              </span>
            </>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {isClient && (
            <>
              <Link to="/home" className="text-sm font-medium hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/servicos" className="text-sm font-medium hover:text-primary transition-colors">
                Serviços
              </Link>
              <Link to="/profissionais" className="text-sm font-medium hover:text-primary transition-colors">
                Profissionais
              </Link>
              <Link to="/agenda" className="text-sm font-medium hover:text-primary transition-colors">
                Minha Agenda
              </Link>
            </>
          )}

          {isProfessional && (
            <>
              <Link to="/home" className="text-sm font-medium hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/agenda" className="text-sm font-medium hover:text-primary transition-colors">
                Agenda
              </Link>
            </>
          )}

          {isBusinessOwner && (
            <Link to="/business" className="text-sm font-medium hover:text-primary transition-colors">
              <Building2 className="h-4 w-4 inline mr-1" />
              Meu Negócio
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              <LayoutDashboard className="h-4 w-4 inline mr-1" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    {profile?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile?.full_name || "Usuário"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              {isBusinessOwner && (
                <DropdownMenuItem asChild>
                  <Link to="/business" className="cursor-pointer">
                    <Building2 className="mr-2 h-4 w-4" />
                    Meu Negócio
                  </Link>
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
