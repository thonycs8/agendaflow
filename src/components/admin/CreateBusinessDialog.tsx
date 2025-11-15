import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CreateBusinessDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateBusinessDialog = ({ open, onClose, onSuccess }: CreateBusinessDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ownerEmail: "",
    ownerPassword: "",
    ownerName: "",
    businessName: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    email: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user (admin)
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Not authenticated");

      // Create user account with auto-confirm enabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.ownerEmail,
        password: formData.ownerPassword,
        options: {
          data: {
            full_name: formData.ownerName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Falha ao criar usuário");

      // Wait a bit for the profile trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add business_owner role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: authData.user.id, role: "business_owner" });

      if (roleError) {
        console.error("Role error:", roleError);
        throw new Error("Erro ao adicionar role de proprietário");
      }

      // Create business
      const { error: businessError } = await supabase.from("businesses").insert({
        owner_id: authData.user.id,
        name: formData.businessName,
        category: formData.category,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
      });

      if (businessError) {
        console.error("Business error:", businessError);
        throw new Error("Erro ao criar negócio: " + businessError.message);
      }

      toast({
        title: "Sucesso!",
        description: "Negócio e proprietário criados com sucesso",
      });
      
      setFormData({
        ownerEmail: "",
        ownerPassword: "",
        ownerName: "",
        businessName: "",
        category: "",
        description: "",
        address: "",
        phone: "",
        email: "",
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Create business error:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar negócio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Negócio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Nome do Proprietário</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Email do Proprietário</Label>
            <Input
              id="ownerEmail"
              type="email"
              value={formData.ownerEmail}
              onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerPassword">Palavra-passe</Label>
            <Input
              id="ownerPassword"
              type="password"
              value={formData.ownerPassword}
              onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessName">Nome do Negócio</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Ex: Barbearia, Salão de beleza, Restaurante"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email do Negócio</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Negócio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBusinessDialog;
