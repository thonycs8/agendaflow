import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Users, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

interface Appointment {
  id: string;
  appointment_date: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
  professional_id: string | null;
  service_id: string | null;
  client_id: string;
  business_id: string;
  professionals?: { name: string; avatar_url: string | null };
  services?: { name: string; price: number };
  profiles?: { full_name: string };
}

interface Professional {
  id: string;
  name: string;
  avatar_url: string | null;
  user_id: string | null;
}

interface UnifiedCalendarProps {
  businessId?: string;
  professionalId?: string;
  showAllProfessionals?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-green-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500",
};

export function UnifiedCalendar({ businessId, professionalId, showAllProfessionals = false }: UnifiedCalendarProps) {
  const { user } = useAuth();
  const { isAdmin, isBusinessOwner } = useUserRole();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

  useEffect(() => {
    if (businessId || professionalId) {
      fetchData();
      setupRealtimeSubscription();
    }
  }, [businessId, professionalId, currentWeek, selectedProfessional]);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("appointments-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: businessId ? `business_id=eq.${businessId}` : undefined,
        },
        (payload) => {
          console.log("Realtime update:", payload);
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchAppointments(), fetchProfessionals()]);
    setLoading(false);
  };

  const fetchProfessionals = async () => {
    if (!businessId) return;

    const { data, error } = await supabase
      .from("professionals")
      .select("id, name, avatar_url, user_id")
      .eq("business_id", businessId)
      .eq("is_active", true);

    if (!error && data) {
      setProfessionals(data);
    }
  };

  const fetchAppointments = async () => {
    let query = supabase
      .from("appointments")
      .select(`
        *,
        professionals:professional_id(name, avatar_url),
        services:service_id(name, price)
      `)
      .gte("appointment_date", weekStart.toISOString())
      .lte("appointment_date", weekEnd.toISOString())
      .neq("status", "cancelled");

    if (businessId) {
      query = query.eq("business_id", businessId);
    }

    if (professionalId) {
      query = query.eq("professional_id", professionalId);
    } else if (selectedProfessional !== "all") {
      query = query.eq("professional_id", selectedProfessional);
    }

    const { data, error } = await query;

    if (!error && data) {
      // Fetch client profiles separately
      const clientIds = [...new Set(data.map((a) => a.client_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", clientIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      setAppointments(
        data.map((a) => ({
          ...a,
          profiles: profileMap.get(a.client_id),
        }))
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  const getAppointmentsForSlot = (day: Date, hour: number) => {
    return appointments.filter((apt) => {
      const aptDate = parseISO(apt.appointment_date);
      return isSameDay(aptDate, day) && aptDate.getHours() === hour;
    });
  };

  const getProfessionalColor = (professionalId: string) => {
    const colors = [
      "bg-blue-200 border-blue-400",
      "bg-green-200 border-green-400",
      "bg-purple-200 border-purple-400",
      "bg-orange-200 border-orange-400",
      "bg-pink-200 border-pink-400",
      "bg-teal-200 border-teal-400",
    ];
    const index = professionals.findIndex((p) => p.id === professionalId);
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">A carregar calendário...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Calendário Sincronizado</CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {showAllProfessionals && professionals.length > 0 && (
              <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                <SelectTrigger className="w-[180px]">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {professionals.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentWeek(new Date())}>
                Hoje
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {format(weekStart, "d 'de' MMMM", { locale: pt })} - {format(weekEnd, "d 'de' MMMM 'de' yyyy", { locale: pt })}
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header with days */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-2 text-sm font-medium text-muted-foreground">Hora</div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`p-2 text-center border-l ${
                  isSameDay(day, new Date()) ? "bg-primary/10" : ""
                }`}
              >
                <div className="text-xs text-muted-foreground uppercase">
                  {format(day, "EEE", { locale: pt })}
                </div>
                <div className={`text-lg font-semibold ${isSameDay(day, new Date()) ? "text-primary" : ""}`}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b hover:bg-muted/30 transition-colors">
              <div className="p-2 text-sm text-muted-foreground border-r">
                {`${hour.toString().padStart(2, "0")}:00`}
              </div>
              {weekDays.map((day) => {
                const slotAppointments = getAppointmentsForSlot(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={`p-1 min-h-[60px] border-l relative ${
                      isSameDay(day, new Date()) ? "bg-primary/5" : ""
                    }`}
                  >
                    {slotAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1 rounded border mb-1 cursor-pointer hover:opacity-80 transition-opacity ${
                          selectedProfessional === "all" && apt.professional_id
                            ? getProfessionalColor(apt.professional_id)
                            : "bg-primary/20 border-primary/40"
                        }`}
                        title={`${apt.services?.name || "Serviço"} - ${apt.profiles?.full_name || "Cliente"}`}
                      >
                        <div className="font-medium truncate">
                          {apt.services?.name || "Serviço"}
                        </div>
                        <div className="truncate text-muted-foreground">
                          {apt.profiles?.full_name || "Cliente"}
                        </div>
                        {selectedProfessional === "all" && apt.professionals && (
                          <div className="truncate font-medium mt-0.5">
                            {apt.professionals.name}
                          </div>
                        )}
                        <Badge
                          variant="outline"
                          className={`${STATUS_COLORS[apt.status || "pending"]} text-white text-[10px] mt-1`}
                        >
                          {apt.status === "pending" && "Pendente"}
                          {apt.status === "confirmed" && "Confirmado"}
                          {apt.status === "completed" && "Concluído"}
                          {apt.status === "cancelled" && "Cancelado"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        {showAllProfessionals && selectedProfessional === "all" && professionals.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Legenda:</p>
            <div className="flex flex-wrap gap-2">
              {professionals.map((p, index) => {
                const colors = [
                  "bg-blue-200",
                  "bg-green-200",
                  "bg-purple-200",
                  "bg-orange-200",
                  "bg-pink-200",
                  "bg-teal-200",
                ];
                return (
                  <Badge key={p.id} variant="outline" className={colors[index % colors.length]}>
                    {p.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
