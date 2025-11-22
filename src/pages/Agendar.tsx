import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const Agendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const serviceIdParam = searchParams.get("serviceId");

  const [services, setServices] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (serviceIdParam) {
      setSelectedService(serviceIdParam);
    }
  }, [serviceIdParam]);

  useEffect(() => {
    if (selectedService) {
      fetchProfessionals(selectedService);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDate && selectedProfessional) {
      generateAvailableTimes();
    }
  }, [selectedDate, selectedProfessional]);

  const fetchServices = async () => {
    const { data } = await supabase
      .from("services")
      .select("*, businesses(name)")
      .eq("is_active", true)
      .order("name");

    if (data) setServices(data);
  };

  const fetchProfessionals = async (serviceId: string) => {
    const { data: service } = await supabase
      .from("services")
      .select("business_id")
      .eq("id", serviceId)
      .single();

    if (service) {
      const { data } = await supabase
        .from("professionals")
        .select("*")
        .eq("business_id", service.business_id)
        .eq("is_active", true);

      if (data) setProfessionals(data);
    }
  };

  const generateAvailableTimes = () => {
    const times: string[] = [];
    for (let hour = 9; hour <= 18; hour++) {
      times.push(`${hour.toString().padStart(2, "0")}:00`);
      times.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    setAvailableTimes(times);
  };

  const handleBooking = async () => {
    if (!user || !selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const service = services.find((s) => s.id === selectedService);
    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

    const { error } = await supabase.from("appointments").insert({
      business_id: service.business_id,
      professional_id: selectedProfessional,
      client_id: user.id,
      service_id: selectedService,
      appointment_date: appointmentDateTime.toISOString(),
      duration_minutes: service.duration_minutes,
      status: "pending",
      payment_amount: service.price,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível agendar o serviço",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Agendamento realizado com sucesso",
      });
      
      setSelectedService("");
      setSelectedProfessional("");
      setSelectedDate(undefined);
      setSelectedTime("");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Agendar Novo Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Serviço</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - €{service.price} ({service.businesses?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedService && (
              <div>
                <label className="text-sm font-medium mb-2 block">Profissional</label>
                <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedProfessional && (
              <div>
                <label className="text-sm font-medium mb-2 block">Data</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={pt}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
            )}

            {selectedDate && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Horário - {format(selectedDate, "dd 'de' MMMM", { locale: pt })}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      size="sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleBooking}
              disabled={loading || !selectedService || !selectedProfessional || !selectedDate || !selectedTime}
              className="w-full"
            >
              {loading ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Agendar;
