import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

interface ProfessionalClient {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_address: string | null;
  share_with_business: boolean;
  notes: string | null;
}

export const ProfessionalClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<ProfessionalClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ProfessionalClient | null>(null);

  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    client_address: "",
    share_with_business: false,
    notes: "",
  });

  useEffect(() => {
    fetchProfessionalId();
  }, [user]);

  useEffect(() => {
    if (professionalId) {
      fetchClients();
    }
  }, [professionalId]);

  const fetchProfessionalId = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("professionals")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching professional:", error);
      return;
    }

    setProfessionalId(data.id);
  };

  const fetchClients = async () => {
    if (!professionalId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("professional_clients")
      .select("*")
      .eq("professional_id", professionalId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar clientes");
      console.error(error);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const handleCreateClient = async () => {
    if (!professionalId) return;

    // Find or create user first
    const { data: existingUsers, error: userError } = await supabase.auth.admin.listUsers();
    
    let clientUserId: string | null = null;
    
    // Check if user exists with this email
    if (existingUsers) {
      const foundUser = existingUsers.users.find((u: any) => u.email === formData.client_email);
      if (foundUser) {
        clientUserId = foundUser.id;
      }
    }

    // If user doesn't exist, we'll need to create a temporary reference
    // In production, you'd want to handle this differently
    if (!clientUserId) {
      toast.error("Cliente deve ser um usuário registrado no sistema");
      return;
    }

    const { error } = await supabase.from("professional_clients").insert({
      professional_id: professionalId,
      client_id: clientUserId,
      ...formData,
    });

    if (error) {
      toast.error("Erro ao adicionar cliente");
      console.error(error);
    } else {
      toast.success("Cliente adicionado com sucesso");
      setIsCreateOpen(false);
      resetForm();
      fetchClients();
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;

    const { error } = await supabase
      .from("professional_clients")
      .update({
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        client_address: formData.client_address,
        share_with_business: formData.share_with_business,
        notes: formData.notes,
      })
      .eq("id", editingClient.id);

    if (error) {
      toast.error("Erro ao atualizar cliente");
      console.error(error);
    } else {
      toast.success("Cliente atualizado com sucesso");
      setEditingClient(null);
      resetForm();
      fetchClients();
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    const { error } = await supabase
      .from("professional_clients")
      .delete()
      .eq("id", clientId);

    if (error) {
      toast.error("Erro ao remover cliente");
      console.error(error);
    } else {
      toast.success("Cliente removido com sucesso");
      fetchClients();
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_email: "",
      client_phone: "",
      client_address: "",
      share_with_business: false,
      notes: "",
    });
  };

  const openEditDialog = (client: ProfessionalClient) => {
    setEditingClient(client);
    setFormData({
      client_name: client.client_name,
      client_email: client.client_email,
      client_phone: client.client_phone || "",
      client_address: client.client_address || "",
      share_with_business: client.share_with_business,
      notes: client.notes || "",
    });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Minha Carteira de Clientes</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client_name">Nome Completo *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) =>
                      setFormData({ ...formData, client_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="client_email">Email *</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) =>
                      setFormData({ ...formData, client_email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="client_phone">Telefone</Label>
                  <Input
                    id="client_phone"
                    value={formData.client_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, client_phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="client_address">Endereço</Label>
                  <Input
                    id="client_address"
                    value={formData.client_address}
                    onChange={(e) =>
                      setFormData({ ...formData, client_address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="share_with_business"
                    checked={formData.share_with_business}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, share_with_business: checked })
                    }
                  />
                  <Label htmlFor="share_with_business">
                    Compartilhar com o estabelecimento
                  </Label>
                </div>
                <Button onClick={handleCreateClient} className="w-full">
                  Adicionar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Compartilhado</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.client_name}</TableCell>
                <TableCell>{client.client_email}</TableCell>
                <TableCell>{client.client_phone || "-"}</TableCell>
                <TableCell>{client.share_with_business ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(client)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Cliente</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit_client_name">Nome Completo</Label>
                            <Input
                              id="edit_client_name"
                              value={formData.client_name}
                              onChange={(e) =>
                                setFormData({ ...formData, client_name: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit_client_phone">Telefone</Label>
                            <Input
                              id="edit_client_phone"
                              value={formData.client_phone}
                              onChange={(e) =>
                                setFormData({ ...formData, client_phone: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit_client_address">Endereço</Label>
                            <Input
                              id="edit_client_address"
                              value={formData.client_address}
                              onChange={(e) =>
                                setFormData({ ...formData, client_address: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit_notes">Observações</Label>
                            <Textarea
                              id="edit_notes"
                              value={formData.notes}
                              onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                              }
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="edit_share_with_business"
                              checked={formData.share_with_business}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, share_with_business: checked })
                              }
                            />
                            <Label htmlFor="edit_share_with_business">
                              Compartilhar com o estabelecimento
                            </Label>
                          </div>
                          <Button onClick={handleUpdateClient} className="w-full">
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover este cliente da sua carteira?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
