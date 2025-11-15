import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Phone, Calendar, Star } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { isClient, isProfessional, isBusinessOwner, isAdmin } = useUserRole();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <AppLayout title="Perfil">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Meu Perfil">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {isAdmin && (
                    <span className="px-2 py-1 text-xs font-medium bg-destructive/10 text-destructive rounded">
                      Admin
                    </span>
                  )}
                  {isBusinessOwner && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                      Proprietário
                    </span>
                  )}
                  {isProfessional && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-500 rounded">
                      Profissional
                    </span>
                  )}
                  {isClient && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500 rounded">
                      Cliente
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {profile?.phone && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{profile.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <Button className="w-full md:w-auto">Editar Perfil</Button>
          </CardContent>
        </Card>

        {isClient && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Minhas Reservas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Você não tem reservas agendadas.
                </p>
                <Button variant="outline" className="mt-4">
                  Ver Histórico Completo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Minhas Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Você ainda não fez nenhuma avaliação.
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {isProfessional && (
          <Card>
            <CardHeader>
              <CardTitle>Painel do Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Acesse seu painel para gerenciar sua agenda e serviços.
              </p>
              <Button>Ir para Painel</Button>
            </CardContent>
          </Card>
        )}

        {isBusinessOwner && (
          <Card>
            <CardHeader>
              <CardTitle>Painel do Proprietário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gerencie seu negócio completo no painel administrativo.
              </p>
              <Button asChild>
                <a href="/business">Ir para Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
