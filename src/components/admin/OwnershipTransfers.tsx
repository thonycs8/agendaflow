import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, XCircle, ArrowRightLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface OwnershipTransfer {
  id: string;
  business_id: string;
  current_owner_id: string;
  new_owner_id: string;
  status: string;
  requested_at: string;
  notes: string | null;
  businesses: {
    name: string;
  };
  current_owner: {
    full_name: string;
  };
  new_owner: {
    full_name: string;
  };
}

export const OwnershipTransfers = () => {
  const [transfers, setTransfers] = useState<OwnershipTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const { data: transfersData, error } = await supabase
        .from("ownership_transfers")
        .select("*")
        .eq("status", "pending")
        .order("requested_at", { ascending: false });

      if (error) throw error;

      // Fetch related data manually
      const enrichedData = await Promise.all(
        (transfersData || []).map(async (transfer) => {
          const { data: business } = await supabase
            .from("businesses")
            .select("name")
            .eq("id", transfer.business_id)
            .single();

          const { data: currentOwner } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", transfer.current_owner_id)
            .single();

          const { data: newOwner } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", transfer.new_owner_id)
            .single();

          return {
            ...transfer,
            businesses: business || { name: "Negócio" },
            current_owner: currentOwner || { full_name: "Proprietário" },
            new_owner: newOwner || { full_name: "Novo Proprietário" },
          };
        })
      );

      setTransfers(enrichedData);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      toast.error("Erro ao carregar transferências");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (transfer: OwnershipTransfer, approve: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const newStatus = approve ? "approved" : "rejected";

      // Update transfer status
      const { error: updateError } = await supabase
        .from("ownership_transfers")
        .update({
          status: newStatus,
          completed_at: new Date().toISOString(),
          approved_by: user.id,
          notes: adminNotes[transfer.id] || transfer.notes,
        })
        .eq("id", transfer.id);

      if (updateError) throw updateError;

      // If approved, update business owner
      if (approve) {
        const { error: businessError } = await supabase
          .from("businesses")
          .update({ owner_id: transfer.new_owner_id })
          .eq("id", transfer.business_id);

        if (businessError) throw businessError;

        // Add business_owner role to new owner if not exists
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{
            user_id: transfer.new_owner_id,
            role: "business_owner" as const,
          }]);

        if (roleError && !roleError.message.includes("duplicate")) {
          throw roleError;
        }
      }

      toast.success(approve ? "Transferência aprovada!" : "Transferência rejeitada");
      fetchTransfers();
    } catch (error) {
      console.error("Error handling transfer:", error);
      toast.error("Erro ao processar transferência");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      {transfers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma transferência pendente
          </CardContent>
        </Card>
      ) : (
        transfers.map((transfer) => (
          <Card key={transfer.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">
                      {transfer.businesses.name}
                    </CardTitle>
                    <CardDescription>Transferência de Propriedade</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">Pendente</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Proprietário Atual:</span>
                  <span className="font-medium">{transfer.current_owner.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Novo Proprietário:</span>
                  <span className="font-medium">{transfer.new_owner.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Solicitado em:</span>
                  <span className="font-medium">
                    {new Date(transfer.requested_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {transfer.notes && (
                <div>
                  <Label>Motivo:</Label>
                  <p className="text-sm text-muted-foreground mt-1">{transfer.notes}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`admin-notes-${transfer.id}`}>Notas do Admin (opcional)</Label>
                <Textarea
                  id={`admin-notes-${transfer.id}`}
                  placeholder="Adicione notas sobre esta transferência..."
                  value={adminNotes[transfer.id] || ""}
                  onChange={(e) => setAdminNotes({ ...adminNotes, [transfer.id]: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleTransfer(transfer, true)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleTransfer(transfer, false)}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
