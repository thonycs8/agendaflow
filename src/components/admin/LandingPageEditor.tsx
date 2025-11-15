import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus, Save, Image as ImageIcon } from "lucide-react";
import { FeatureComparisonEditor } from "./FeatureComparisonEditor";
import { TemplateSelector } from "./TemplateSelector";

export function LandingPageEditor() {
  const queryClient = useQueryClient();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Fetch landing page sections
  const { data: sections, isLoading } = useQuery({
    queryKey: ["landing-page-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_page_config")
        .select("*")
        .order("order_index");
      
      if (error) throw error;
      return data;
    },
  });

  // Update section mutation
  const updateSection = useMutation({
    mutationFn: async (section: any) => {
      const { error } = await supabase
        .from("landing_page_config")
        .update(section)
        .eq("id", section.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-page-sections"] });
      toast.success("Seção atualizada com sucesso!");
      setEditingSection(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar seção");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="sections" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sections">Seções</TabsTrigger>
        <TabsTrigger value="features">Funcionalidades</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>

      <TabsContent value="sections" className="space-y-4">
        <div className="grid gap-4">
          {sections?.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">{section.section}</CardTitle>
                    <CardDescription>Ordem: {section.order_index}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${section.id}`}>Ativo</Label>
                      <Switch
                        id={`active-${section.id}`}
                        checked={section.is_active}
                        onCheckedChange={(checked) =>
                          updateSection.mutate({ ...section, is_active: checked })
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingSection(
                          editingSection === section.id ? null : section.id
                        )
                      }
                    >
                      {editingSection === section.id ? "Cancelar" : "Editar"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {editingSection === section.id && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${section.id}`}>Título</Label>
                    <Input
                      id={`title-${section.id}`}
                      defaultValue={section.title || ""}
                      onChange={(e) => {
                        section.title = e.target.value;
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`subtitle-${section.id}`}>Subtítulo</Label>
                    <Input
                      id={`subtitle-${section.id}`}
                      defaultValue={section.subtitle || ""}
                      onChange={(e) => {
                        section.subtitle = e.target.value;
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`content-${section.id}`}>Conteúdo</Label>
                    <Textarea
                      id={`content-${section.id}`}
                      rows={4}
                      defaultValue={section.content || ""}
                      onChange={(e) => {
                        section.content = e.target.value;
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`image-${section.id}`}>URL da Imagem</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`image-${section.id}`}
                        placeholder="https://..."
                        defaultValue={section.image_url || ""}
                        onChange={(e) => {
                          section.image_url = e.target.value;
                        }}
                      />
                      <Button variant="outline" size="icon">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`cta-text-${section.id}`}>Texto do CTA</Label>
                      <Input
                        id={`cta-text-${section.id}`}
                        defaultValue={section.cta_text || ""}
                        onChange={(e) => {
                          section.cta_text = e.target.value;
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`cta-link-${section.id}`}>Link do CTA</Label>
                      <Input
                        id={`cta-link-${section.id}`}
                        defaultValue={section.cta_link || ""}
                        onChange={(e) => {
                          section.cta_link = e.target.value;
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => setEditingSection(null)}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => updateSection.mutate(section)}
                      disabled={updateSection.isPending}
                    >
                      {updateSection.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="features">
        <FeatureComparisonEditor />
      </TabsContent>

      <TabsContent value="templates">
        <TemplateSelector />
      </TabsContent>
    </Tabs>
  );
}
