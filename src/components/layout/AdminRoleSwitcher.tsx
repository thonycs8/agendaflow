import { useUserRole, UserRole } from "@/hooks/use-user-role";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, User, Briefcase, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const roleConfig = {
  admin: {
    label: "Admin",
    icon: Shield,
    color: "destructive" as const,
  },
  business_owner: {
    label: "Proprietário",
    icon: Briefcase,
    color: "default" as const,
  },
  professional: {
    label: "Profissional",
    icon: Users,
    color: "secondary" as const,
  },
  client: {
    label: "Cliente",
    icon: User,
    color: "outline" as const,
  },
};

export const AdminRoleSwitcher = () => {
  const { actualIsAdmin, roleOverride, setAdminRoleOverride, actualRoles } = useUserRole();

  if (!actualIsAdmin) return null;

  const currentView = roleOverride || (actualRoles[0] as UserRole);
  const CurrentIcon = roleConfig[currentView].icon;

  return (
    <div className="flex items-center gap-2">
      {roleOverride && (
        <Badge variant="outline" className="text-xs">
          Modo Teste
        </Badge>
      )}
      
      <Select
        value={roleOverride || "admin"}
        onValueChange={(value) => {
          if (value === "admin") {
            setAdminRoleOverride(null);
          } else {
            setAdminRoleOverride(value as UserRole);
          }
          // Reload to apply new role view
          window.location.reload();
        }}
      >
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Ver como Admin</span>
            </div>
          </SelectItem>
          <SelectItem value="business_owner">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Ver como Proprietário</span>
            </div>
          </SelectItem>
          <SelectItem value="professional">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Ver como Profissional</span>
            </div>
          </SelectItem>
          <SelectItem value="client">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Ver como Cliente</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
