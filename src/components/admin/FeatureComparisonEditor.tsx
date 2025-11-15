import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, Loader2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FeatureComparisonEditor() {
  const queryClient = useQueryClient();

  const { data: features, isLoading } = useQuery({
    queryKey: ["feature-comparison"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_comparison_config")
        .select("*")
        .order("order_index");
      
      if (error) throw error;
      return data;
    },
  });

  const updateFeature = useMutation({
    mutationFn: async (feature: any) => {
      const { error } = await supabase
        .from("feature_comparison_config")
        .update(feature)
        .eq("id", feature.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-comparison"] });
      toast.success("Funcionalidade atualizada!");
    },
    onError: () => {
      toast.error("Erro ao atualizar funcionalidade");
    },
  });

  const renderValue = (value: string) => {
    if (value === "true") return <Check className="h-5 w-5 text-green-600" />;
    if (value === "false") return <X className="h-5 w-5 text-red-600" />;
    return <span className="text-sm">{value}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = [...new Set(features?.map((f) => f.category))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Funcionalidades</CardTitle>
          <CardDescription>
            Ative/desative funcionalidades e configure os valores para cada plano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold">{category}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Funcionalidade</TableHead>
                      <TableHead className="text-center">Ativo</TableHead>
                      <TableHead className="text-center">Em Breve</TableHead>
                      <TableHead className="text-center">Starter</TableHead>
                      <TableHead className="text-center">Business</TableHead>
                      <TableHead className="text-center">Premium</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {features
                      ?.filter((f) => f.category === category)
                      .map((feature) => (
                        <TableRow key={feature.id}>
                          <TableCell className="font-medium">
                            {feature.feature_name}
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={feature.is_active}
                              onCheckedChange={(checked) =>
                                updateFeature.mutate({
                                  ...feature,
                                  is_active: checked,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={feature.coming_soon}
                              onCheckedChange={(checked) =>
                                updateFeature.mutate({
                                  ...feature,
                                  coming_soon: checked,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Select
                              value={feature.starter_value || "false"}
                              onValueChange={(value) =>
                                updateFeature.mutate({
                                  ...feature,
                                  starter_value: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-[120px] mx-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Sim</SelectItem>
                                <SelectItem value="false">Não</SelectItem>
                                <SelectItem value="Manual">Manual</SelectItem>
                                <SelectItem value="Breve">Em Breve</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="Até 2">Até 2</SelectItem>
                                <SelectItem value="Até 5">Até 5</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-center">
                            <Select
                              value={feature.business_value || "false"}
                              onValueChange={(value) =>
                                updateFeature.mutate({
                                  ...feature,
                                  business_value: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-[120px] mx-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Sim</SelectItem>
                                <SelectItem value="false">Não</SelectItem>
                                <SelectItem value="Manual">Manual</SelectItem>
                                <SelectItem value="Breve">Em Breve</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="Até 2">Até 2</SelectItem>
                                <SelectItem value="Até 5">Até 5</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-center">
                            <Select
                              value={feature.premium_value || "false"}
                              onValueChange={(value) =>
                                updateFeature.mutate({
                                  ...feature,
                                  premium_value: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-[120px] mx-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Sim</SelectItem>
                                <SelectItem value="false">Não</SelectItem>
                                <SelectItem value="Manual">Manual</SelectItem>
                                <SelectItem value="Breve">Em Breve</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="Até 2">Até 2</SelectItem>
                                <SelectItem value="Até 5">Até 5</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
