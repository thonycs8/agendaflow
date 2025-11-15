import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Pause, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CreateServiceDialog from "./CreateServiceDialog";
import EditServiceDialog from "./EditServiceDialog";

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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
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
      toast({ 
        title: currentStatus ? "Serviço pausado" : "Serviço ativado",
        description: currentStatus 
          ? "O serviço não aparecerá mais para agendamento" 
          : "O serviço está disponível para agendamento"
      });
      fetchServices();
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceToDelete);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o serviço",
        variant: "destructive",
      });
    } else {
      toast({ title: "Serviço excluído com sucesso" });
      fetchServices();
    }
    
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
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
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{service.name}</h3>
                  {service.is_active ? (
                    <span className="text-xs text-green-600 dark:text-green-400">Ativo</span>
                  ) : (
                    <span className="text-xs text-orange-600 dark:text-orange-400">Pausado</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
              <div className="flex justify-between text-sm">
                <span>{service.duration_minutes} min</span>
                <span className="font-bold">€{service.price.toFixed(2)}</span>
              </div>
              
              <TooltipProvider>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(service)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={service.is_active ? "secondary" : "default"}
                        size="sm"
                        onClick={() => toggleServiceStatus(service.id, service.is_active)}
                      >
                        {service.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{service.is_active ? "Pausar serviço" : "Ativar serviço"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipProvider>
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

      <EditServiceDialog
        service={selectedService}
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedService(null);
        }}
        onSuccess={() => {
          setShowEditDialog(false);
          setSelectedService(null);
          fetchServices();
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O serviço será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setServiceToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BusinessServices;
