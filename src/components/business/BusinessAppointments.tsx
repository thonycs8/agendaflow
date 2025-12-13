import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, X, Pencil } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const { toast } = useToast();

  const fetchAppointments = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        services(name),
        professionals(name)
      `)
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

    const appointmentIds = (data || []).map(a => a.id);
    
    const { data: guestBookings } = await supabase
      .from("guest_bookings")
      .select("appointment_id, client_name, client_phone, client_email")
      .in("appointment_id", appointmentIds);

    const guestMap = new Map(
      guestBookings?.map(g => [g.appointment_id, g]) || []
    );

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

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;
    
    await updateStatus(selectedAppointment.id, "cancelled");
    setCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    const currentDate = new Date(appointment.appointment_date);
    setNewDate(format(currentDate, "yyyy-MM-dd"));
    setNewTime(format(currentDate, "HH:mm"));
    setRescheduleDialogOpen(true);
  };

  const confirmReschedule = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    const newDateTime = new Date(`${newDate}T${newTime}:00`);
    
    const { error } = await supabase
      .from("appointments")
      .update({ appointment_date: newDateTime.toISOString() })
      .eq("id", selectedAppointment.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o horário",
        variant: "destructive",
      });
    } else {
      toast({ title: "Horário alterado com sucesso" });
      fetchAppointments();
    }

    setRescheduleDialogOpen(false);
    setSelectedAppointment(null);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "completed": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Pendente";
      case "confirmed": return "Confirmado";
      case "completed": return "Concluído";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  const canModifyAppointment = (appointment: Appointment) => {
    return appointment.status !== "cancelled" && appointment.status !== "completed";
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Agendamentos</h2>
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{appointment.client_name}</h3>
                    {appointment.is_guest && (
                      <Badge variant="outline" className="text-xs">Convidado</Badge>
                    )}
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
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
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(appointment.appointment_date), "PPP 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Serviço: {appointment.services?.name} • {appointment.duration_minutes} min
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
                <div className="flex flex-wrap gap-2">
                  {appointment.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(appointment.id, "confirmed")}
                    >
                      Confirmar
                    </Button>
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
                  {canModifyAppointment(appointment) && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRescheduleClick(appointment)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Alterar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelClick(appointment)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja cancelar este agendamento?
              {selectedAppointment && (
                <span className="block mt-2 font-medium text-foreground">
                  {selectedAppointment.client_name} - {selectedAppointment.services?.name}
                  <br />
                  {format(new Date(selectedAppointment.appointment_date), "PPP 'às' HH:mm", { locale: ptBR })}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não, manter</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Horário</DialogTitle>
            <DialogDescription>
              Escolha a nova data e hora para o agendamento.
              {selectedAppointment && (
                <span className="block mt-2 font-medium text-foreground">
                  Cliente: {selectedAppointment.client_name}
                  <br />
                  Serviço: {selectedAppointment.services?.name}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Nova Data</Label>
              <Input
                id="date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Novo Horário</Label>
              <Input
                id="time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmReschedule}>
              Confirmar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessAppointments;
