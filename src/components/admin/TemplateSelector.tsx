import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, Loader2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TemplateSelector() {
  const queryClient = useQueryClient();
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["landing-page-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_page_templates")
        .select("*")
        .order("created_at");
      
      if (error) throw error;
      return data;
    },
  });

  const activateTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      // Deactivate all templates
      await supabase
        .from("landing_page_templates")
        .update({ is_active: false })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      // Activate selected template
      const { error } = await supabase
        .from("landing_page_templates")
        .update({ is_active: true })
        .eq("id", templateId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-page-templates"] });
      toast.success("Template ativado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao ativar template");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getTemplatePreview = (template: any) => {
    const data = template.template_data;
    return {
      heroStyle: data.hero_style || "default",
      ctaPosition: data.cta_position || "bottom",
      emphasis: data.emphasis || "features",
      socialProof: data.social_proof || false,
      urgency: data.urgency || false,
    };
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {templates?.map((template) => {
          const preview = getTemplatePreview(template);
          return (
            <Card key={template.id} className="relative">
              {template.is_active && (
                <Badge className="absolute top-4 right-4 bg-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Ativo
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estilo Hero:</span>
                    <span className="font-medium capitalize">{preview.heroStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posição CTA:</span>
                    <span className="font-medium capitalize">{preview.ctaPosition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ênfase:</span>
                    <span className="font-medium capitalize">{preview.emphasis}</span>
                  </div>
                  {preview.socialProof && (
                    <Badge variant="secondary">Prova Social</Badge>
                  )}
                  {preview.urgency && (
                    <Badge variant="secondary">Urgência</Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={template.is_active || activateTemplate.isPending}
                    onClick={() => activateTemplate.mutate(template.id)}
                  >
                    {template.is_active ? "Ativo" : "Ativar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>
              {previewTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Características do Template</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estilo do Hero:</span>
                  <span className="font-medium capitalize">
                    {previewTemplate?.template_data.hero_style}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posição dos CTAs:</span>
                  <span className="font-medium capitalize">
                    {previewTemplate?.template_data.cta_position}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ênfase Principal:</span>
                  <span className="font-medium capitalize">
                    {previewTemplate?.template_data.emphasis}
                  </span>
                </div>
                {previewTemplate?.template_data.social_proof && (
                  <Badge variant="secondary" className="w-fit">
                    Prova Social Destacada
                  </Badge>
                )}
                {previewTemplate?.template_data.urgency && (
                  <Badge variant="secondary" className="w-fit">
                    Elementos de Urgência
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
