import { Link } from "react-router-dom";
import { Calendar, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AdminRoleMenu } from "./AdminRoleMenu";
import { useUserRole } from "@/hooks/use-user-role";

export const TopNav = () => {
  const { user, signOut } = useAuth();
  const { actualIsAdmin } = useUserRole();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Sessão encerrada com sucesso");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao encerrar sessão");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="md:inline-flex" />

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Calendar className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent hidden sm:inline">
            Agenda Flow
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm">
                  {user.email?.split('@')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background border-border">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Admin Role Switcher */}
              {actualIsAdmin && <AdminRoleMenu />}
              
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
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
        )}
      </div>
    </header>
  );
};
