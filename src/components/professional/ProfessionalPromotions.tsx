import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Percent, Calendar, Loader2, Tag, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Professional {
  id: string;
  name: string;
  promotion_active: boolean;
  promotion_title: string | null;
  promotion_description: string | null;
  promotion_discount: number | null;
  promotion_start_date: string | null;
  promotion_end_date: string | null;
}

export function ProfessionalPromotions() {
  const { user } = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    promotion_title: "",
    promotion_description: "",
    promotion_discount: 10,
    promotion_start_date: "",
    promotion_end_date: "",
    promotion_active: true,
  });

  useEffect(() => {
    fetchProfessional();
  }, [user]);

  const fetchProfessional = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("professionals")
      .select("id, name, promotion_active, promotion_title, promotion_description, promotion_discount, promotion_start_date, promotion_end_date")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching professional:", error);
    } else if (data) {
      setProfessional(data);
      if (data.promotion_title) {
        setFormData({
          promotion_title: data.promotion_title || "",
          promotion_description: data.promotion_description || "",
          promotion_discount: data.promotion_discount || 10,
          promotion_start_date: data.promotion_start_date ? data.promotion_start_date.split("T")[0] : "",
          promotion_end_date: data.promotion_end_date ? data.promotion_end_date.split("T")[0] : "",
          promotion_active: data.promotion_active || false,
        });
      }
    }
    setLoading(false);
  };

  const handleSavePromotion = async () => {
    if (!professional) return;
    
    if (!formData.promotion_title.trim()) {
      toast.error("O título da promoção é obrigatório");
      return;
    }
    
    if (formData.promotion_discount < 1 || formData.promotion_discount > 100) {
      toast.error("O desconto deve ser entre 1% e 100%");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("professionals")
      .update({
        promotion_title: formData.promotion_title,
        promotion_description: formData.promotion_description,
        promotion_discount: formData.promotion_discount,
        promotion_start_date: formData.promotion_start_date || null,
        promotion_end_date: formData.promotion_end_date || null,
        promotion_active: formData.promotion_active,
      })
      .eq("id", professional.id);

    setSaving(false);

    if (error) {
      console.error("Error saving promotion:", error);
      toast.error("Erro ao salvar promoção");
    } else {
      toast.success("Promoção salva com sucesso!");
      setDialogOpen(false);
      fetchProfessional();
    }
  };

  const handleDeletePromotion = async () => {
    if (!professional) return;

    setSaving(true);
    const { error } = await supabase
      .from("professionals")
      .update({
        promotion_title: null,
        promotion_description: null,
        promotion_discount: null,
        promotion_start_date: null,
        promotion_end_date: null,
        promotion_active: false,
      })
      .eq("id", professional.id);

    setSaving(false);

    if (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Erro ao remover promoção");
    } else {
      toast.success("Promoção removida!");
      setFormData({
        promotion_title: "",
        promotion_description: "",
        promotion_discount: 10,
        promotion_start_date: "",
        promotion_end_date: "",
        promotion_active: true,
      });
      fetchProfessional();
    }
  };

  const handleToggleActive = async (active: boolean) => {
    if (!professional) return;

    const { error } = await supabase
      .from("professionals")
      .update({ promotion_active: active })
      .eq("id", professional.id);

    if (error) {
      toast.error("Erro ao atualizar promoção");
    } else {
      toast.success(active ? "Promoção ativada!" : "Promoção desativada!");
      fetchProfessional();
    }
  };

  const openEditDialog = () => {
    if (professional?.promotion_title) {
      setFormData({
        promotion_title: professional.promotion_title || "",
        promotion_description: professional.promotion_description || "",
        promotion_discount: professional.promotion_discount || 10,
        promotion_start_date: professional.promotion_start_date ? professional.promotion_start_date.split("T")[0] : "",
        promotion_end_date: professional.promotion_end_date ? professional.promotion_end_date.split("T")[0] : "",
        promotion_active: professional.promotion_active || false,
      });
    } else {
      setFormData({
        promotion_title: "",
        promotion_description: "",
        promotion_discount: 10,
        promotion_start_date: "",
        promotion_end_date: "",
        promotion_active: true,
      });
    }
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasPromotion = professional?.promotion_title;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Minhas Promoções</h3>
          <p className="text-sm text-muted-foreground">
            Crie promoções com desconto para atrair mais clientes
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openEditDialog}>
              {hasPromotion ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Promoção
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Promoção
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {hasPromotion ? "Editar Promoção" : "Nova Promoção"}
              </DialogTitle>
              <DialogDescription>
                Configure sua promoção com desconto percentual
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Promoção *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Black Friday, Promoção de Verão..."
                  value={formData.promotion_title}
                  onChange={(e) =>
                    setFormData({ ...formData, promotion_title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Desconto (%)</Label>
                <div className="relative">
                  <Input
                    id="discount"
                    type="number"
                    min={1}
                    max={100}
                    value={formData.promotion_discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        promotion_discount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="pr-10"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva sua promoção..."
                  value={formData.promotion_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      promotion_description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.promotion_start_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        promotion_start_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Data de Fim</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.promotion_end_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        promotion_end_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="active">Promoção Ativa</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar promoção imediatamente
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.promotion_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, promotion_active: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePromotion} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar Promoção
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {hasPromotion ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {professional.promotion_title}
                  </CardTitle>
                  <CardDescription>
                    {professional.promotion_description || "Sem descrição"}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={professional.promotion_active ? "default" : "secondary"}
                >
                  {professional.promotion_active ? "Ativa" : "Inativa"}
                </Badge>
                <Badge variant="outline" className="text-lg font-bold">
                  {professional.promotion_discount}% OFF
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {professional.promotion_start_date ? (
                    <span>
                      {format(new Date(professional.promotion_start_date), "dd/MM/yyyy", { locale: pt })}
                    </span>
                  ) : (
                    <span>Sem data início</span>
                  )}
                </div>
                <span>→</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {professional.promotion_end_date ? (
                    <span>
                      {format(new Date(professional.promotion_end_date), "dd/MM/yyyy", { locale: pt })}
                    </span>
                  ) : (
                    <span>Sem data fim</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={professional.promotion_active}
                  onCheckedChange={handleToggleActive}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeletePromotion}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Percent className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma promoção ativa</h3>
            <p className="text-muted-foreground mb-4">
              Crie uma promoção com desconto percentual para atrair mais clientes
            </p>
            <Button onClick={openEditDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Promoção
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
