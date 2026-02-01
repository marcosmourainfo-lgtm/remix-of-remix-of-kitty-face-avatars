import { Check, Crown, Video, Clock, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "Perfeito para experimentar!",
    icon: Sparkles,
    duration: "5 segundos",
    features: [
      { text: "3 vídeos para criar", included: true },
      { text: "Vídeos de 5 segundos", included: true },
      { text: "Formato 9:16 (Stories)", included: true },
      { text: "Download com marca d'água", included: true },
      { text: "Vídeos ilimitados", included: false },
      { text: "Vídeos de 2 minutos", included: false },
    ],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    name: "Premium",
    price: "R$ 9,80",
    period: "/mês",
    description: "Para criadores de conteúdo!",
    icon: Crown,
    duration: "2 minutos",
    features: [
      { text: "Vídeos ilimitados", included: true },
      { text: "Vídeos de até 2 minutos", included: true },
      { text: "Formato 9:16 (Stories)", included: true },
      { text: "Download SEM marca d'água", included: true },
      { text: "Qualidade máxima HD", included: true },
      { text: "Suporte prioritário", included: true },
    ],
    cta: "Assinar Agora",
    popular: true,
  },
];

export const Pricing = () => {
  return (
    <section id="precos" className="py-24 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Planos Flexíveis
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mb-4">
            Escolha seu Plano 🎬
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece grátis com vídeos de 5 segundos ou desbloqueie vídeos de 2 minutos para suas redes!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card-cute relative ${
                plan.popular 
                  ? "border-2 border-primary ring-4 ring-primary/10" 
                  : "border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="gradient-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6 pt-2">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  plan.popular ? "gradient-primary" : "bg-muted"
                }`}>
                  <plan.icon className={`w-8 h-8 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                </div>

                <h3 className="text-2xl font-heading font-bold mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>

                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-heading font-black">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.period}
                  </span>
                </div>

                {/* Duration highlight */}
                <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  plan.popular ? "bg-accent/20" : "bg-primary/10"
                }`}>
                  <Clock className={`w-4 h-4 ${plan.popular ? "text-accent" : "text-primary"}`} />
                  <span className={`font-bold text-sm ${plan.popular ? "text-accent" : "text-primary"}`}>
                    <Video className="w-4 h-4 inline mr-1" />
                    {plan.duration}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/cadastro">
                <Button 
                  className={`w-full font-bold py-6 rounded-xl ${
                    plan.popular 
                      ? "btn-gradient text-primary-foreground border-0" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/precos" className="text-primary hover:underline font-medium">
            Ver detalhes dos planos →
          </Link>
        </div>
      </div>
    </section>
  );
};
