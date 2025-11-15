import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const NavLinks = () => (
    <>
      <Link to="/#funcionalidades" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
        Funcionalidades
      </Link>
      <Link to="/#precos" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
        Preços
      </Link>
      <Link to="/#contacto" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
        Contacto
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Calendar className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Agenda Flow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/profile">Perfil</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/home">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/signup">Começar Grátis</Link>
              </Button>
            </>
          )}
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
              <NavLinks />
              <div className="flex flex-col gap-3 pt-4 border-t">
                {user ? (
                  <>
                    <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/profile">Perfil</Link>
                    </Button>
                    <Button variant="hero" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/home">Dashboard</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button variant="hero" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/signup">Começar Grátis</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
