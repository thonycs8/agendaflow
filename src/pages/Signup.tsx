import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, AlertCircle, Check, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { signupSchema, validateForm } from "@/lib/validation";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    userType: "business" as "business" | "client",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password strength indicators
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm(signupSchema, formData);
    if (!validation.success) {
      setErrors('errors' in validation ? validation.errors : {});
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.name,
            user_type: formData.userType,
            business_name: formData.businessName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Note: Role assignment is now handled by the handle_new_user() database trigger
        // The trigger reads user_type from raw_user_meta_data and assigns the appropriate role
        
        // Create business if business name provided and user type is business
        if (formData.userType === "business" && formData.businessName) {
          const { error: businessError } = await supabase
            .from("businesses")
            .insert({
              name: formData.businessName,
              owner_id: data.user.id,
            });

          if (businessError) {
            console.error("Error creating business:", businessError);
          }
        }

        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode fazer login.",
        });
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const PasswordStrengthIndicator = () => (
    <div className="mt-2 space-y-1">
      {[
        { check: passwordChecks.length, label: "Mínimo 8 caracteres" },
        { check: passwordChecks.uppercase, label: "Uma letra maiúscula" },
        { check: passwordChecks.lowercase, label: "Uma letra minúscula" },
        { check: passwordChecks.number, label: "Um número" },
      ].map(({ check, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs">
          {check ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-muted-foreground" />
          )}
          <span className={check ? "text-green-600" : "text-muted-foreground"}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 to-background p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-strong p-8">
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <Calendar className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Agenda Flow
            </span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Crie a sua conta</h1>
            <p className="text-muted-foreground">Comece grátis por 14 dias</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>Tipo de conta</Label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) => handleInputChange("userType", value)}
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business" className="cursor-pointer flex-1">
                    <div className="font-medium">Negócio</div>
                    <div className="text-xs text-muted-foreground">Salões, barbearias, escritórios, restaurantes</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client" className="cursor-pointer flex-1">
                    <div className="font-medium">Cliente</div>
                    <div className="text-xs text-muted-foreground">Quero fazer agendamentos</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
                maxLength={100}
                required
              />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>

            {formData.userType === "business" && (
              <div className="space-y-2">
                <Label htmlFor="businessName">Nome do Negócio</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Nome do seu negócio"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  className={errors.businessName ? "border-destructive" : ""}
                  maxLength={100}
                  required
                />
                {errors.businessName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.businessName}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
                maxLength={255}
                required
              />
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-destructive" : ""}
                maxLength={128}
                required
              />
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.password}
                </p>
              )}
              {formData.password && <PasswordStrengthIndicator />}
            </div>

            <Button type="submit" className="w-full" variant="hero" size="lg" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta grátis"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Já tem conta? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Entrar
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Ao continuar, concorda com os nossos{" "}
          <Link to="/termos" className="text-primary hover:underline">
            Termos de Uso
          </Link>{" "}
          e{" "}
          <Link to="/privacidade" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
