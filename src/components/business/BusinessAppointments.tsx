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
  client_phone?: string;
  client_email?: string;
  is_guest?: boolean;
  services: { name: string } | null;
  professionals: { name: string } | null;
}

interface BusinessAppointmentsProps {
  businessId: string;
}

const GUEST_CLIENT_ID = "00000000-0000-0000-0000-000000000000";

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
      .order("appointment_date", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Get appointment IDs for guest bookings lookup
    const appointmentIds = (data || []).map(a => a.id);
    
    // Fetch guest bookings
    const { data: guestBookings } = await supabase
      .from("guest_bookings")
      .select("appointment_id, client_name, client_phone, client_email")
      .in("appointment_id", appointmentIds);

    const guestMap = new Map(
      guestBookings?.map(g => [g.appointment_id, g]) || []
    );

    // Fetch client names from profiles for registered users
    const registeredClientIds = [...new Set(
      (data || [])
        .filter(a => a.client_id !== GUEST_CLIENT_ID)
        .map(a => a.client_id)
    )];
    
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .in("id", registeredClientIds);

    const profileMap = new Map(
      profiles?.map(p => [p.id, { name: p.full_name, phone: p.phone }]) || []
    );

    const enrichedAppointments = (data || []).map(appointment => {
      const isGuest = appointment.client_id === GUEST_CLIENT_ID;
      const guestInfo = guestMap.get(appointment.id);
      const profileInfo = profileMap.get(appointment.client_id);

      return {
        ...appointment,
        is_guest: isGuest,
        client_name: isGuest 
          ? guestInfo?.client_name || "Cliente Convidado"
          : profileInfo?.name || "Cliente",
        client_phone: isGuest 
          ? guestInfo?.client_phone 
          : profileInfo?.phone,
        client_email: guestInfo?.client_email,
      };
    });

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
                  {appointment.is_guest && (
                    <Badge variant="outline" className="text-xs">Convidado</Badge>
                  )}
                  <Badge>{appointment.status}</Badge>
                </div>
                {appointment.client_phone && (
                  <p className="text-sm text-muted-foreground">
                    📱 {appointment.client_phone}
                  </p>
                )}
                {appointment.client_email && (
                  <p className="text-sm text-muted-foreground">
                    ✉️ {appointment.client_email}
                  </p>
                )}
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
