import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  appointment_date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
  duration_minutes: number;
  client_id: string;
  client_name?: string;
  services: { name: string } | null;
  professionals: { name: string } | null;
}

interface BusinessAppointmentsProps {
  businessId: string;
}

const BusinessAppointments = ({ businessId }: BusinessAppointmentsProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    setLoading(true);
    
    // Fetch appointments with services and professionals
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        services(name),
        professionals(name)
      `
      )
      .eq("business_id", businessId)
      .order("appointment_date", { ascending: true });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Fetch client names from profiles
    const clientIds = [...new Set((data || []).map(a => a.client_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", clientIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

    const enrichedAppointments = (data || []).map(appointment => ({
      ...appointment,
      client_name: profileMap.get(appointment.client_id) || "Cliente"
    }));

    setAppointments(enrichedAppointments as Appointment[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [businessId]);

  const updateStatus = async (id: string, newStatus: "pending" | "confirmed" | "completed" | "cancelled") => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    } else {
      toast({ title: "Status atualizado" });
      fetchAppointments();
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Agendamentos</h2>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{appointment.client_name}</h3>
                  <Badge>{appointment.status}</Badge>
                </div>
                <p className="text-sm">
                  {format(new Date(appointment.appointment_date), "PPP 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Serviço: {appointment.services?.name} • {appointment.duration_minutes}{" "}
                  min
                </p>
                {appointment.professionals && (
                  <p className="text-sm text-muted-foreground">
                    Profissional: {appointment.professionals.name}
                  </p>
                )}
                {appointment.notes && (
                  <p className="text-sm text-muted-foreground">
                    Obs: {appointment.notes}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {appointment.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => updateStatus(appointment.id, "confirmed")}
                    >
                      Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateStatus(appointment.id, "cancelled")}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
                {appointment.status === "confirmed" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateStatus(appointment.id, "completed")}
                  >
                    Concluir
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessAppointments;
