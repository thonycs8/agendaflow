import { Link } from "react-router-dom";
import {
  User,
  Calendar,
  CreditCard,
  DollarSign,
  Settings,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  Award,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { icon: User, label: "Meu Perfil", path: "/profile" },
  { icon: Calendar, label: "Minhas Reservas", path: "/minhas-reservas" },
  { icon: Award, label: "Minhas Assinaturas", path: "/assinaturas" },
  { icon: DollarSign, label: "Pagamentos & Faturas", path: "/pagamentos" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const helpItems = [
  { icon: HelpCircle, label: "FAQ", path: "/faq" },
  { icon: Shield, label: "Política de Privacidade", path: "/privacidade" },
  { icon: FileText, label: "Termos de Uso", path: "/termos" },
  { icon: CreditCard, label: "Política de Reembolso", path: "/reembolso" },
  { icon: Shield, label: "GDPR", path: "/gdpr" },
];

export const SideMenu = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold">Menu</h2>
      </div>

      <nav className="flex-1 px-3">
        <div className="space-y-1 mb-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Ajuda & Suporte
          </p>
          {helpItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-3 pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};
