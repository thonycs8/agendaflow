import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateServiceDialog from "./CreateServiceDialog";

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

interface BusinessServicesProps {
  businessId: string;
}

const BusinessServices = ({ businessId }: BusinessServicesProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços",
        variant: "destructive",
      });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, [businessId]);

  const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("services")
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
      fetchServices();
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Serviços</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Serviço
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <div className="flex justify-between text-sm">
                <span>{service.duration_minutes} min</span>
                <span className="font-bold">€{service.price.toFixed(2)}</span>
              </div>
              <Button
                variant={service.is_active ? "destructive" : "default"}
                size="sm"
                className="w-full"
                onClick={() => toggleServiceStatus(service.id, service.is_active)}
              >
                {service.is_active ? "Desativar" : "Ativar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <CreateServiceDialog
        businessId={businessId}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchServices();
        }}
      />
    </div>
  );
};

export default BusinessServices;
