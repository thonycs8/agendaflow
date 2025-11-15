import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, X, Pencil, Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FeatureConfig {
  id: string;
  category: string;
  feature_name: string;
  starter_value: string;
  business_value: string;
  premium_value: string;
  is_active: boolean;
  coming_soon: boolean;
  order_index: number;
}

export function FeatureComparisonManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FeatureConfig>>({});
  const queryClient = useQueryClient();

  const { data: features, isLoading } = useQuery({
    queryKey: ["feature-comparison"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_comparison_config")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data as FeatureConfig[];
    },
  });

  const updateFeature = useMutation({
    mutationFn: async (feature: Partial<FeatureConfig>) => {
      const { error } = await supabase
        .from("feature_comparison_config")
        .update(feature)
        .eq("id", feature.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-comparison"] });
      toast.success("Funcionalidade atualizada!");
      setEditingId(null);
      setEditForm({});
    },
    onError: (error: Error) => {
      toast.error("Erro: " + error.message);
    },
  });

  const handleToggle = async (id: string, field: "is_active" | "coming_soon", currentState: boolean) => {
    const { error } = await supabase
      .from("feature_comparison_config")
      .update({ [field]: !currentState })
      .eq("id", id);
    
    if (error) {
      toast.error("Erro ao atualizar: " + error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ["feature-comparison"] });
    }
  };

  const renderValue = (value: string) => {
    if (value === "true") return <Check className="h-4 w-4 text-green-500 mx-auto" />;
    if (value === "false") return <X className="h-4 w-4 text-red-500 mx-auto" />;
    return <span className="text-center block">{value}</span>;
  };

  const categories = Array.from(new Set(features?.map(f => f.category) || []));

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tabela de Comparação de Funcionalidades</h2>
        <p className="text-muted-foreground">
          Gerencie as funcionalidades exibidas na tabela de comparação da landing page
        </p>
      </div>

      {categories.map((category) => {
        const categoryFeatures = features?.filter((f) => f.category === category);
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Funcionalidade</TableHead>
                    <TableHead className="text-center">Starter</TableHead>
                    <TableHead className="text-center">Business</TableHead>
                    <TableHead className="text-center">Premium</TableHead>
                    <TableHead className="text-center">Ativo</TableHead>
                    <TableHead className="text-center">Em Breve</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryFeatures?.map((feature) => (
                    <TableRow key={feature.id}>
                      <TableCell className="font-medium">
                        {editingId === feature.id ? (
                          <Input
                            value={editForm.feature_name || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, feature_name: e.target.value })
                            }
                            className="h-8"
                          />
                        ) : (
                          feature.feature_name
                        )}
                      </TableCell>
                      
                      {editingId === feature.id ? (
                        <>
                          <TableCell>
                            <Input
                              value={editForm.starter_value || ""}
                              onChange={(e) =>
                                setEditForm({ ...editForm, starter_value: e.target.value })
                              }
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editForm.business_value || ""}
                              onChange={(e) =>
                                setEditForm({ ...editForm, business_value: e.target.value })
                              }
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editForm.premium_value || ""}
                              onChange={(e) =>
                                setEditForm({ ...editForm, premium_value: e.target.value })
                              }
                              className="h-8"
                            />
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{renderValue(feature.starter_value)}</TableCell>
                          <TableCell>{renderValue(feature.business_value)}</TableCell>
                          <TableCell>{renderValue(feature.premium_value)}</TableCell>
                        </>
                      )}
                      
                      <TableCell className="text-center">
                        <Switch
                          checked={feature.is_active}
                          onCheckedChange={() =>
                            handleToggle(feature.id, "is_active", feature.is_active)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={feature.coming_soon}
                          onCheckedChange={() =>
                            handleToggle(feature.id, "coming_soon", feature.coming_soon)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {editingId === feature.id ? (
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateFeature.mutate(editForm)}
                              disabled={updateFeature.isPending}
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setEditForm({});
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(feature.id);
                              setEditForm(feature);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
