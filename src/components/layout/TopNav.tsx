import { Calendar, Menu, HelpCircle, ChevronDown } from "lucide-react";
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

interface TopNavProps {
  title?: string;
  showMenuButton?: boolean;
}

export const TopNav = ({ title, showMenuButton = true }: TopNavProps) => {
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent hidden sm:inline">
              Agenda Flow
            </span>
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
