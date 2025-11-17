import { Link, useLocation, useNavigate } from "react-router-dom";
import { Calendar, Building2, LayoutDashboard, User, LogOut, Settings } from "lucide-react";
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
import { AdminRoleMenu } from "@/components/AdminRoleMenu";

export const UnifiedNavbar = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, isBusinessOwner, isProfessional, isClient, actualIsAdmin } = useUserRole();
  const [profile, setProfile] = useState(null);
  const [business, setBusiness] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isPublicPage = !user;

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [user]);

  useEffect(() => {
    if (!user || isAdmin) return;

    const loadBusiness = async () => {
      const { data: professional } = await supabase
        .from("professionals")
        .select("business_id, businesses(id, name, logo_url)")
        .eq("user_id", user.id)
        .single();

      if (professional?.businesses) {
        setBusiness(professional.businesses);
        return;
      }

      const { data: ownerBusiness } = await supabase.from("businesses").select("*").eq("owner_id", user.id).single();

      if (ownerBusiness) {
        setBusiness(ownerBusiness);
      }
    };

    loadBusiness();
  }, [user, isAdmin]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const showAgendaFlow = isAdmin || !business;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* LOGO */}
        <Link to={user ? "/home" : "/"} className="flex items-center gap-2">
          {showAgendaFlow ? (
            <>
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent hidden sm:block">
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
                <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
              <span className="text-lg font-bold hidden sm:block">{business?.name}</span>
            </>
          )}
        </Link>

        {/* LINKS */}
        <nav className="hidden md:flex gap-6">
          {isPublicPage && (
            <>
              <a href="#funcionalidades">Funcionalidades</a>
              <a href="#precos">Preços</a>
              <Link to="/blog">Blog</Link>
              <Link to="/contacto">Contacto</Link>
            </>
          )}

          {isClient && (
            <>
              <Link to="/home">Início</Link>
              <Link to="/servicos">Serviços</Link>
              <Link to="/profissionais">Profissionais</Link>
              <Link to="/agenda">Minha Agenda</Link>
            </>
          )}

          {isProfessional && (
            <>
              <Link to="/home">Início</Link>
              <Link to="/agenda">Agenda</Link>
            </>
          )}

          {isBusinessOwner && <Link to="/business">Meu Negócio</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
        </nav>

        {/* USER MENU */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" /> Perfil
                </Link>
              </DropdownMenuItem>

              {actualIsAdmin && <AdminRoleMenu />}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden md:flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Criar Conta</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
