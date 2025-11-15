import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  services_included: any[];
  is_active: boolean;
}

export default function MembershipPlans() {
  const { user } = useAuth();
  const { isBusinessOwner, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (!roleLoading && !isBusinessOwner) {
      navigate("/login");
    }
  }, [isBusinessOwner, roleLoading, navigate]);

  const fetchPlans = async () => {
    if (!user) return;

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!business) {
      setLoading(false);
      return;
    }

    setBusinessId(business.id);

    const { data } = await supabase
      .from("membership_plans")
      .select("*")
      .eq("business_id", business.id)
      .order("price", { ascending: true });

    setPlans((data || []).map(p => ({
      ...p,
      services_included: Array.isArray(p.services_included) ? p.services_included : []
    })));
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("membership_plans").insert({
      business_id: businessId,
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      services_included: [],
    });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o plano",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Plano criado com sucesso",
    });

    setDialogOpen(false);
    setFormData({ name: "", price: "", description: "" });
    fetchPlans();
  };

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("membership_plans")
      .update({ is_active: !currentStatus })
      .eq("id", planId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o plano",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Plano atualizado",
    });

    fetchPlans();
  };

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Planos de Fidelização</h1>
          <p className="text-muted-foreground">Gerir planos mensais para clientes</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Plano
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Plano</DialogTitle>
              <DialogDescription>Preencha os detalhes do plano</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Plano</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Basic Clip"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Preço Mensal (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="50.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descreva o que está incluído..."
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                Criar Plano
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Crown className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum plano criado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie planos de fidelização para os seus clientes
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Plano
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              {plan.is_active && (
                <div className="absolute top-4 right-4">
                  <Badge>Ativo</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">€{plan.price}</span>
                  <span className="text-muted-foreground">/mês</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{plan.description}</p>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Benefícios:</h4>
                  <ul className="space-y-1">
                    {plan.description.split("•").filter(Boolean).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>{benefit.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.is_active ? "outline" : "default"}
                  className="w-full"
                  onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                >
                  {plan.is_active ? "Desativar" : "Ativar"} Plano
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Planos</CardTitle>
          <CardDescription>
            Exemplos de planos populares em barbearias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">Basic Clip</h4>
              <p className="text-2xl font-bold">€50/mês</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 1 corte por semana</li>
                <li>• 10% desconto em extras</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg space-y-2 border-primary">
              <Badge className="mb-2">Popular</Badge>
              <h4 className="font-medium">Beard Master</h4>
              <p className="text-2xl font-bold">€65/mês</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 1 corte + barba por semana</li>
                <li>• Ajuste de barba grátis</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">Men's Premium</h4>
              <p className="text-2xl font-bold">€90/mês</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Cortes ilimitados</li>
                <li>• Barba ilimitada</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
