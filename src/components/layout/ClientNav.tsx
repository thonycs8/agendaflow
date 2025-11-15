import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Menu, Home, User, LogOut, Briefcase, Users, CalendarCheck, Crown, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ClientNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const location = useLocation();
  const [business, setBusiness] = useState<any>(null);

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
    try {
      await signOut();
      toast.success("Sessão encerrada com sucesso");
    } catch (error) {
      toast.error("Erro ao encerrar sessão");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = () => (
    <>
      <Link 
        to="/home" 
        className={`text-sm font-medium transition-colors ${
          isActive("/home") 
            ? "text-foreground" 
            : "text-foreground/80 hover:text-foreground"
        }`}
      >
        Início
      </Link>
      <Link 
        to="/servicos" 
        className={`text-sm font-medium transition-colors ${
          isActive("/servicos") 
            ? "text-foreground" 
            : "text-foreground/80 hover:text-foreground"
        }`}
      >
        Serviços
      </Link>
      <Link 
        to="/profissionais" 
        className={`text-sm font-medium transition-colors ${
          isActive("/profissionais") 
            ? "text-foreground" 
            : "text-foreground/80 hover:text-foreground"
        }`}
      >
        Profissionais
      </Link>
      <Link 
        to="/agenda" 
        className={`text-sm font-medium transition-colors ${
          isActive("/agenda") 
            ? "text-foreground" 
            : "text-foreground/80 hover:text-foreground"
        }`}
      >
        Minha Agenda
      </Link>
      <Link 
        to="/assinaturas" 
        className={`text-sm font-medium transition-colors ${
          isActive("/assinaturas") 
            ? "text-foreground" 
            : "text-foreground/80 hover:text-foreground"
        }`}
      >
        Assinaturas
      </Link>
    </>
  );

  const showAgendaFlow = isAdmin || !business;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          {showAgendaFlow ? (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Agenda Flow
              </span>
            </>
          ) : (
            <>
              {business?.logo_url ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={business.logo_url} />
                  <AvatarFallback>
                    <Building2 className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
              )}
              <span className="text-xl font-bold text-foreground">
                {business?.name}
              </span>
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/home">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex flex-col gap-3">
                <Button 
                  variant={isActive("/home") ? "secondary" : "ghost"} 
                  asChild 
                  onClick={() => setIsOpen(false)}
                  className="justify-start"
                >
                  <Link to="/home">
                    <Home className="h-4 w-4 mr-2" />
                    Início
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/servicos") ? "secondary" : "ghost"} 
                  asChild 
                  onClick={() => setIsOpen(false)}
                  className="justify-start"
                >
                  <Link to="/servicos">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Serviços
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/profissionais") ? "secondary" : "ghost"} 
                  asChild 
                  onClick={() => setIsOpen(false)}
                  className="justify-start"
                >
                  <Link to="/profissionais">
                    <Users className="h-4 w-4 mr-2" />
                    Profissionais
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/agenda") ? "secondary" : "ghost"} 
                  asChild 
                  onClick={() => setIsOpen(false)}
                  className="justify-start"
                >
                  <Link to="/agenda">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Minha Agenda
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/assinaturas") ? "secondary" : "ghost"} 
                  asChild 
                  onClick={() => setIsOpen(false)}
                  className="justify-start"
                >
                  <Link to="/assinaturas">
                    <Crown className="h-4 w-4 mr-2" />
                    Assinaturas
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/profile") ? "secondary" : "ghost"} 
                  asChild 
                  onClick={() => setIsOpen(false)}
                  className="justify-start"
                >
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Link>
                </Button>
              </div>
              <div className="pt-4 border-t">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
