import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cat, Check, X, Crown, ArrowLeft, Sparkles, Video, Clock } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "para sempre",
    description: "Perfeito para experimentar",
    duration: "5 segundos",
    durationIcon: "⏱️",
    features: [
      { text: "3 vídeos por mês", included: true },
      { text: "Vídeos de 5 segundos", included: true },
      { text: "Formato 9:16 (Stories/Reels)", included: true },
      { text: "Download com marca d'água", included: true },
      { text: "Vídeos ilimitados", included: false },
      { text: "Vídeos de 2 minutos", included: false },
      { text: "Sem marca d'água", included: false },
      { text: "Suporte prioritário", included: false },
    ],
    cta: "Começar Grátis",
    href: "/cadastro",
    popular: false,
  },
  {
    name: "Premium",
    price: "R$ 9,80",
    period: "/mês",
    description: "Para criadores de conteúdo",
    duration: "2 minutos",
    durationIcon: "🎬",
    features: [
      { text: "Vídeos ilimitados", included: true },
      { text: "Vídeos de até 2 minutos", included: true },
      { text: "Formato 9:16 (Stories/Reels)", included: true },
      { text: "Download sem marca d'água", included: true },
      { text: "Qualidade máxima HD", included: true },
      { text: "Novos estilos exclusivos", included: true },
      { text: "Geração prioritária", included: true },
      { text: "Suporte prioritário", included: true },
    ],
    cta: "Assinar Premium",
    href: "/assinar-premium",
    popular: true,
  },
];

const Precos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Cat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Gat.AI</span>
          </Link>

          <Link to="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 font-medium">
            <Video className="w-4 h-4" />
            <span>Vídeos para Redes Sociais</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Escolha seu plano 🎬
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie vídeos fofos de gatinhos perfeitos para TikTok, Reels e Stories.
            Comece grátis ou desbloqueie vídeos de 2 minutos!
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-2 bg-card/80 backdrop-blur-sm transition-all ${
                plan.popular
                  ? "border-accent shadow-xl scale-105"
                  : "border-primary/20 hover:border-primary/40"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-accent to-primary px-4 py-1 rounded-full text-sm font-semibold text-primary-foreground flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    Mais Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <CardTitle className="font-display text-2xl text-foreground">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
                
                {/* Duration highlight */}
                <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  plan.popular ? "bg-accent/20" : "bg-primary/10"
                }`}>
                  <Clock className={`w-5 h-5 ${plan.popular ? "text-accent" : "text-primary"}`} />
                  <span className={`font-bold ${plan.popular ? "text-accent" : "text-primary"}`}>
                    {plan.durationIcon} {plan.duration}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                          <X className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      <span
                        className={
                          feature.included ? "text-foreground" : "text-muted-foreground"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.href}>
                  <Button
                    className={`w-full py-6 text-lg font-semibold ${
                      plan.popular
                        ? "bg-gradient-to-r from-accent to-primary hover:opacity-90 text-primary-foreground"
                        : "bg-primary/10 hover:bg-primary/20 text-primary"
                    }`}
                  >
                    {plan.popular && <Sparkles className="w-5 h-5 mr-2" />}
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Use Cases */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Perfeito para suas redes 🚀
          </h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {[
              { icon: "🎵", name: "TikTok", desc: "Vídeos virais" },
              { icon: "📸", name: "Instagram Reels", desc: "Conteúdo criativo" },
              { icon: "📱", name: "Stories", desc: "Posts diários" },
              { icon: "💬", name: "WhatsApp Status", desc: "Compartilhe com amigos" },
              { icon: "▶️", name: "YouTube Shorts", desc: "Vídeos curtos" },
            ].map((platform) => (
              <div
                key={platform.name}
                className="bg-card/80 border border-primary/20 px-4 py-3 rounded-xl text-center min-w-[140px]"
              >
                <div className="text-2xl mb-1">{platform.icon}</div>
                <div className="font-semibold text-foreground">{platform.name}</div>
                <div className="text-xs text-muted-foreground">{platform.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Perguntas frequentes
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            <Card className="border-2 border-primary/20 bg-card/80">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Qual a diferença entre o plano Free e Premium?
                </h3>
                <p className="text-muted-foreground text-sm">
                  No Free você cria 3 vídeos de 5 segundos por mês com marca d'água. 
                  No Premium, vídeos ilimitados de até 2 minutos, sem marca d'água!
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary/20 bg-card/80">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Posso usar os vídeos comercialmente?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Sim! No plano Premium você pode usar os vídeos em suas redes sociais, 
                  canal do YouTube e qualquer plataforma de conteúdo.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary/20 bg-card/80">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Sim! Você pode cancelar sua assinatura quando quiser, sem taxas adicionais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Precos;
