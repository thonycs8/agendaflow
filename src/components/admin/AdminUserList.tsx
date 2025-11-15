import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, UserCog, Users, Building2, Briefcase, Shield } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  roles: string[];
}

type UserRole = "admin" | "business_owner" | "professional" | "client";

const AdminUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const roleOptions: { value: UserRole; label: string; icon: any }[] = [
    { value: "admin", label: "Administrador", icon: Shield },
    { value: "business_owner", label: "Proprietário", icon: Building2 },
    { value: "professional", label: "Profissional", icon: Briefcase },
    { value: "client", label: "Cliente", icon: Users },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = users.filter(
        (user) =>
          user.full_name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [search, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: authData } = await supabase.auth.admin.listUsers();

      const usersWithRoles = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { data: rolesData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id);

          const authUser = authData?.users?.find((user: any) => user.id === profile.id);

          return {
            ...profile,
            email: authUser?.email || "",
            roles: rolesData?.map((r) => r.role) || [],
          };
        })
      );

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles as UserRole[]);
    setIsDialogOpen(true);
  };

  const handleRoleToggle = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const saveRoles = async () => {
    if (!selectedUser) return;

    try {
      await supabase.from("user_roles").delete().eq("user_id", selectedUser.id);

      if (selectedRoles.length > 0) {
        const rolesToInsert = selectedRoles.map((role) => ({
          user_id: selectedUser.id,
          role,
        }));

        const { error } = await supabase
          .from("user_roles")
          .insert(rolesToInsert);

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Roles atualizados com sucesso",
      });

      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving roles:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os roles",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "business_owner":
        return "bg-primary/10 text-primary border-primary/20";
      case "professional":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "client":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "";
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

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.roles.includes("admin")).length,
    owners: users.filter((u) => u.roles.includes("business_owner")).length,
    professionals: users.filter((u) => u.roles.includes("professional")).length,
    clients: users.filter((u) => u.roles.includes("client")).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Gestão de Usuários</h2>
        <p className="text-muted-foreground">
          Gerencie usuários e seus níveis de acesso na plataforma
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proprietários</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.owners}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.professionals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {search ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <Badge key={role} className={getRoleColor(role)}>
                            {getRoleLabel(role)}
                          </Badge>
                        ))}
                        {user.roles.length === 0 && (
                          <Badge variant="outline">Sem role</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoleDialog(user)}
                      >
                        <UserCog className="h-4 w-4 mr-2" />
                        Gerenciar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Roles - {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Selecione os níveis de acesso para este usuário:
            </p>
            {roleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={option.value}
                    checked={selectedRoles.includes(option.value)}
                    onCheckedChange={() => handleRoleToggle(option.value)}
                  />
                  <Label
                    htmlFor={option.value}
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </Label>
                </div>
              );
            })}
            <div className="flex gap-2 pt-4">
              <Button onClick={saveRoles} className="flex-1">
                Salvar Alterações
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserList;
