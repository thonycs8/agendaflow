import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Template {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  template_data: any;
}

export function TemplateManager() {
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["landing-page-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_page_templates")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as Template[];
    },
  });

  const activateTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      // Desativar todos os templates
      await supabase
        .from("landing_page_templates")
        .update({ is_active: false })
        .neq("id", "");
      
      // Ativar o template selecionado
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
    onError: (error: Error) => {
      toast.error("Erro ao ativar template: " + error.message);
    },
  });

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  const getTemplateFeatures = (templateData: any) => {
    const features = [];
    if (templateData.social_proof) features.push("Prova Social");
    if (templateData.urgency) features.push("Senso de Urgência");
    if (templateData.cta_position === "multiple") features.push("CTAs Múltiplos");
    if (templateData.emphasis === "pricing") features.push("Foco em Preços");
    if (templateData.emphasis === "benefits") features.push("Foco em Benefícios");
    return features;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Templates da Landing Page</h2>
        <p className="text-muted-foreground">
          Escolha entre diferentes templates otimizados para conversão e vendas
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {templates?.map((template) => {
          const features = getTemplateFeatures(template.template_data);
          
          return (
            <Card key={template.id} className={template.is_active ? "ring-2 ring-primary" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{template.name}</CardTitle>
                  {template.is_active && (
                    <Badge variant="default">
                      <Check className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  )}
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Características:</h4>
                  <ul className="space-y-1">
                    {features.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-center">
                        <Check className="h-3 w-3 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => activateTemplate.mutate(template.id)}
                    disabled={template.is_active || activateTemplate.isPending}
                  >
                    {template.is_active ? "Template Ativo" : "Ativar Template"}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      window.open("/", "_blank");
                      toast.info("Visualize a landing page em uma nova aba");
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">💡 Dica</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Teste diferentes templates e acompanhe as métricas de conversão para descobrir qual funciona melhor para seu público. 
            O template "Original" é balanceado, "Conversão Alta" adiciona mais CTAs e provas sociais, 
            enquanto "Vendas Diretas" coloca os preços em destaque desde o início.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
