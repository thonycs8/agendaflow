import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Save, X } from "lucide-react";

interface LandingPageSection {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  is_active: boolean;
  order_index: number;
}

export function LandingPageSections() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LandingPageSection>>({});
  const queryClient = useQueryClient();

  const { data: sections, isLoading } = useQuery({
    queryKey: ["landing-page-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_page_config")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data as LandingPageSection[];
    },
  });

  const updateSection = useMutation({
    mutationFn: async (section: Partial<LandingPageSection>) => {
      const { error } = await supabase
        .from("landing_page_config")
        .update(section)
        .eq("id", section.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-page-sections"] });
      toast.success("Seção atualizada com sucesso!");
      setEditingId(null);
      setEditForm({});
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar seção: " + error.message);
    },
  });

  const handleEdit = (section: LandingPageSection) => {
    setEditingId(section.id);
    setEditForm(section);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = () => {
    if (editForm.id) {
      updateSection.mutate(editForm);
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("landing_page_config")
      .update({ is_active: !currentState })
      .eq("id", id);
    
    if (error) {
      toast.error("Erro ao atualizar estado: " + error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ["landing-page-sections"] });
      toast.success("Estado atualizado!");
    }
  };

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seções da Landing Page</h2>
      </div>

      <div className="grid gap-4">
        {sections?.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg capitalize">{section.section}</CardTitle>
                  <CardDescription>Ordem: {section.order_index}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${section.id}`} className="text-sm">
                      {section.is_active ? "Ativo" : "Inativo"}
                    </Label>
                    <Switch
                      id={`active-${section.id}`}
                      checked={section.is_active}
                      onCheckedChange={() => handleToggleActive(section.id, section.is_active)}
                    />
                  </div>
                  {editingId === section.id ? (
                    <>
                      <Button size="sm" onClick={handleSave} disabled={updateSection.isPending}>
                        <Save className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(section)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === section.id ? (
                <div className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={editForm.title || ""}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Input
                      value={editForm.subtitle || ""}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Conteúdo</Label>
                    <Textarea
                      value={editForm.content || ""}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>URL da Imagem</Label>
                    <Input
                      value={editForm.image_url || ""}
                      onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Texto do CTA</Label>
                      <Input
                        value={editForm.cta_text || ""}
                        onChange={(e) => setEditForm({ ...editForm, cta_text: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Link do CTA</Label>
                      <Input
                        value={editForm.cta_link || ""}
                        onChange={(e) => setEditForm({ ...editForm, cta_link: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {section.title && (
                    <p>
                      <strong>Título:</strong> {section.title}
                    </p>
                  )}
                  {section.subtitle && (
                    <p>
                      <strong>Subtítulo:</strong> {section.subtitle}
                    </p>
                  )}
                  {section.content && (
                    <p>
                      <strong>Conteúdo:</strong> {section.content}
                    </p>
                  )}
                  {section.cta_text && (
                    <p>
                      <strong>CTA:</strong> {section.cta_text}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
