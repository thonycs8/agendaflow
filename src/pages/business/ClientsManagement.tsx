import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, Calendar, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  total_appointments: number;
  last_visit: string | null;
  total_spent: number;
  avg_rating: number;
}

export default function ClientsManagement() {
  const { user } = useAuth();
  const { isBusinessOwner, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientHistory, setClientHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!roleLoading && !isBusinessOwner) {
      navigate("/login");
    }
  }, [isBusinessOwner, roleLoading, navigate]);

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;

      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (!business) {
        setLoading(false);
        return;
      }

      // Get all appointments with client info
      const { data: appointments } = await supabase
        .from("appointments")
        .select(`
          client_id,
          appointment_date,
          payment_amount,
          profiles!appointments_client_id_fkey (
            id,
            full_name,
            phone
          )
        `)
        .eq("business_id", business.id)
        .order("appointment_date", { ascending: false });

      if (!appointments) {
        setLoading(false);
        return;
      }

      // Aggregate client data
      const clientMap = new Map<string, Client>();

      for (const apt of appointments) {
        const clientId = apt.client_id;
        const profile = apt.profiles as any;

        if (!clientMap.has(clientId)) {
          clientMap.set(clientId, {
            id: clientId,
            full_name: profile?.full_name || "Cliente",
            email: "", // We don't have email in profiles
            phone: profile?.phone || null,
            total_appointments: 0,
            last_visit: null,
            total_spent: 0,
            avg_rating: 0,
          });
        }

        const client = clientMap.get(clientId)!;
        client.total_appointments += 1;
        client.total_spent += Number(apt.payment_amount || 0);

        if (!client.last_visit || apt.appointment_date > client.last_visit) {
          client.last_visit = apt.appointment_date;
        }
      }

      const clientsList = Array.from(clientMap.values()).sort(
        (a, b) => b.total_appointments - a.total_appointments
      );

      setClients(clientsList);
      setFilteredClients(clientsList);
      setLoading(false);
    };

    fetchClients();
  }, [user]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter((client) =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
    );

    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleViewClient = async (client: Client) => {
    setSelectedClient(client);

    if (!user) return;

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!business) return;

    const { data: history } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        payment_amount,
        status,
        services (name),
        professionals (name)
      `)
      .eq("business_id", business.id)
      .eq("client_id", client.id)
      .order("appointment_date", { ascending: false });

    setClientHistory(history || []);
  };

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
          <p className="text-muted-foreground">CRM - Base de dados de clientes</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Procurar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">{filteredClients.length} clientes</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Visitas</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead>Total Gasto</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {client.full_name}
                    </div>
                  </TableCell>
                  <TableCell>{client.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.total_appointments}</Badge>
                  </TableCell>
                  <TableCell>
                    {client.last_visit
                      ? new Date(client.last_visit).toLocaleDateString("pt-PT")
                      : "—"}
                  </TableCell>
                  <TableCell className="font-medium">
                    €{client.total_spent.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClient(client)}
                    >
                      Ver Histórico
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Histórico do Cliente</DialogTitle>
            <DialogDescription>
              {selectedClient?.full_name} • {selectedClient?.total_appointments} visitas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {selectedClient?.total_appointments}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Visitas</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    €{selectedClient?.total_spent.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Gasto</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    €
                    {selectedClient
                      ? (
                          selectedClient.total_spent / selectedClient.total_appointments
                        ).toFixed(2)
                      : "0"}
                  </div>
                  <div className="text-xs text-muted-foreground">Ticket Médio</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Histórico de Atendimentos</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {clientHistory.map((apt: any) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {new Date(apt.appointment_date).toLocaleDateString("pt-PT")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {apt.services?.name} • {apt.professionals?.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">€{Number(apt.payment_amount || 0).toFixed(2)}</div>
                      <Badge
                        variant={
                          apt.status === "completed"
                            ? "default"
                            : apt.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
