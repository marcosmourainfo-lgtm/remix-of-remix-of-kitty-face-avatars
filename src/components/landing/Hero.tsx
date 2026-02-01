import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Cat, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import kitten1 from "@/assets/kitten-1.png";
import kitten2 from "@/assets/kitten-2.png";
import kitten3 from "@/assets/kitten-3.png";

export const Hero = () => {
  return (
    <section className="min-h-screen gradient-hero pt-24 pb-16 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-peach-soft opacity-60 blur-2xl" />
      <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-lavender-soft opacity-60 blur-3xl" />
      <div className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full bg-mint-soft opacity-50 blur-2xl" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 font-medium">
              <Cat className="w-4 h-4" />
              <span>Crie seu avatar único</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black mb-6 leading-tight">
              Personalize seu{" "}
              <span className="text-gradient">avatar de gatinho</span>{" "}
              do seu jeito! 🐱✨
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Escolha acessórios, fundos coloridos e stickers para criar 
              o gatinho mais fofo da internet! Perfeito para redes sociais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/cadastro">
                <Button 
                  size="lg" 
                  className="btn-gradient text-primary-foreground font-bold text-lg px-8 py-6 rounded-2xl border-0 group"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Criar Meu Avatar
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#como-funciona">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="font-bold text-lg px-8 py-6 rounded-2xl border-2"
                >
                  Ver Como Funciona
                </Button>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <span>100% gratuito</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Premium: mais opções exclusivas</span>
              </div>
            </div>
          </div>

          {/* Kitten Avatar Display */}
          <div className="flex-1 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main featured avatar */}
              <div className="relative z-10 floating">
                <div className="card-cute p-4 bg-card/80 backdrop-blur-sm">
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-pink-300 via-rose-200 to-pink-400">
                    {/* Floating decorations */}
                    <span className="absolute top-4 left-4 text-3xl animate-float">💕</span>
                    <span className="absolute top-6 right-6 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>✨</span>
                    <span className="absolute bottom-8 right-8 text-2xl animate-float" style={{ animationDelay: '1s' }}>🌟</span>
                    
                    {/* Crown accessory */}
                    <span className="absolute top-[8%] left-1/2 -translate-x-1/2 text-5xl z-10">👑</span>
                    
                    <img 
                      src={kitten1} 
                      alt="Gatinho fofo personalizado"
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-display font-bold text-xl text-foreground">Mochi</p>
                    <p className="text-sm text-muted-foreground">Seu avatar personalizado! ✨</p>
                  </div>
                </div>
              </div>

              {/* Secondary avatars */}
              <div className="absolute -left-8 top-1/4 z-0 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="card-cute p-2 w-28 sm:w-32">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-300 via-blue-200 to-sky-400">
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl">🎩</span>
                    <img 
                      src={kitten2} 
                      alt="Gatinho fofo secundário"
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-2 right-2 text-xl">⭐</span>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-1/2 z-20 animate-float" style={{ animationDelay: '1s' }}>
                <div className="card-cute p-2 w-28 sm:w-32">
                  <div className="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-purple-300 via-violet-200 to-indigo-400">
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl">🎀</span>
                    <img 
                      src={kitten3} 
                      alt="Gatinho fofo terciário"
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-2 left-2 text-xl">🦋</span>
                  </div>
                </div>
              </div>

              {/* Decorative badges */}
              <div className="absolute -right-6 top-8 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm font-semibold shadow-soft flex items-center gap-1">
                <Star className="w-4 h-4" />
                Único
              </div>

              <div className="absolute -left-4 bottom-24 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-semibold shadow-soft">
                🔥 Trending
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
