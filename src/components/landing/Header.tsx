import { Button } from "@/components/ui/button";
import { Cat } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-soft">
            <Cat className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-heading font-bold text-gradient">
            Gat.AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Como Funciona
          </a>
          <a href="#precos" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Preços
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="font-semibold">
              Entrar
            </Button>
          </Link>
          <Link to="/cadastro">
            <Button className="btn-gradient font-semibold text-primary-foreground border-0">
              Começar Grátis
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
