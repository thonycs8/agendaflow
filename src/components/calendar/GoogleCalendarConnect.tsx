import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, ExternalLink, RefreshCw, Unlink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface GoogleCalendarConnectProps {
  professionalId?: string;
}

export function GoogleCalendarConnect({ professionalId }: GoogleCalendarConnectProps) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
    handleOAuthCallback();
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("calendar_integrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "google")
      .maybeSingle();

    setIsConnected(!!data && !error);
    setLoading(false);
  };

  const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state === "google-calendar-connect") {
      setConnecting(true);
      
      try {
        const { data, error } = await supabase.functions.invoke("google-calendar-auth", {
          body: {
            action: "exchangeCode",
            code,
            redirectUri: `${window.location.origin}/callback`,
            userId: user?.id,
            professionalId,
          },
        });

        if (error) throw error;

        toast.success("Google Calendar conectado com sucesso!");
        setIsConnected(true);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error: any) {
        console.error("Error connecting Google Calendar:", error);
        toast.error("Erro ao conectar Google Calendar: " + error.message);
      } finally {
        setConnecting(false);
      }
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("google-calendar-auth", {
        body: {
          action: "getAuthUrl",
          redirectUri: `${window.location.origin}/callback?state=google-calendar-connect`,
        },
      });

      if (error) throw error;

      // Redirect to Google OAuth
      window.location.href = data.authUrl;
    } catch (error: any) {
      console.error("Error getting auth URL:", error);
      toast.error("Erro ao iniciar conexão: " + error.message);
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("calendar_integrations")
        .delete()
        .eq("user_id", user.id)
        .eq("provider", "google");

      if (error) throw error;

      toast.success("Google Calendar desconectado");
      setIsConnected(false);
    } catch (error: any) {
      toast.error("Erro ao desconectar: " + error.message);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Google Calendar</CardTitle>
              <CardDescription>
                Sincronize seus agendamentos com o Google Calendar
              </CardDescription>
            </div>
          </div>
          {isConnected && (
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              <Check className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {isConnected ? (
              <p>
                Seus agendamentos são automaticamente sincronizados com o Google Calendar.
                Alterações feitas aqui ou no Google Calendar são refletidas em ambos.
              </p>
            ) : (
              <p>
                Conecte sua conta do Google para sincronizar automaticamente todos os
                agendamentos com seu calendário pessoal ou profissional.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {isConnected ? (
              <Button variant="outline" onClick={handleDisconnect} className="gap-2">
                <Unlink className="h-4 w-4" />
                Desconectar
              </Button>
            ) : (
              <Button onClick={handleConnect} disabled={connecting} className="gap-2">
                {connecting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                {connecting ? "A conectar..." : "Conectar Google Calendar"}
              </Button>
            )}
          </div>

          {!isConnected && (
            <p className="text-xs text-muted-foreground">
              Nota: Requer configuração de credenciais Google OAuth pelo administrador.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
