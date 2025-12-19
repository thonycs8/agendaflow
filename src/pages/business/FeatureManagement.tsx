import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Check, X, Loader2, Settings, Building, Shield, Save, Plus } from "lucide-react";
import CreateBusinessDialog from "@/components/admin/CreateBusinessDialog";

interface FeatureConfig {
  id: string;
  category: string;
  feature_name: string;
  starter_value: string | null;
  business_value: string | null;
  premium_value: string | null;
  is_active: boolean;
  coming_soon: boolean;
  order_index: number;
}

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

const VALUE_OPTIONS = [
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
  { value: "Manual", label: "Manual" },
  { value: "Breve", label: "Em Breve" },
  { value: "1", label: "1" },
  { value: "Até 2", label: "Até 2" },
  { value: "Até 5", label: "Até 5" },
  { value: "Ilimitado", label: "Ilimitado" },
];

interface FeatureManagementProps {
  embedded?: boolean;
}

export default function FeatureManagement({ embedded = false }: FeatureManagementProps) {
  const { user } = useAuth();
  const { isAdmin, isBusinessOwner, isProfessional, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState(isAdmin && !embedded ? "global" : "business");
  const [editingFeature, setEditingFeature] = useState<{ [key: string]: BusinessFeature }>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!roleLoading && !user && !embedded) {
      navigate("/login");
    }
    if (!roleLoading && !isAdmin && !isBusinessOwner && !isProfessional && !embedded) {
      navigate("/");
    }
  }, [user, isAdmin, isBusinessOwner, isProfessional, roleLoading, navigate, embedded]);

  useEffect(() => {
    if (!roleLoading && isAdmin && !embedded) {
      setActiveTab("global");
    }
  }, [isAdmin, roleLoading, embedded]);

  // Fetch global feature comparison config (admin only)
  const { data: globalFeatures, isLoading: loadingGlobal } = useQuery({
    queryKey: ["feature-comparison"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_comparison_config")
        .select("*")
        .order("order_index");
      
      if (error) throw error;
      return data as FeatureConfig[];
    },
    enabled: isAdmin,
  });

  // Fetch business features
  const { data: businessFeatures, isLoading: loadingBusiness } = useQuery({
    queryKey: ["business-features", user?.id],
    queryFn: async () => {
      let query = supabase
        .from("business_features")
        .select(`
          *,
          businesses(name, owner_id)
        `)
        .order("created_at", { ascending: false });

      // Non-admins only see their own business features
      if (!isAdmin) {
        const { data: businesses } = await supabase
          .from("businesses")
          .select("id")
          .eq("owner_id", user?.id);
        
        const businessIds = businesses?.map(b => b.id) || [];
        
        if (businessIds.length > 0) {
          query = query.in("business_id", businessIds);
        } else {
          return [];
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BusinessFeature[];
    },
    enabled: !!user && (isAdmin || isBusinessOwner),
  });

  // Update global feature config (admin only)
  const updateGlobalFeature = useMutation({
    mutationFn: async (feature: Partial<FeatureConfig> & { id: string }) => {
      const { error } = await supabase
        .from("feature_comparison_config")
        .update(feature)
        .eq("id", feature.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-comparison"] });
      toast.success("Funcionalidade global atualizada!");
    },
    onError: () => {
      toast.error("Erro ao atualizar funcionalidade");
    },
  });

  // Update business feature
  const updateBusinessFeature = async (featureId: string) => {
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
      queryClient.invalidateQueries({ queryKey: ["business-features"] });
      setEditingFeature({});
    } catch (error) {
      console.error("Error updating feature:", error);
      toast.error("Erro ao atualizar funcionalidades");
    }
  };

  const applyPlanTemplate = (featureId: string, plan: keyof typeof PLAN_FEATURES) => {
    const feature = businessFeatures?.find((f) => f.id === featureId);
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

  const renderValue = (value: string | null) => {
    if (value === "true") return <Check className="h-5 w-5 text-green-600" />;
    if (value === "false") return <X className="h-5 w-5 text-red-600" />;
    return <span className="text-sm">{value || "-"}</span>;
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "enterprise":
      case "premium":
        return "default";
      case "business":
        return "secondary";
      case "professional":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = [...new Set(globalFeatures?.map((f) => f.category) || [])];

  const wrapperClass = embedded ? "space-y-6" : "container py-6 space-y-6";

  return (
    <div className={wrapperClass}>
      {!embedded && (
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestão de Funcionalidades</h1>
            <p className="text-muted-foreground">
              {isAdmin 
                ? "Configure funcionalidades globais e por estabelecimento"
                : "Visualize as funcionalidades do seu plano"
              }
            </p>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {isAdmin && (
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Configuração Global
            </TabsTrigger>
          )}
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Por Estabelecimento
          </TabsTrigger>
        </TabsList>

        {/* Global Features Tab (Admin Only) */}
        {isAdmin && (
          <TabsContent value="global" className="space-y-6">
            {loadingGlobal ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Funcionalidades por Plano</CardTitle>
                  <CardDescription>
                    Ative/desative funcionalidades e configure os valores para cada plano de assinatura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {categories.map((category) => (
                      <div key={category} className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">{category}</h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[250px]">Funcionalidade</TableHead>
                                <TableHead className="text-center w-[80px]">Ativo</TableHead>
                                <TableHead className="text-center w-[80px]">Em Breve</TableHead>
                                <TableHead className="text-center w-[130px]">Starter</TableHead>
                                <TableHead className="text-center w-[130px]">Business</TableHead>
                                <TableHead className="text-center w-[130px]">Premium</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {globalFeatures
                                ?.filter((f) => f.category === category)
                                .map((feature) => (
                                  <TableRow key={feature.id}>
                                    <TableCell className="font-medium">
                                      {feature.feature_name}
                                      {feature.coming_soon && (
                                        <Badge variant="outline" className="ml-2 text-xs">
                                          Em Breve
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Switch
                                        checked={feature.is_active}
                                        onCheckedChange={(checked) =>
                                          updateGlobalFeature.mutate({
                                            id: feature.id,
                                            is_active: checked,
                                          })
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Switch
                                        checked={feature.coming_soon}
                                        onCheckedChange={(checked) =>
                                          updateGlobalFeature.mutate({
                                            id: feature.id,
                                            coming_soon: checked,
                                          })
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Select
                                        value={feature.starter_value || "false"}
                                        onValueChange={(value) =>
                                          updateGlobalFeature.mutate({
                                            id: feature.id,
                                            starter_value: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="w-[110px] mx-auto">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {VALUE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                              {opt.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Select
                                        value={feature.business_value || "false"}
                                        onValueChange={(value) =>
                                          updateGlobalFeature.mutate({
                                            id: feature.id,
                                            business_value: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="w-[110px] mx-auto">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {VALUE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                              {opt.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Select
                                        value={feature.premium_value || "false"}
                                        onValueChange={(value) =>
                                          updateGlobalFeature.mutate({
                                            id: feature.id,
                                            premium_value: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="w-[110px] mx-auto">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {VALUE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                              {opt.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {/* Business Features Tab */}
        <TabsContent value="business" className="space-y-6">
          {isAdmin && (
            <div className="flex justify-end">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Estabelecimento
              </Button>
            </div>
          )}
          {loadingBusiness ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : businessFeatures?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum estabelecimento encontrado</h3>
                <p className="text-muted-foreground">
                  {isAdmin 
                    ? "Ainda não há estabelecimentos cadastrados no sistema."
                    : "Você ainda não possui estabelecimentos cadastrados."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {businessFeatures?.map((feature) => {
                const editing = editingFeature[feature.id] || feature;
                const isEditing = !!editingFeature[feature.id];
                const canEdit = isAdmin; // Only admin can edit business features

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
                            <CardDescription>Funcionalidades do Estabelecimento</CardDescription>
                          </div>
                        </div>
                        <Badge variant={getPlanBadgeVariant(editing.plan_tier)}>
                          {editing.plan_tier.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Plan Selection (Admin only) */}
                      {canEdit && (
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
                                      max_professionals: parseInt(e.target.value) || 0,
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
                                      max_services: parseInt(e.target.value) || 0,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Features List */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium">Funcionalidades Ativas</Label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            { key: "can_create_promotions", label: "Criar Promoções" },
                            { key: "can_create_memberships", label: "Criar Planos de Assinatura" },
                            { key: "can_export_reports", label: "Exportar Relatórios" },
                            { key: "can_manage_finances", label: "Gestão Financeira" },
                            { key: "can_use_analytics", label: "Analytics Avançado" },
                            { key: "can_customize_branding", label: "Personalizar Marca" },
                            { key: "can_use_api", label: "Acesso à API" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                              <Label htmlFor={`${feature.id}-${key}`} className="cursor-pointer">
                                {label}
                              </Label>
                              {canEdit ? (
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
                              ) : (
                                <span>
                                  {feature[key as keyof BusinessFeature] ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <X className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Limits Display */}
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{editing.max_professionals}</p>
                          <p className="text-sm text-muted-foreground">Profissionais</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{editing.max_services}</p>
                          <p className="text-sm text-muted-foreground">Serviços</p>
                        </div>
                      </div>

                      {/* Save/Cancel Buttons (Admin only) */}
                      {canEdit && isEditing && (
                        <div className="flex gap-2">
                          <Button onClick={() => updateBusinessFeature(feature.id)} className="flex-1">
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
          )}
        </TabsContent>
      </Tabs>

      <CreateBusinessDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["business-features"] });
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
}
