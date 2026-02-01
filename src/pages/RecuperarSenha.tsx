import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cat, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) throw error;

      setSent(true);
      toast({
        title: "Email enviado! 📧",
        description: "Verifique sua caixa de entrada.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center p-4">
      <div className="absolute top-10 left-10 text-6xl animate-float opacity-50">🐱</div>
      <div className="absolute bottom-10 right-10 text-6xl animate-float opacity-50" style={{ animationDelay: "1s" }}>😺</div>
      
      <div className="w-full max-w-md">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para login
        </Link>
        
        <Card className="border-2 border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-float">
              {sent ? (
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Cat className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-display text-foreground">
                {sent ? "Email enviado!" : "Recuperar senha"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {sent 
                  ? "Verifique sua caixa de entrada e siga as instruções."
                  : "Digite seu email para receber um link de recuperação."
                }
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Não recebeu o email? Verifique sua pasta de spam ou tente novamente.
                </p>
                <Button 
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full border-primary/30 hover:bg-primary/10"
                >
                  Tentar novamente
                </Button>
                <Link to="/login" className="block">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                  >
                    Voltar para login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-primary/30 focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecuperarSenha;
