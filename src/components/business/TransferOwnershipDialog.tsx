import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const transferSchema = z.object({
  professional_id: z.string().min(1, "Selecione um profissional"),
  notes: z.string().min(10, "Forneça uma justificativa com pelo menos 10 caracteres").max(500, "Máximo 500 caracteres"),
});

interface Professional {
  id: string;
  name: string;
  user_id: string | null;
}

interface TransferOwnershipDialogProps {
  businessId: string;
  businessName: string;
}

export const TransferOwnershipDialog = ({ businessId, businessName }: TransferOwnershipDialogProps) => {
  const [open, setOpen] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      professional_id: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchProfessionals();
    }
  }, [open, businessId]);

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select("id, name, user_id")
        .eq("business_id", businessId)
        .eq("is_active", true)
        .not("user_id", "is", null);

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error("Error fetching professionals:", error);
      toast.error("Erro ao carregar profissionais");
    }
  };

  const onSubmit = async (values: z.infer<typeof transferSchema>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const professional = professionals.find(p => p.id === values.professional_id);
      if (!professional?.user_id) {
        throw new Error("Profissional inválido");
      }

      const { error } = await supabase
        .from("ownership_transfers")
        .insert({
          business_id: businessId,
          current_owner_id: user.id,
          new_owner_id: professional.user_id,
          notes: values.notes,
          status: "pending",
        });

      if (error) throw error;

      toast.success("Solicitação de transferência enviada para aprovação do admin!");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Error creating transfer request:", error);
      toast.error(error.message || "Erro ao criar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          Transferir Propriedade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir Propriedade</DialogTitle>
          <DialogDescription>
            Solicite a transferência de propriedade de "{businessName}" para um dos seus profissionais.
            Esta ação requer aprovação do administrador.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="professional_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo Proprietário</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um profissional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {professionals.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          Nenhum profissional disponível
                        </div>
                      ) : (
                        professionals.map((prof) => (
                          <SelectItem key={prof.id} value={prof.id}>
                            {prof.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Apenas profissionais com conta de usuário podem receber a propriedade
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justificativa</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explique o motivo da transferência..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Forneça uma justificativa clara para a transferência (10-500 caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || professionals.length === 0}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Solicitar Transferência"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
