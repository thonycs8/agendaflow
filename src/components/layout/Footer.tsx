import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Agenda Flow</h3>
            <p className="text-sm text-muted-foreground">
              Plataforma completa de agendamento para salões e barbearias
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacidade"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  to="/termos"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  to="/reembolso"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Política de Reembolso
                </Link>
              </li>
              <li>
                <Link
                  to="/gdpr"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GDPR
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Empresa</h4>
            <p className="text-sm text-muted-foreground">
              Desenvolvido por{" "}
              <a
                href="https://missaodesign.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Missão Design
              </a>
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Agenda Flow. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
