import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
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

interface Appointment {
  id: string;
  appointment_date: string;
  duration_minutes: number;
  status: string;
  notes: string;
  services?: { name: string };
  professionals?: { name: string };
  businesses?: { name: string; address: string };
}

const Agenda = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          services(name),
          professionals(name),
          businesses(name, address)
        `)
        .eq("client_id", user?.id)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus agendamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Agendamento cancelado com sucesso",
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar o agendamento",
        variant: "destructive",
      });
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) =>
      new Date(apt.appointment_date) >= new Date() &&
      apt.status !== "cancelled" &&
      apt.status !== "completed"
  );

  const pastAppointments = appointments.filter(
    (apt) =>
      new Date(apt.appointment_date) < new Date() ||
      apt.status === "cancelled" ||
      apt.status === "completed"
  );

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minha Agenda</h1>
            <p className="text-muted-foreground">
              Gerencie seus agendamentos
            </p>
          </div>
          <Button onClick={() => window.location.href = "/servicos"}>
            <Calendar className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando agendamentos...</p>
          </div>
        ) : (
          <>
            {/* Próximos Agendamentos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Próximos Agendamentos</h2>
              {upcomingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Você não tem agendamentos futuros
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => (window.location.href = "/servicos")}
                    >
                      Agendar Serviço
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {upcomingAppointments.map((apt) => (
                    <Card key={apt.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">
                              {apt.services?.name}
                            </CardTitle>
                            {apt.businesses && (
                              <p className="text-sm text-muted-foreground">
                                {apt.businesses.name}
                              </p>
                            )}
                          </div>
                          <Badge className={getStatusColor(apt.status)}>
                            {getStatusLabel(apt.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(
                                new Date(apt.appointment_date),
                                "PPP 'às' HH:mm",
                                { locale: ptBR }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{apt.duration_minutes} minutos</span>
                          </div>
                          {apt.professionals && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{apt.professionals.name}</span>
                            </div>
                          )}
                          {apt.businesses?.address && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{apt.businesses.address}</span>
                            </div>
                          )}
                        </div>

                        {apt.notes && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">
                              <strong>Observações:</strong> {apt.notes}
                            </p>
                          </div>
                        )}

                        {apt.status === "pending" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => setCancelingId(apt.id)}
                          >
                            Cancelar Agendamento
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Histórico */}
            {pastAppointments.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Histórico</h2>
                <div className="grid gap-4">
                  {pastAppointments.map((apt) => (
                    <Card key={apt.id} className="opacity-75">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">
                              {apt.services?.name}
                            </CardTitle>
                            {apt.businesses && (
                              <p className="text-sm text-muted-foreground">
                                {apt.businesses.name}
                              </p>
                            )}
                          </div>
                          <Badge className={getStatusColor(apt.status)}>
                            {getStatusLabel(apt.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(
                              new Date(apt.appointment_date),
                              "PPP 'às' HH:mm",
                              { locale: ptBR }
                            )}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <AlertDialog
          open={!!cancelingId}
          onOpenChange={() => setCancelingId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja cancelar este agendamento? Esta ação não
                pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Não, manter</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => cancelingId && handleCancelAppointment(cancelingId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sim, cancelar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default Agenda;
