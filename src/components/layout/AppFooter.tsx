import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

export const AppFooter = () => {
  return (
    <footer className="hidden md:block border-t border-border/40 bg-background mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Agenda Flow
              </span>
            </Link>
            <p className="text-xs text-muted-foreground">
              Plataforma completa de gestão de agendamentos para o seu negócio
            </p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacidade" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link 
                  to="/termos" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link 
                  to="/gdpr" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  GDPR
                </Link>
              </li>
              <li>
                <Link 
                  to="/reembolso" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Política de Reembolso
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/faq" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacto" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Sobre</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/developer" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Desenvolvedor
                </Link>
              </li>
              <li>
                <a 
                  href="https://missaodesign.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Missão Design
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Agenda Flow. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Desenvolvido por{" "}
              <a 
                href="https://missaodesign.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                Missão Design
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
