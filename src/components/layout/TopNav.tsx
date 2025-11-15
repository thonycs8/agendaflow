import { Calendar, Menu, HelpCircle, ChevronDown, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideMenu } from "./SideMenu";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopNavProps {
  title?: string;
  showMenuButton?: boolean;
}

export const TopNav = ({ title, showMenuButton = true }: TopNavProps) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
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

  const showAgendaFlow = isAdmin || !business;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <SideMenu />
              </SheetContent>
            </Sheet>
          )}
          
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
        </div>

        {title && (
          <h1 className="text-lg font-semibold hidden md:block">{title}</h1>
        )}

        <div className="flex items-center gap-2">
          <Button variant="hero" size="sm" asChild className="hidden md:flex">
            <Link to="/agendar">Agendar Serviço</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/faq">Central de Ajuda</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/termos">Termos de Uso</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/privacidade">Privacidade</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/gdpr">GDPR</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
