import { Cat, Palette, Share2, Crown, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: Cat,
    step: "1",
    title: "Escolha seu gatinho",
    description: "Selecione entre nossos adoráveis gatinhos como base para seu avatar único.",
    color: "bg-peach-soft",
  },
  {
    icon: Palette,
    step: "2",
    title: "Personalize tudo",
    description: "Adicione acessórios, escolha fundos coloridos, stickers e muito mais!",
    color: "bg-lavender-soft",
  },
  {
    icon: Download,
    step: "3",
    title: "Salve e compartilhe",
    description: "Baixe seu avatar em alta qualidade e mostre para todos nas redes sociais!",
    color: "bg-mint-soft",
  },
];

export const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Simples e Divertido
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mb-4">
            Como Funciona? 🎨
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Criar seu avatar personalizado de gatinho é super fácil! 
            Siga estes 3 passos simples:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-border" />
              )}

              <div className="card-cute text-center relative">
                <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {step.step}
                </div>

                <h3 className="text-xl font-heading font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Premium feature highlight */}
        <div className="mt-16 card-cute p-8 max-w-3xl mx-auto bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-200/50 dark:border-amber-700/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                  Seja Premium <span className="text-2xl">👑</span>
                </h3>
                <p className="text-muted-foreground">
                  Desbloqueie acessórios exclusivos, fundos especiais e muito mais!
                </p>
              </div>
            </div>
            <a href="#precos">
              <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-primary-foreground font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Ver Planos
              </button>
            </a>
          </div>
        </div>

        {/* Use cases */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">Use seu avatar em:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: "📸", name: "Instagram" },
              { icon: "🐦", name: "Twitter/X" },
              { icon: "💬", name: "WhatsApp" },
              { icon: "🎮", name: "Discord" },
              { icon: "📧", name: "E-mail" },
            ].map((platform) => (
              <div
                key={platform.name}
                className="bg-card/80 backdrop-blur-sm border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm"
              >
                <span className="text-lg">{platform.icon}</span>
                <span className="font-medium text-foreground">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
