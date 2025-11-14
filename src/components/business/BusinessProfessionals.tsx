import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateProfessionalDialog from "./CreateProfessionalDialog";

interface Professional {
  id: string;
  name: string;
  bio: string;
  specialties: string[];
  rating: number;
  total_reviews: number;
  is_active: boolean;
}

interface BusinessProfessionalsProps {
  businessId: string;
}

const BusinessProfessionals = ({ businessId }: BusinessProfessionalsProps) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const fetchProfessionals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("professionals")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os profissionais",
        variant: "destructive",
      });
    } else {
      setProfessionals(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfessionals();
  }, [businessId]);

  const toggleProfessionalStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("professionals")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    } else {
      toast({ title: "Status atualizado" });
      fetchProfessionals();
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profissionais</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Profissional
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {professionals.map((professional) => (
          <Card key={professional.id} className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{professional.name}</h3>
              <p className="text-sm text-muted-foreground">{professional.bio}</p>
              {professional.specialties && professional.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {professional.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-secondary px-2 py-1 rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span>⭐ {professional.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({professional.total_reviews})
                </span>
              </div>
              <Button
                variant={professional.is_active ? "destructive" : "default"}
                size="sm"
                className="w-full"
                onClick={() =>
                  toggleProfessionalStatus(professional.id, professional.is_active)
                }
              >
                {professional.is_active ? "Desativar" : "Ativar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <CreateProfessionalDialog
        businessId={businessId}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchProfessionals();
        }}
      />
    </div>
  );
};

export default BusinessProfessionals;
