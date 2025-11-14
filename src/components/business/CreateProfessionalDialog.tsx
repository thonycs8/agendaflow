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

interface CreateProfessionalDialogProps {
  businessId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProfessionalDialog = ({
  businessId,
  open,
  onClose,
  onSuccess,
}: CreateProfessionalDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialties: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const specialtiesArray = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const { error } = await supabase.from("professionals").insert({
      business_id: businessId,
      name: formData.name,
      bio: formData.bio,
      specialties: specialtiesArray,
    });

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Profissional criado com sucesso" });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Profissional</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
            <Input
              id="specialties"
              value={formData.specialties}
              onChange={(e) =>
                setFormData({ ...formData, specialties: e.target.value })
              }
              placeholder="Corte, Barba, Coloração"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Profissional"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfessionalDialog;
