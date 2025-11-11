import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic will be implemented with Lovable Cloud
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 to-background p-4">
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
            <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta</h1>
            <p className="text-muted-foreground">Entre na sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Palavra-passe</Label>
                <Link to="/recuperar-senha" className="text-sm text-primary hover:underline">
                  Esqueceu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" variant="hero" size="lg">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Não tem conta? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Criar conta grátis
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

export default Login;
