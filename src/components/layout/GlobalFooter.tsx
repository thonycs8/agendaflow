import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

export const GlobalFooter = () => {
  return (
    <footer className="hidden md:block border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Agenda Flow
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Plataforma completa de gestão de agendamentos para o seu negócio
            </p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacidade" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link 
                  to="/termos" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link 
                  to="/gdpr" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GDPR
                </Link>
              </li>
              <li>
                <Link 
                  to="/reembolso" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Política de Reembolso
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/faq" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacto" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-4">Sobre</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/developer" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Desenvolvedor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Agenda Flow. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground">
              Desenvolvido por <span className="font-semibold text-foreground">Agenda Flow Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
