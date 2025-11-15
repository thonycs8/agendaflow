import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Menu, Home, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
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

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/") ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Início
      </Link>
      <Link
        to="/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/admin") ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Dashboard Admin
      </Link>
      <Link
        to="/blog"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/blog") ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Blog
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="font-bold text-xl">Agenda Flow</div>
          </Link>
          <Badge variant="destructive" className="ml-2">ADMIN</Badge>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
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
          ) : null}

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
                  <Badge variant="destructive">ADMIN</Badge>
                </div>
                <nav className="flex flex-col gap-4">
                  <NavLinks />
                </nav>
                {user && (
                  <div className="flex flex-col gap-2 pt-4 border-t">
                    <Link to="/" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Home className="h-4 w-4 mr-2" />
                        Home
                      </Button>
                    </Link>
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
