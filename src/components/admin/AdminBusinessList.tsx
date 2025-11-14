import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateBusinessDialog from "./CreateBusinessDialog";

interface Business {
  id: string;
  name: string;
  category: string;
  email: string;
  is_active: boolean;
  rating: number;
  total_reviews: number;
}

const AdminBusinessList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const fetchBusinesses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os negócios",
        variant: "destructive",
      });
    } else {
      setBusinesses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const toggleBusinessStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("businesses")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    } else {
      toast({ title: "Status atualizado com sucesso" });
      fetchBusinesses();
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Negócios Cadastrados</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Negócio
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <Card key={business.id} className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{business.name}</h3>
              <p className="text-sm text-muted-foreground">{business.category}</p>
              <p className="text-sm">{business.email}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm">⭐ {business.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({business.total_reviews} avaliações)
                </span>
              </div>
              <Button
                variant={business.is_active ? "destructive" : "default"}
                size="sm"
                className="w-full"
                onClick={() => toggleBusinessStatus(business.id, business.is_active)}
              >
                {business.is_active ? "Desativar" : "Ativar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <CreateBusinessDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchBusinesses();
        }}
      />
    </div>
  );
};

export default AdminBusinessList;
