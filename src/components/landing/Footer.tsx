import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Cat, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = forwardRef<HTMLElement, ComponentPropsWithoutRef<"footer">>(
  ({ className, ...props }, ref) => {
  return (
    <footer
      ref={ref}
      className={`py-12 bg-muted/30 border-t border-border ${className ?? ""}`}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Cat className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-gradient">
              Gat.AI
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <a href="#como-funciona" className="text-muted-foreground hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#precos" className="text-muted-foreground hover:text-primary transition-colors">
              Preços
            </a>
            <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
              Entrar
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> para amantes de gatinhos
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Gat.AI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
  },
);

Footer.displayName = "Footer";
