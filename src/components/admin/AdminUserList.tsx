import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  roles: string[];
}

const AdminUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os usuários",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { data: rolesData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id);

          return {
            ...profile,
            roles: rolesData?.map((r) => r.role) || [],
          };
        })
      );

      setUsers(usersWithRoles);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Usuários Cadastrados</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{user.full_name}</h3>
              {user.phone && (
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Cadastrado em {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUserList;
