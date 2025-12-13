import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format, addMinutes, isSameDay, parseISO, isWithinInterval, setHours, setMinutes } from "date-fns";
import { pt } from "date-fns/locale";
import { ArrowLeft, ArrowRight, Clock, Euro, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { guestBookingSchema, validateForm } from "@/lib/validation";
interface BookingFlowProps {
  businessId: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

interface Professional {
  id: string;
  name: string;
  avatar_url: string;
  bio: string;
  rating: number;
}

interface Appointment {
  id: string;
  appointment_date: string;
  duration_minutes: number;
  status: string;
}

interface ScheduleBlock {
  id: string;
  start_time: string;
  end_time: string;
}

export const BookingFlow = ({ businessId }: BookingFlowProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [loading, setLoading] = useState(false);

  // Client info for guest booking
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Honeypot field for spam protection
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    fetchServices();
  }, [businessId]);

  useEffect(() => {
    if (selectedService) {
      fetchProfessionals();
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDate && selectedProfessional && selectedService) {
      fetchAvailableTimes();
    }
  }, [selectedDate, selectedProfessional, selectedService]);

  const fetchServices = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("name");

    if (data) setServices(data);
  };

  const fetchProfessionals = async () => {
    const { data } = await supabase
      .from("professionals")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("name");

    if (data) setProfessionals(data);
  };

  const fetchAvailableTimes = async () => {
    if (!selectedDate || !selectedProfessional || !selectedService) return;

    setLoadingTimes(true);
    setSelectedTime("");

    try {
      // Fetch existing appointments for the professional on selected date
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: appointments } = await supabase
        .from("appointments")
        .select("id, appointment_date, duration_minutes, status")
        .eq("professional_id", selectedProfessional.id)
        .gte("appointment_date", startOfDay.toISOString())
        .lte("appointment_date", endOfDay.toISOString())
        .neq("status", "cancelled");

      // Fetch schedule blocks for the professional
      const { data: scheduleBlocks } = await supabase
        .from("schedule_blocks")
        .select("id, start_time, end_time")
        .eq("professional_id", selectedProfessional.id)
        .gte("end_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString());

      // Generate all possible time slots (9:00 - 19:00)
      const allSlots: string[] = [];
      for (let hour = 9; hour <= 19; hour++) {
        allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
        if (hour < 19) {
          allSlots.push(`${hour.toString().padStart(2, "0")}:30`);
        }
      }

      // Filter out unavailable times
      const serviceDuration = selectedService.duration_minutes;
      const availableSlots = allSlots.filter((timeSlot) => {
        const [hours, minutes] = timeSlot.split(":").map(Number);
        const slotStart = new Date(selectedDate);
        slotStart.setHours(hours, minutes, 0, 0);
        const slotEnd = addMinutes(slotStart, serviceDuration);

        // Check if slot is in the past
        if (slotStart < new Date()) return false;

        // Check against existing appointments
        const hasConflictingAppointment = appointments?.some((apt) => {
          const aptStart = parseISO(apt.appointment_date);
          const aptEnd = addMinutes(aptStart, apt.duration_minutes);
          
          // Check for overlap
          return (
            (slotStart >= aptStart && slotStart < aptEnd) ||
            (slotEnd > aptStart && slotEnd <= aptEnd) ||
            (slotStart <= aptStart && slotEnd >= aptEnd)
          );
        });

        if (hasConflictingAppointment) return false;

        // Check against schedule blocks
        const hasBlockConflict = scheduleBlocks?.some((block) => {
          const blockStart = parseISO(block.start_time);
          const blockEnd = parseISO(block.end_time);

          return (
            (slotStart >= blockStart && slotStart < blockEnd) ||
            (slotEnd > blockStart && slotEnd <= blockEnd) ||
            (slotStart <= blockStart && slotEnd >= blockEnd)
          );
        });

        return !hasBlockConflict;
      });

      setAvailableTimes(availableSlots);
    } catch (error) {
      console.error("Error fetching available times:", error);
      toast.error("Erro ao carregar horários disponíveis");
    } finally {
      setLoadingTimes(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Spam protection: if honeypot field is filled, silently reject
    if (honeypot) {
      // Pretend success but don't actually create the booking
      toast.success("Marcação realizada com sucesso!");
      setStep(1);
      return;
    }

    // Validate client info for guest bookings using zod schema
    if (!user) {
      const cleanPhone = clientPhone.replace(/[^0-9+]/g, "");
      const validation = validateForm(guestBookingSchema, {
        clientName: clientName.trim(),
        clientPhone: cleanPhone,
        clientEmail: clientEmail.trim() || undefined,
      });
      
      if (!validation.success) {
        setFormErrors('errors' in validation ? validation.errors : {});
        const firstError = Object.values('errors' in validation ? validation.errors : {})[0];
        toast.error(firstError || "Por favor, corrija os erros no formulário");
        return;
      }
      setFormErrors({});
    }

    setLoading(true);

    try {
      // Create appointment with guest client ID
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      // Use guest client ID for non-authenticated users, or user's ID if logged in
      const clientId = user?.id || "00000000-0000-0000-0000-000000000000";

      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          business_id: businessId,
          professional_id: selectedProfessional.id,
          client_id: clientId,
          service_id: selectedService.id,
          appointment_date: appointmentDateTime.toISOString(),
          duration_minutes: selectedService.duration_minutes,
          status: "pending",
          payment_amount: selectedService.price,
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Create guest booking record if not logged in
      if (!user && appointment) {
        const { error: guestError } = await supabase
          .from("guest_bookings")
          .insert({
            appointment_id: appointment.id,
            client_name: clientName.trim(),
            client_phone: clientPhone.trim(),
            client_email: clientEmail.trim() || null,
          });

        if (guestError) {
          console.error("Error saving guest info:", guestError);
          // Don't fail the booking, just log the error
        }
      }

      toast.success("Marcação realizada com sucesso!");
      
      // Reset form
      setStep(1);
      setSelectedService(null);
      setSelectedProfessional(null);
      setSelectedDate(undefined);
      setSelectedTime("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Erro ao fazer marcação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Agendar Serviço</CardTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Escolha o serviço</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedService?.id === service.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{service.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {service.duration_minutes}min
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Euro className="h-4 w-4" />
                          {service.price.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedService}
                className="w-full"
              >
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Select Professional */}
          {step === 2 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <h3 className="font-semibold text-lg">Escolha o profissional</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {professionals.map((prof) => (
                  <Card
                    key={prof.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProfessional?.id === prof.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedProfessional(prof)}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={prof.avatar_url} />
                        <AvatarFallback>{prof.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{prof.name}</h4>
                        <p className="text-sm text-muted-foreground">{prof.bio}</p>
                        {prof.rating > 0 && (
                          <p className="text-sm mt-1">⭐ {prof.rating.toFixed(1)}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedProfessional}
                className="w-full"
              >
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 3: Select Date */}
          {step === 3 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <h3 className="font-semibold text-lg">Escolha a data</h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  locale={pt}
                  className="rounded-md border"
                />
              </div>
              <Button
                onClick={() => setStep(4)}
                disabled={!selectedDate}
                className="w-full"
              >
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 4: Select Time */}
          {step === 4 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setStep(3)}
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <h3 className="font-semibold text-lg">Escolha o horário</h3>
              <p className="text-sm text-muted-foreground">
                Horários disponíveis para {selectedProfessional?.name} em{" "}
                {selectedDate && format(selectedDate, "dd/MM/yyyy")}
              </p>
              
              {loadingTimes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Carregando horários...</span>
                </div>
              ) : availableTimes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Não há horários disponíveis para esta data.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="mt-4"
                  >
                    Escolher outra data
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "w-full transition-all",
                        selectedTime === time && "ring-2 ring-primary ring-offset-2"
                      )}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
              
              {availableTimes.length > 0 && (
                <Button
                  onClick={() => setStep(5)}
                  disabled={!selectedTime}
                  className="w-full"
                >
                  Próximo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Step 5: Client Info & Confirm */}
          {step === 5 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setStep(4)}
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <h3 className="font-semibold text-lg">Confirmar marcação</h3>

              <Card>
                <CardContent className="p-4 space-y-2">
                  <div><strong>Serviço:</strong> {selectedService?.name}</div>
                  <div><strong>Profissional:</strong> {selectedProfessional?.name}</div>
                  <div>
                    <strong>Data:</strong>{" "}
                    {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                  </div>
                  <div><strong>Horário:</strong> {selectedTime}</div>
                  <div className="text-lg font-bold pt-2">
                    Total: €{selectedService?.price.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              {!user && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold">Seus dados</h4>
                  <div className="space-y-3">
                    {/* Honeypot field - hidden from real users, bots will fill it */}
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    
                    <div>
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input
                        id="name"
                        value={clientName}
                        onChange={(e) => {
                          setClientName(e.target.value);
                          if (formErrors.clientName) setFormErrors({ ...formErrors, clientName: "" });
                        }}
                        placeholder="Seu nome completo"
                        className={formErrors.clientName ? "border-destructive" : ""}
                        maxLength={100}
                        required
                      />
                      {formErrors.clientName && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.clientName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone / Telemóvel *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => {
                          setClientPhone(e.target.value);
                          if (formErrors.clientPhone) setFormErrors({ ...formErrors, clientPhone: "" });
                        }}
                        placeholder="+351 912 345 678"
                        className={formErrors.clientPhone ? "border-destructive" : ""}
                        maxLength={20}
                        required
                      />
                      {formErrors.clientPhone && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.clientPhone}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail (opcional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={clientEmail}
                        onChange={(e) => {
                          setClientEmail(e.target.value);
                          if (formErrors.clientEmail) setFormErrors({ ...formErrors, clientEmail: "" });
                        }}
                        placeholder="seu@email.com"
                        className={formErrors.clientEmail ? "border-destructive" : ""}
                        maxLength={255}
                      />
                      {formErrors.clientEmail && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.clientEmail}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Para receber confirmação por e-mail
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleBooking}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Processando..." : "Confirmar Marcação"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
