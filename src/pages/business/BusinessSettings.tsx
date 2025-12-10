import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Clock, Calendar, Save, Building2, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { TransferOwnershipDialog } from "@/components/business/TransferOwnershipDialog";

const settingsSchema = z.object({
  opening_hours: z.record(z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido (HH:MM)"),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido (HH:MM)"),
    closed: z.boolean()
  })),
  default_service_duration: z.number().min(15).max(240),
  booking_buffer_minutes: z.number().min(0).max(60),
  advance_booking_days: z.number().min(1).max(90),
  cancellation_hours: z.number().min(1).max(72)
});

interface OpeningHours {
  [key: string]: {
    start: string;
    end: string;
    closed: boolean;
  };
}

export default function BusinessSettings() {
  const { user } = useAuth();
  const { isBusinessOwner, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string>("");
  const [settingsId, setSettingsId] = useState<string>("");
  const [business, setBusiness] = useState<any>(null);
  
  const [openingHours, setOpeningHours] = useState<OpeningHours>({
    monday: { start: "09:00", end: "18:00", closed: false },
    tuesday: { start: "09:00", end: "18:00", closed: false },
    wednesday: { start: "09:00", end: "18:00", closed: false },
    thursday: { start: "09:00", end: "18:00", closed: false },
    friday: { start: "09:00", end: "18:00", closed: false },
    saturday: { start: "09:00", end: "14:00", closed: false },
    sunday: { start: "09:00", end: "18:00", closed: true },
  });

  const [holidays, setHolidays] = useState<string[]>([]);
  const [newHoliday, setNewHoliday] = useState("");

  const [bookingSettings, setBookingSettings] = useState({
    default_service_duration: 30,
    booking_buffer_minutes: 15,
    advance_booking_days: 30,
    cancellation_hours: 24,
  });

  const [prices, setPrices] = useState({
    basic_cut: "15.00",
    cut_and_beard: "25.00",
    beard_only: "12.00",
  });

  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    if (!roleLoading && !isBusinessOwner) {
      navigate("/login");
    }
  }, [isBusinessOwner, roleLoading, navigate]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      const { data: businessData } = await supabase
        .from("businesses")
        .select("id, name, whatsapp_number")
        .eq("owner_id", user.id)
        .single();

      if (!businessData) {
        setLoading(false);
        return;
      }

      setBusinessId(businessData.id);
      setBusiness(businessData);
      setWhatsappNumber(businessData.whatsapp_number || "");

      const { data: settings } = await supabase
        .from("business_settings")
        .select("*")
        .eq("business_id", businessData.id)
        .single();

      if (settings) {
        setSettingsId(settings.id);
        if (settings.opening_hours && typeof settings.opening_hours === 'object') {
          setOpeningHours(settings.opening_hours as OpeningHours);
        }
        if (Array.isArray(settings.holidays)) {
          setHolidays(settings.holidays.filter((h): h is string => typeof h === 'string'));
        }
        setBookingSettings({
          default_service_duration: settings.default_service_duration || 30,
          booking_buffer_minutes: settings.booking_buffer_minutes || 15,
          advance_booking_days: settings.advance_booking_days || 30,
          cancellation_hours: settings.cancellation_hours || 24,
        });
      } else {
        // Create default settings
        const { data: newSettings } = await supabase
          .from("business_settings")
          .insert({
            business_id: businessData.id,
            opening_hours: openingHours,
            holidays: [],
            ...bookingSettings,
          })
          .select()
          .single();

        if (newSettings) {
          setSettingsId(newSettings.id);
        }
      }

      setLoading(false);
    };

    fetchSettings();
  }, [user]);

  const handleSaveOpeningHours = async () => {
    try {
      const validated = settingsSchema.parse({
        opening_hours: openingHours,
        ...bookingSettings
      });

      const { error } = await supabase
        .from("business_settings")
        .update({ opening_hours: validated.opening_hours })
        .eq("id", settingsId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Horários de funcionamento atualizados",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: err.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar os horários",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddHoliday = () => {
    if (!newHoliday) return;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newHoliday)) {
      toast({
        title: "Formato inválido",
        description: "Use o formato AAAA-MM-DD",
        variant: "destructive",
      });
      return;
    }

    if (holidays.includes(newHoliday)) {
      toast({
        title: "Data já existe",
        description: "Esta data já está na lista de feriados",
        variant: "destructive",
      });
      return;
    }

    const updated = [...holidays, newHoliday].sort();
    setHolidays(updated);
    setNewHoliday("");
  };

  const handleRemoveHoliday = (date: string) => {
    setHolidays(holidays.filter((h) => h !== date));
  };

  const handleSaveHolidays = async () => {
    const { error } = await supabase
      .from("business_settings")
      .update({ holidays })
      .eq("id", settingsId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os feriados",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Feriados atualizados",
    });
  };

  const handleSaveBookingSettings = async () => {
    try {
      const validated = settingsSchema.parse({
        opening_hours: openingHours,
        ...bookingSettings
      });

      const { error } = await supabase
        .from("business_settings")
        .update({
          default_service_duration: validated.default_service_duration,
          booking_buffer_minutes: validated.booking_buffer_minutes,
          advance_booking_days: validated.advance_booking_days,
          cancellation_hours: validated.cancellation_hours,
        })
        .eq("id", settingsId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configurações de agendamento atualizadas",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: err.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar as configurações",
          variant: "destructive",
        });
      }
    }
  };

  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Configurações do Negócio</h1>
          <p className="text-muted-foreground">
            Gerir horários, feriados e parâmetros de agendamento
          </p>
        </div>
      </div>

      <Tabs defaultValue="hours" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hours">
            <Clock className="mr-2 h-4 w-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="holidays">
            <Calendar className="mr-2 h-4 w-4" />
            Feriados
          </TabsTrigger>
          <TabsTrigger value="booking">
            <Settings className="mr-2 h-4 w-4" />
            Agendamento
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription>
                Configure os horários de abertura e fecho para cada dia da semana
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(dayNames).map(([key, name]) => (
                <div key={key} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-32 font-medium">{name}</div>
                  <div className="flex items-center gap-4 flex-1">
                    {!openingHours[key]?.closed ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Abertura</Label>
                          <Input
                            type="time"
                            value={openingHours[key]?.start || "09:00"}
                            onChange={(e) =>
                              setOpeningHours({
                                ...openingHours,
                                [key]: { ...openingHours[key], start: e.target.value },
                              })
                            }
                            className="w-32"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Fecho</Label>
                          <Input
                            type="time"
                            value={openingHours[key]?.end || "18:00"}
                            onChange={(e) =>
                              setOpeningHours({
                                ...openingHours,
                                [key]: { ...openingHours[key], end: e.target.value },
                              })
                            }
                            className="w-32"
                          />
                        </div>
                      </>
                    ) : (
                      <Badge variant="secondary">Fechado</Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOpeningHours({
                        ...openingHours,
                        [key]: {
                          ...openingHours[key],
                          closed: !openingHours[key]?.closed,
                        },
                      })
                    }
                  >
                    {openingHours[key]?.closed ? "Abrir" : "Fechar"}
                  </Button>
                </div>
              ))}

              <Button onClick={handleSaveOpeningHours} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Guardar Horários
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays">
          <Card>
            <CardHeader>
              <CardTitle>Feriados e Dias Fechados</CardTitle>
              <CardDescription>
                Adicione datas específicas em que o negócio estará fechado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newHoliday}
                  onChange={(e) => setNewHoliday(e.target.value)}
                  placeholder="Selecionar data"
                  className="flex-1"
                />
                <Button onClick={handleAddHoliday}>Adicionar</Button>
              </div>

              <div className="space-y-2">
                {holidays.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum feriado registado
                  </p>
                ) : (
                  holidays.map((date) => (
                    <div
                      key={date}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(date).toLocaleDateString("pt-PT")}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveHoliday(date)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <Button onClick={handleSaveHolidays} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Guardar Feriados
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Agendamento</CardTitle>
              <CardDescription>
                Defina parâmetros gerais para agendamentos de clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Duração Padrão do Serviço (minutos)</Label>
                <Input
                  type="number"
                  min="15"
                  max="240"
                  value={bookingSettings.default_service_duration}
                  onChange={(e) =>
                    setBookingSettings({
                      ...bookingSettings,
                      default_service_duration: parseInt(e.target.value) || 30,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Tempo estimado por serviço (15-240 minutos)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Intervalo Entre Agendamentos (minutos)</Label>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={bookingSettings.booking_buffer_minutes}
                  onChange={(e) =>
                    setBookingSettings({
                      ...bookingSettings,
                      booking_buffer_minutes: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Tempo de buffer entre serviços (0-60 minutos)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Antecedência Máxima para Agendamento (dias)</Label>
                <Input
                  type="number"
                  min="1"
                  max="90"
                  value={bookingSettings.advance_booking_days}
                  onChange={(e) =>
                    setBookingSettings({
                      ...bookingSettings,
                      advance_booking_days: parseInt(e.target.value) || 30,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Quantos dias no futuro os clientes podem agendar (1-90 dias)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Prazo Mínimo para Cancelamento (horas)</Label>
                <Input
                  type="number"
                  min="1"
                  max="72"
                  value={bookingSettings.cancellation_hours}
                  onChange={(e) =>
                    setBookingSettings({
                      ...bookingSettings,
                      cancellation_hours: parseInt(e.target.value) || 24,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Horas de antecedência necessárias para cancelar (1-72 horas)
                </p>
              </div>

              <Button onClick={handleSaveBookingSettings} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                Configuração do WhatsApp
              </CardTitle>
              <CardDescription>
                Configure o número de WhatsApp que será exibido no botão flutuante da sua página pública
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Número do WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+351 912 345 678"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Inclua o código do país (ex: +351 para Portugal, +55 para Brasil)
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Pré-visualização</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  O botão flutuante do WhatsApp aparecerá no canto inferior direito da página pública do seu estabelecimento.
                </p>
                {whatsappNumber && (
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <span className="text-sm">{whatsappNumber}</span>
                  </div>
                )}
              </div>

              <Button 
                onClick={async () => {
                  const { error } = await supabase
                    .from("businesses")
                    .update({ whatsapp_number: whatsappNumber })
                    .eq("id", businessId);

                  if (error) {
                    toast({
                      title: "Erro",
                      description: "Não foi possível guardar o número do WhatsApp",
                      variant: "destructive",
                    });
                  } else {
                    toast({
                      title: "Sucesso",
                      description: "Número do WhatsApp atualizado",
                    });
                  }
                }} 
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                Guardar Número do WhatsApp
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ownership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transferência de Propriedade</CardTitle>
              <CardDescription>
                Transfira a propriedade deste negócio para um dos seus profissionais.
                Esta ação requer aprovação do administrador.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-warning/50 bg-warning/5 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">⚠️ Atenção</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Apenas profissionais com conta de usuário podem receber a propriedade</li>
                    <li>Você perderá o acesso administrativo completo ao negócio</li>
                    <li>A transferência precisa ser aprovada por um administrador</li>
                    <li>Após a aprovação, a ação não pode ser revertida</li>
                  </ul>
                </div>

                <TransferOwnershipDialog 
                  businessId={businessId}
                  businessName={business?.name || "Negócio"}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
