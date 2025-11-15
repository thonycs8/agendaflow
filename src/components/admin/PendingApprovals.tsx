import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, User, Building } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PendingApproval {
  id: string;
  user_id: string;
  approval_type: string;
  business_id: string | null;
  status: string;
  requested_at: string;
  metadata: any;
  profiles: {
    full_name: string;
    phone: string | null;
  };
  businesses?: {
    name: string;
  };
}

export const PendingApprovals = () => {
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const { data: approvalsData, error } = await supabase
        .from("pending_approvals")
        .select("*")
        .eq("status", "pending")
        .order("requested_at", { ascending: false });

      if (error) throw error;

      // Fetch related data manually
      const enrichedData = await Promise.all(
        (approvalsData || []).map(async (approval) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", approval.user_id)
            .single();

          const { data: business } = approval.business_id
            ? await supabase
                .from("businesses")
                .select("name")
                .eq("id", approval.business_id)
                .single()
            : { data: null };

          return {
            ...approval,
            profiles: profile || { full_name: "Usuário", phone: null },
            businesses: business,
          };
        })
      );

      setApprovals(enrichedData);
    } catch (error) {
      console.error("Error fetching approvals:", error);
      toast.error("Erro ao carregar aprovações pendentes");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (approvalId: string, status: "approved" | "rejected", userId: string, approvalType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Update approval status
      const { error: updateError } = await supabase
        .from("pending_approvals")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          notes: notes[approvalId] || null,
        })
        .eq("id", approvalId);

      if (updateError) throw updateError;

      // If approved, add the role
      if (status === "approved") {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{
            user_id: userId,
            role: approvalType as "admin" | "business_owner" | "professional" | "client",
          }]);

        if (roleError && !roleError.message.includes("duplicate")) {
          throw roleError;
        }
      }

      toast.success(status === "approved" ? "Aprovado com sucesso!" : "Rejeitado");
      fetchApprovals();
    } catch (error) {
      console.error("Error handling approval:", error);
      toast.error("Erro ao processar aprovação");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      {approvals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma aprovação pendente
          </CardContent>
        </Card>
      ) : (
        approvals.map((approval) => (
          <Card key={approval.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {approval.approval_type === "professional" ? (
                    <User className="h-5 w-5 text-primary" />
                  ) : (
                    <Building className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      {approval.profiles?.full_name || "Usuário"}
                    </CardTitle>
                    <CardDescription>
                      {approval.approval_type === "professional"
                        ? "Solicitação de Profissional"
                        : "Solicitação de Proprietário"}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  Pendente
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {approval.businesses && (
                <div>
                  <span className="text-sm text-muted-foreground">Negócio: </span>
                  <span className="font-medium">{approval.businesses.name}</span>
                </div>
              )}
              {approval.profiles?.phone && (
                <div>
                  <span className="text-sm text-muted-foreground">Telefone: </span>
                  <span className="font-medium">{approval.profiles.phone}</span>
                </div>
              )}
              <div>
                <span className="text-sm text-muted-foreground">Data da Solicitação: </span>
                <span className="font-medium">
                  {new Date(approval.requested_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`notes-${approval.id}`}>Notas (opcional)</Label>
                <Textarea
                  id={`notes-${approval.id}`}
                  placeholder="Adicione notas sobre esta aprovação..."
                  value={notes[approval.id] || ""}
                  onChange={(e) => setNotes({ ...notes, [approval.id]: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleApproval(approval.id, "approved", approval.user_id, approval.approval_type)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleApproval(approval.id, "rejected", approval.user_id, approval.approval_type)}
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
