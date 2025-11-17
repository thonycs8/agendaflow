import { Shield, Briefcase, Users, User } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserRole, UserRole } from "@/hooks/use-user-role";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const AdminRoleMenu = () => {
  const { roleOverride, setAdminRoleOverride } = useUserRole();

  const handleRoleSwitch = (role: UserRole | null) => {
    setAdminRoleOverride(role);
    
    const roleLabels = {
      admin: "Admin",
      business_owner: "Proprietário",
      professional: "Profissional",
      client: "Cliente",
    };
    
    const label = role ? roleLabels[role] : "Admin (padrão)";
    toast.success(`Visualizando como ${label}`);
    window.location.reload();
  };

  const currentRoleLabel = roleOverride 
    ? roleOverride === "business_owner" ? "Proprietário" 
      : roleOverride === "professional" ? "Profissional"
      : roleOverride === "client" ? "Cliente"
      : "Admin"
    : "Admin";

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer">
          <Shield className="mr-2 h-4 w-4" />
          <span>Ver como: {currentRoleLabel}</span>
          {roleOverride && (
            <Badge variant="outline" className="ml-auto text-xs">
              Teste
            </Badge>
          )}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="bg-background border-border">
          <DropdownMenuItem 
            onClick={() => handleRoleSwitch(null)}
            className="cursor-pointer"
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin (padrão)
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleRoleSwitch("business_owner")}
            className="cursor-pointer"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Proprietário
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleRoleSwitch("professional")}
            className="cursor-pointer"
          >
            <Users className="mr-2 h-4 w-4" />
            Profissional
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleRoleSwitch("client")}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Cliente
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
    </>
  );
};
