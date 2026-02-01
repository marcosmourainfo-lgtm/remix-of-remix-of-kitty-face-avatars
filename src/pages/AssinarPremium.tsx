import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Video, Clock, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AssinarPremium = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setCheckingAuth(false);
    };
    checkAuth();

    // Check if user canceled subscription
    if (searchParams.get("canceled") === "true") {
      toast.info("Assinatura cancelada. Você pode tentar novamente quando quiser.");
    }
  }, [searchParams]);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para assinar");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("URL de checkout não retornada");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Erro ao criar sessão de pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const freePlanFeatures = [
    { text: "3 vídeos por mês", included: true },
    { text: "Vídeos de 5 segundos", included: true },
    { text: "Com marca d'água", included: true },
    { text: "Vídeos ilimitados", included: false },
    { text: "Vídeos de 2 minutos", included: false },
    { text: "Sem marca d'água", included: false },
  ];

  const premiumPlanFeatures = [
    { text: "Vídeos ilimitados", included: true },
    { text: "Vídeos de até 2 minutos", included: true },
    { text: "Sem marca d'água", included: true },
    { text: "Suporte prioritário", included: true },
    { text: "Acesso a novos recursos", included: true },
    { text: "Qualidade HD", included: true },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-primary flex items-center gap-2"
          >
            <span className="text-3xl">🐱</span>
            Gat.AI
          </button>
          {isAuthenticated ? (
            <Button variant="outline" onClick={() => navigate("/meus-videos")}>
              Meus Vídeos
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate("/login")}>
              Entrar
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Crown className="h-3 w-3 mr-1" />
            Plano Premium
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Desbloqueie Todo o Potencial
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crie vídeos incríveis de gatinhos sem limites. 
            Assine o Premium e transforme suas ideias em realidade.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-2 border-muted">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Gratuito</CardTitle>
              <CardDescription>Para começar a explorar</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground/50"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => navigate(isAuthenticated ? "/criar-video" : "/cadastro")}
              >
                {isAuthenticated ? "Continuar Grátis" : "Criar Conta Grátis"}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-primary shadow-lg shadow-primary/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Mais Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                Premium
              </CardTitle>
              <CardDescription>Para criadores sérios</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 9,80</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {premiumPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent-foreground flex-shrink-0" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Assinar Premium
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Cancele quando quiser. Sem compromisso.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Por que escolher o Premium?</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 rounded-xl bg-card border">
              <Video className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Vídeos Ilimitados</h3>
              <p className="text-sm text-muted-foreground">
                Crie quantos vídeos quiser, sem restrições
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border">
              <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Até 2 Minutos</h3>
              <p className="text-sm text-muted-foreground">
                Vídeos mais longos para contar histórias completas
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border">
              <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Sem Marca D'água</h3>
              <p className="text-sm text-muted-foreground">
                Vídeos limpos e profissionais para compartilhar
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Como funciona o pagamento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  O pagamento é processado de forma segura pelo Stripe. Você pode usar cartão de crédito ou débito.
                  A cobrança é mensal e você pode cancelar a qualquer momento.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Posso cancelar quando quiser?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sim! Você pode cancelar sua assinatura a qualquer momento. 
                  Você continuará tendo acesso até o final do período pago.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">O que acontece com meus vídeos se eu cancelar?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seus vídeos criados continuam disponíveis na sua conta. 
                  Você apenas volta para o plano gratuito com as limitações normais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Gat.AI - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default AssinarPremium;
