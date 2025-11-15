import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Phone, Calendar, Star, Shield, Settings, LayoutDashboard, Users, Building2, FileText, Crown } from "lucide-react";
import { Link } from "react-router-dom";

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
        {isAdmin && (
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 via-background to-background">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Painel de Administrador
                    <Badge variant="destructive" className="ml-2">
                      <Shield className="h-3 w-3 mr-1" />
                      ADMIN
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Acesso completo ao sistema
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" asChild className="justify-start h-auto py-4">
                  <Link to="/admin">
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Dashboard Admin</div>
                      <div className="text-xs text-muted-foreground">Visão geral do sistema</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start h-auto py-4">
                  <Link to="/admin?tab=users">
                    <Users className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Gestão de Usuários</div>
                      <div className="text-xs text-muted-foreground">Gerenciar todos os usuários</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start h-auto py-4">
                  <Link to="/admin?tab=businesses">
                    <Building2 className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Gestão de Negócios</div>
                      <div className="text-xs text-muted-foreground">Gerenciar estabelecimentos</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start h-auto py-4">
                  <Link to="/admin?tab=blog">
                    <FileText className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Gestão de Blog</div>
                      <div className="text-xs text-muted-foreground">Gerenciar posts e conteúdo</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start h-auto py-4">
                  <Link to="/admin?tab=landing">
                    <Crown className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Landing Page</div>
                      <div className="text-xs text-muted-foreground">Editar página inicial</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start h-auto py-4">
                  <Link to="/admin?tab=settings">
                    <Settings className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Configurações</div>
                      <div className="text-xs text-muted-foreground">Configurações do sistema</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                    <Badge variant="destructive" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Administrador
                    </Badge>
                  )}
                  {isBusinessOwner && (
                    <Badge variant="default" className="gap-1">
                      <Building2 className="h-3 w-3" />
                      Proprietário
                    </Badge>
                  )}
                  {isProfessional && (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3" />
                      Profissional
                    </Badge>
                  )}
                  {isClient && (
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      Cliente
                    </Badge>
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
                <Link to="/business">Ir para Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
