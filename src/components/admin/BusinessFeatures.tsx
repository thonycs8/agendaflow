import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BusinessFeature {
  id: string;
  business_id: string;
  plan_tier: string;
  max_professionals: number;
  max_services: number;
  can_create_promotions: boolean;
  can_create_memberships: boolean;
  can_export_reports: boolean;
  can_manage_finances: boolean;
  can_use_analytics: boolean;
  can_customize_branding: boolean;
  can_use_api: boolean;
  businesses: {
    name: string;
    owner_id: string;
  };
}

const PLAN_FEATURES = {
  starter: {
    max_professionals: 3,
    max_services: 10,
    features: ["basic_scheduling"],
  },
  professional: {
    max_professionals: 10,
    max_services: 50,
    features: ["promotions", "memberships", "reports", "analytics"],
  },
  business: {
    max_professionals: 50,
    max_services: 200,
    features: ["promotions", "memberships", "reports", "analytics", "finances", "branding"],
  },
  enterprise: {
    max_professionals: 999,
    max_services: 999,
    features: ["promotions", "memberships", "reports", "analytics", "finances", "branding", "api"],
  },
};

export const BusinessFeatures = () => {
  const [features, setFeatures] = useState<BusinessFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState<{ [key: string]: BusinessFeature }>({});

  useEffect(() => {
    fetchBusinessFeatures();
  }, []);

  const fetchBusinessFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from("business_features")
        .select(`
          *,
          businesses(name, owner_id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error("Error fetching business features:", error);
      toast.error("Erro ao carregar funcionalidades");
    } finally {
      setLoading(false);
    }
  };

  const updateFeature = async (featureId: string) => {
    try {
      const updatedFeature = editingFeature[featureId];
      if (!updatedFeature) return;

      const { error } = await supabase
        .from("business_features")
        .update({
          plan_tier: updatedFeature.plan_tier,
          max_professionals: updatedFeature.max_professionals,
          max_services: updatedFeature.max_services,
          can_create_promotions: updatedFeature.can_create_promotions,
          can_create_memberships: updatedFeature.can_create_memberships,
          can_export_reports: updatedFeature.can_export_reports,
          can_manage_finances: updatedFeature.can_manage_finances,
          can_use_analytics: updatedFeature.can_use_analytics,
          can_customize_branding: updatedFeature.can_customize_branding,
          can_use_api: updatedFeature.can_use_api,
        })
        .eq("id", featureId);

      if (error) throw error;

      toast.success("Funcionalidades atualizadas!");
      fetchBusinessFeatures();
      setEditingFeature({});
    } catch (error) {
      console.error("Error updating feature:", error);
      toast.error("Erro ao atualizar funcionalidades");
    }
  };

  const applyPlanTemplate = (featureId: string, plan: keyof typeof PLAN_FEATURES) => {
    const feature = features.find((f) => f.id === featureId);
    if (!feature) return;

    const template = PLAN_FEATURES[plan];
    setEditingFeature({
      ...editingFeature,
      [featureId]: {
        ...feature,
        plan_tier: plan,
        max_professionals: template.max_professionals,
        max_services: template.max_services,
        can_create_promotions: template.features.includes("promotions"),
        can_create_memberships: template.features.includes("memberships"),
        can_export_reports: template.features.includes("reports"),
        can_manage_finances: template.features.includes("finances"),
        can_use_analytics: template.features.includes("analytics"),
        can_customize_branding: template.features.includes("branding"),
        can_use_api: template.features.includes("api"),
      },
    });
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "default";
      case "business":
        return "secondary";
      case "professional":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      {features.map((feature) => {
        const editing = editingFeature[feature.id] || feature;
        const isEditing = !!editingFeature[feature.id];

        return (
          <Card key={feature.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">
                      {feature.businesses.name}
                    </CardTitle>
                    <CardDescription>Funcionalidades do Negócio</CardDescription>
                  </div>
                </div>
                <Badge variant={getPlanBadgeVariant(editing.plan_tier)}>
                  {editing.plan_tier.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Plano</Label>
                  <Select
                    value={editing.plan_tier}
                    onValueChange={(value) => {
                      applyPlanTemplate(feature.id, value as keyof typeof PLAN_FEATURES);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Máx. Profissionais</Label>
                    <Input
                      type="number"
                      value={editing.max_professionals}
                      onChange={(e) =>
                        setEditingFeature({
                          ...editingFeature,
                          [feature.id]: {
                            ...editing,
                            max_professionals: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Máx. Serviços</Label>
                    <Input
                      type="number"
                      value={editing.max_services}
                      onChange={(e) =>
                        setEditingFeature({
                          ...editingFeature,
                          [feature.id]: {
                            ...editing,
                            max_services: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Funcionalidades Ativas</Label>
                <div className="grid gap-3">
                  {[
                    { key: "can_create_promotions", label: "Criar Promoções" },
                    { key: "can_create_memberships", label: "Criar Planos de Assinatura" },
                    { key: "can_export_reports", label: "Exportar Relatórios" },
                    { key: "can_manage_finances", label: "Gestão Financeira" },
                    { key: "can_use_analytics", label: "Analytics Avançado" },
                    { key: "can_customize_branding", label: "Personalizar Marca" },
                    { key: "can_use_api", label: "Acesso à API" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`${feature.id}-${key}`} className="cursor-pointer">
                        {label}
                      </Label>
                      <Switch
                        id={`${feature.id}-${key}`}
                        checked={editing[key as keyof BusinessFeature] as boolean}
                        onCheckedChange={(checked) =>
                          setEditingFeature({
                            ...editingFeature,
                            [feature.id]: {
                              ...editing,
                              [key]: checked,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={() => updateFeature(feature.id)} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const { [feature.id]: _, ...rest } = editingFeature;
                      setEditingFeature(rest);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
