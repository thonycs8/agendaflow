import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, UserCog, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserWithRoles {
  id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  roles: { role: string }[];
}

export const UserPrivileges = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone,
          created_at,
          user_roles(role)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const usersData = data?.map((user: any) => ({
        ...user,
        roles: user.user_roles || [],
      })) || [];
      
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const addRole = async (userId: string, role: "admin" | "business_owner" | "professional" | "client") => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role }]);

      if (error) {
        if (error.message.includes("duplicate")) {
          toast.error("Usuário já possui esta função");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Função adicionada com sucesso");
      fetchUsers();
      setSelectedRole({ ...selectedRole, [userId]: "" });
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("Erro ao adicionar função");
    }
  };

  const removeRole = async (userId: string, role: "admin" | "business_owner" | "professional" | "client") => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      toast.success("Função removida com sucesso");
      fetchUsers();
    } catch (error) {
      console.error("Error removing role:", error);
      toast.error("Erro ao remover função");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "business_owner":
        return "default";
      case "professional":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "business_owner":
        return "Proprietário";
      case "professional":
        return "Profissional";
      case "client":
        return "Cliente";
      default:
        return role;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <UserCog className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">{user.full_name}</CardTitle>
                  <CardDescription>
                    {user.phone || "Sem telefone"}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {user.roles.map((roleObj, idx) => (
                  <Badge key={idx} variant={getRoleBadgeVariant(roleObj.role)}>
                    {getRoleLabel(roleObj.role)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={selectedRole[user.id] || ""}
                onValueChange={(value) =>
                  setSelectedRole({ ...selectedRole, [user.id]: value })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Adicionar função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="business_owner">Proprietário</SelectItem>
                  <SelectItem value="professional">Profissional</SelectItem>
                  <SelectItem value="client">Cliente</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() =>
                  selectedRole[user.id] && addRole(user.id, selectedRole[user.id] as "admin" | "business_owner" | "professional" | "client")
                }
                disabled={!selectedRole[user.id]}
              >
                <Shield className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-2">
              {user.roles.map((roleObj, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border rounded-lg">
                  <span className="text-sm font-medium">
                    {getRoleLabel(roleObj.role)}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Função</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover a função "{getRoleLabel(roleObj.role)}" 
                          de {user.full_name}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeRole(user.id, roleObj.role as "admin" | "business_owner" | "professional" | "client")}
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
