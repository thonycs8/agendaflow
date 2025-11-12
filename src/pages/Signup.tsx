import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    userType: "business", // business or client
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic will be implemented with Lovable Cloud
    console.log("Signup attempt:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 to-background p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-strong p-8">
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <Calendar className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              BookPro
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
                onValueChange={(value) => setFormData({ ...formData, userType: value })}
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {formData.userType === "business" && (
              <div className="space-y-2">
                <Label htmlFor="businessName">Nome do Negócio</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Nome do seu negócio"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
            </div>

            <Button type="submit" className="w-full" variant="hero" size="lg">
              Criar conta grátis
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
