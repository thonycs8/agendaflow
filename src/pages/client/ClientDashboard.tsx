import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Star, LogOut, User } from "lucide-react";
import { toast } from "sonner";

const ClientDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalReviews: 0,
    averageRating: 0,
  });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select(`
          *,
          businesses (name),
          services (name, price),
          professionals (name)
        `)
        .eq("client_id", user.id)
        .order("appointment_date", { ascending: false });

      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
        toast.error("Erro ao carregar agendamentos");
      } else {
        setAppointments(appointmentsData || []);
      }

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          *,
          businesses (name),
          professionals (name)
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
      } else {
        setReviews(reviewsData || []);
      }

      // Calculate stats
      const avgRating = reviewsData && reviewsData.length > 0
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length
        : 0;

      setStats({
        totalAppointments: appointmentsData?.length || 0,
        totalReviews: reviewsData?.length || 0,
        averageRating: avgRating,
      });
    };

    fetchData();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: "Pendente", className: "bg-yellow-500" },
      confirmed: { label: "Confirmado", className: "bg-green-500" },
      cancelled: { label: "Cancelado", className: "bg-red-500" },
      completed: { label: "Concluído", className: "bg-blue-500" },
    };
    const { label, className } = statusMap[status] || statusMap.pending;
    return <span className={`px-2 py-1 rounded text-white text-xs ${className}`}>{label}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliações Feitas</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Avaliações</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Meus Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Você ainda não tem agendamentos
                    </p>
                  ) : (
                    appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{appointment.businesses?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.services?.name} - R$ {appointment.services?.price}
                            </p>
                            {appointment.professionals && (
                              <p className="text-sm text-muted-foreground">
                                Profissional: {appointment.professionals.name}
                              </p>
                            )}
                            <p className="text-sm mt-2">
                              {formatDate(appointment.appointment_date)}
                            </p>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground">
                            Observações: {appointment.notes}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Você ainda não fez avaliações
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{review.businesses?.name}</h3>
                            {review.professionals && (
                              <p className="text-sm text-muted-foreground">
                                Profissional: {review.professionals.name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{review.rating}</span>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClientDashboard;
