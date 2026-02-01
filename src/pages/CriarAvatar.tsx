import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, Sparkles, Download, Crown, LogOut, Wand2, RotateCcw, Loader2, ChevronRight, Palette, Eye, Shirt, ImageIcon, Heart, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Cat breed options
const catTypes = [
  { id: "persian", label: "Persa", emoji: "🐱", description: "Fofo e peludo" },
  { id: "siamese", label: "Siamês", emoji: "😺", description: "Elegante" },
  { id: "scottish", label: "Scottish Fold", emoji: "🙀", description: "Orelhas dobradas" },
  { id: "maine-coon", label: "Maine Coon", emoji: "🦁", description: "Majestoso" },
  { id: "british", label: "British Shorthair", emoji: "😸", description: "Redondinho" },
  { id: "munchkin", label: "Munchkin", emoji: "🐈", description: "Perninhas curtas" },
  { id: "bengal", label: "Bengal", emoji: "🐆", description: "Exótico" },
  { id: "ragdoll", label: "Ragdoll", emoji: "😻", description: "Olhos azuis" },
];

// Fur colors
const furColors = [
  { id: "orange", label: "Laranja", color: "#f97316", gradient: "from-orange-400 to-amber-500" },
  { id: "gray", label: "Cinza", color: "#6b7280", gradient: "from-gray-400 to-slate-500" },
  { id: "white", label: "Branco", color: "#f5f5f4", gradient: "from-stone-100 to-white" },
  { id: "black", label: "Preto", color: "#1c1917", gradient: "from-stone-800 to-black" },
  { id: "calico", label: "Malhado", color: "#fbbf24", gradient: "from-orange-300 via-white to-gray-800" },
  { id: "tuxedo", label: "Tuxedo", color: "#18181b", gradient: "from-black via-white to-black" },
  { id: "cream", label: "Creme", color: "#fef3c7", gradient: "from-amber-100 to-orange-100" },
  { id: "brown", label: "Marrom", color: "#92400e", gradient: "from-amber-700 to-yellow-800" },
];

// Eye colors
const eyeColors = [
  { id: "blue", label: "Azul", color: "#3b82f6" },
  { id: "green", label: "Verde", color: "#22c55e" },
  { id: "gold", label: "Dourado", color: "#eab308" },
  { id: "heterochromia", label: "Heterocromia", color: "linear-gradient(90deg, #3b82f6 50%, #eab308 50%)" },
  { id: "copper", label: "Cobre", color: "#b45309" },
  { id: "aqua", label: "Aqua", color: "#06b6d4" },
];

// Accessories
const accessories = [
  { id: "none", label: "Nenhum", emoji: "❌" },
  { id: "crown", label: "Coroa Real", emoji: "👑" },
  { id: "wizard-hat", label: "Chapéu de Mago", emoji: "🧙" },
  { id: "bow", label: "Laço Fofo", emoji: "🎀" },
  { id: "glasses", label: "Óculos", emoji: "👓" },
  { id: "flower-crown", label: "Coroa de Flores", emoji: "🌸" },
  { id: "scarf", label: "Cachecol", emoji: "🧣" },
  { id: "superhero-cape", label: "Capa de Herói", emoji: "🦸" },
  { id: "pirate-hat", label: "Chapéu Pirata", emoji: "🏴‍☠️" },
];

// Backgrounds
const backgrounds = [
  { id: "galaxy", label: "Galáxia", emoji: "🌌", gradient: "from-purple-900 via-indigo-800 to-blue-900" },
  { id: "garden", label: "Jardim", emoji: "🌷", gradient: "from-green-400 via-emerald-300 to-teal-400" },
  { id: "sunset", label: "Pôr do Sol", emoji: "🌅", gradient: "from-orange-400 via-pink-400 to-purple-500" },
  { id: "winter", label: "Inverno", emoji: "❄️", gradient: "from-cyan-200 via-blue-200 to-indigo-300" },
  { id: "castle", label: "Castelo", emoji: "🏰", gradient: "from-violet-400 via-purple-400 to-indigo-500" },
  { id: "beach", label: "Praia", emoji: "🏖️", gradient: "from-cyan-400 via-sky-300 to-blue-400" },
  { id: "sakura", label: "Sakura", emoji: "🌸", gradient: "from-pink-300 via-rose-200 to-pink-400" },
  { id: "rainbow", label: "Arco-íris", emoji: "🌈", gradient: "from-red-400 via-yellow-300 to-green-400" },
];

// Personalities/Expressions
const personalities = [
  { id: "happy", label: "Feliz", emoji: "😊" },
  { id: "sleepy", label: "Sonolento", emoji: "😴" },
  { id: "curious", label: "Curioso", emoji: "🧐" },
  { id: "playful", label: "Brincalhão", emoji: "😜" },
  { id: "royal", label: "Real", emoji: "👑" },
  { id: "shy", label: "Tímido", emoji: "🥺" },
];

// Art styles
const artStyles = [
  { id: "anime", label: "Anime", emoji: "🎌", description: "Estilo kawaii japonês" },
  { id: "realistic", label: "Realista", emoji: "📷", description: "Como uma foto" },
  { id: "chibi", label: "Chibi", emoji: "🎎", description: "Super fofo" },
  { id: "watercolor", label: "Aquarela", emoji: "🎨", description: "Artístico" },
  { id: "pixel", label: "Pixel Art", emoji: "👾", description: "Retrô" },
  { id: "3d", label: "3D Pixar", emoji: "🎬", description: "Estilo animação" },
];

type Step = "breed" | "fur" | "eyes" | "accessory" | "background" | "personality" | "style" | "generate";

const steps: { id: Step; label: string; icon: any }[] = [
  { id: "breed", label: "Raça", icon: Cat },
  { id: "fur", label: "Pelo", icon: Palette },
  { id: "eyes", label: "Olhos", icon: Eye },
  { id: "accessory", label: "Acessório", icon: Shirt },
  { id: "background", label: "Fundo", icon: ImageIcon },
  { id: "personality", label: "Expressão", icon: Heart },
  { id: "style", label: "Estilo", icon: Sparkles },
  { id: "generate", label: "Criar!", icon: Wand2 },
];

const CriarAvatar = () => {
  const [currentStep, setCurrentStep] = useState<Step>("breed");
  const [selectedCatType, setSelectedCatType] = useState(catTypes[0].id);
  const [selectedFurColor, setSelectedFurColor] = useState(furColors[0].id);
  const [selectedEyeColor, setSelectedEyeColor] = useState(eyeColors[0].id);
  const [selectedAccessory, setSelectedAccessory] = useState("none");
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0].id);
  const [selectedPersonality, setSelectedPersonality] = useState(personalities[0].id);
  const [selectedStyle, setSelectedStyle] = useState(artStyles[0].id);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadProfile();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
  };

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setIsPremium(data.plan === "premium");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);

  const nextStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const handleReset = () => {
    setSelectedCatType(catTypes[0].id);
    setSelectedFurColor(furColors[0].id);
    setSelectedEyeColor(eyeColors[0].id);
    setSelectedAccessory("none");
    setSelectedBackground(backgrounds[0].id);
    setSelectedPersonality(personalities[0].id);
    setSelectedStyle(artStyles[0].id);
    setGeneratedImage(null);
    setCurrentStep("breed");
  };

  const handleGenerate = async () => {
    if (!isPremium) {
      sonnerToast.error("Recurso Premium", {
        description: "A geração de avatares com IA é exclusiva para assinantes Premium!",
        action: {
          label: "Assinar",
          onClick: () => navigate("/assinar-premium"),
        },
      });
      return;
    }

    setIsGenerating(true);
    sonnerToast.loading("Gerando seu avatar mágico...", { id: "generating" });

    try {
      const { data, error } = await supabase.functions.invoke("generate-avatar", {
        body: {
          catType: selectedCatType,
          furColor: selectedFurColor,
          eyeColor: selectedEyeColor,
          accessory: selectedAccessory,
          background: selectedBackground,
          personality: selectedPersonality,
          style: selectedStyle,
        },
      });

      if (error) {
        throw new Error(error.message || "Erro ao gerar avatar");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        sonnerToast.success("Avatar gerado com sucesso! 🎉", { id: "generating" });
      } else {
        throw new Error("Imagem não foi gerada");
      }
    } catch (error: any) {
      console.error("Error generating avatar:", error);
      sonnerToast.error("Erro ao gerar avatar", {
        id: "generating",
        description: error.message || "Tente novamente em alguns segundos",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `meu-avatar-gatinho-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      sonnerToast.success("Avatar baixado! 📥");
    } catch {
      sonnerToast.error("Erro ao baixar");
    }
  };

  const getSelectedCatType = () => catTypes.find(c => c.id === selectedCatType);
  const getSelectedFurColor = () => furColors.find(c => c.id === selectedFurColor);
  const getSelectedEyeColor = () => eyeColors.find(c => c.id === selectedEyeColor);
  const getSelectedAccessory = () => accessories.find(c => c.id === selectedAccessory);
  const getSelectedBackground = () => backgrounds.find(c => c.id === selectedBackground);
  const getSelectedPersonality = () => personalities.find(c => c.id === selectedPersonality);
  const getSelectedStyle = () => artStyles.find(c => c.id === selectedStyle);

  const renderStepContent = () => {
    switch (currentStep) {
      case "breed":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Escolha a Raça 🐱</h2>
            <p className="text-muted-foreground text-center">Qual tipo de gatinho você quer criar?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {catTypes.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCatType(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCatType === cat.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-4xl block mb-2">{cat.emoji}</span>
                  <span className="font-semibold block">{cat.label}</span>
                  <span className="text-xs text-muted-foreground">{cat.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "fur":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Cor do Pelo 🎨</h2>
            <p className="text-muted-foreground text-center">Escolha a pelagem do seu gatinho</p>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {furColors.map((fur) => (
                <motion.button
                  key={fur.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFurColor(fur.id)}
                  className={`aspect-square rounded-full border-4 transition-all ${
                    selectedFurColor === fur.id
                      ? "border-primary ring-4 ring-primary/30"
                      : "border-transparent hover:border-primary/50"
                  }`}
                  style={{ backgroundColor: fur.color }}
                  title={fur.label}
                />
              ))}
            </div>
            <p className="text-center font-medium">{getSelectedFurColor()?.label}</p>
          </div>
        );

      case "eyes":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Cor dos Olhos 👁️</h2>
            <p className="text-muted-foreground text-center">Os olhos são a janela da alma</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {eyeColors.map((eye) => (
                <motion.button
                  key={eye.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEyeColor(eye.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    selectedEyeColor === eye.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full border-4 border-stone-800"
                    style={{ background: eye.color }}
                  />
                  <span className="text-sm mt-2 font-medium">{eye.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "accessory":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Acessório ✨</h2>
            <p className="text-muted-foreground text-center">Dê um toque especial!</p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {accessories.map((acc) => (
                <motion.button
                  key={acc.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAccessory(acc.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAccessory === acc.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-3xl block mb-1">{acc.emoji}</span>
                  <span className="text-sm font-medium">{acc.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "background":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Cenário 🌟</h2>
            <p className="text-muted-foreground text-center">Onde seu gatinho estará?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {backgrounds.map((bg) => (
                <motion.button
                  key={bg.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBackground(bg.id)}
                  className={`p-4 rounded-xl border-2 transition-all bg-gradient-to-br ${bg.gradient} ${
                    selectedBackground === bg.id
                      ? "border-primary ring-4 ring-primary/30"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <span className="text-3xl block mb-1">{bg.emoji}</span>
                  <span className="text-sm font-semibold text-white drop-shadow-lg">{bg.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "personality":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Expressão 😺</h2>
            <p className="text-muted-foreground text-center">Como seu gatinho está se sentindo?</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {personalities.map((p) => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPersonality(p.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPersonality === p.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-4xl block mb-1">{p.emoji}</span>
                  <span className="text-sm font-medium">{p.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "style":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Estilo de Arte 🎨</h2>
            <p className="text-muted-foreground text-center">Escolha o estilo visual</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {artStyles.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedStyle === style.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-4xl block mb-2">{style.emoji}</span>
                  <span className="font-bold block">{style.label}</span>
                  <span className="text-xs text-muted-foreground">{style.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "generate":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Pronto para Criar! ✨</h2>
            
            {/* Summary */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 text-center">Resumo do seu Avatar</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-3xl block">{getSelectedCatType()?.emoji}</span>
                    <span className="text-sm text-muted-foreground">{getSelectedCatType()?.label}</span>
                  </div>
                  <div>
                    <div
                      className="w-8 h-8 rounded-full mx-auto border-2 border-border"
                      style={{ backgroundColor: getSelectedFurColor()?.color }}
                    />
                    <span className="text-sm text-muted-foreground">{getSelectedFurColor()?.label}</span>
                  </div>
                  <div>
                    <div
                      className="w-8 h-8 rounded-full mx-auto border-2 border-stone-800"
                      style={{ background: getSelectedEyeColor()?.color }}
                    />
                    <span className="text-sm text-muted-foreground">{getSelectedEyeColor()?.label}</span>
                  </div>
                  <div>
                    <span className="text-3xl block">{getSelectedAccessory()?.emoji}</span>
                    <span className="text-sm text-muted-foreground">{getSelectedAccessory()?.label}</span>
                  </div>
                  <div>
                    <span className="text-3xl block">{getSelectedBackground()?.emoji}</span>
                    <span className="text-sm text-muted-foreground">{getSelectedBackground()?.label}</span>
                  </div>
                  <div>
                    <span className="text-3xl block">{getSelectedPersonality()?.emoji}</span>
                    <span className="text-sm text-muted-foreground">{getSelectedPersonality()?.label}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-3xl block">{getSelectedStyle()?.emoji}</span>
                    <span className="text-sm text-muted-foreground">{getSelectedStyle()?.label}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Image or Generate Button */}
            {generatedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="relative inline-block">
                  <img
                    src={generatedImage}
                    alt="Avatar gerado"
                    className="max-w-md w-full rounded-2xl shadow-2xl border-4 border-primary/20"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                  >
                    ✨ Criado com IA
                  </motion.div>
                </div>
                <div className="flex gap-3 justify-center mt-6">
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Avatar
                  </Button>
                  <Button onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Criar Outro
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center">
                {!isPremium && (
                  <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30 mb-4">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Crown className="w-6 h-6 text-amber-500" />
                        <div className="text-left">
                          <p className="font-bold text-amber-700">Recurso Premium</p>
                          <p className="text-sm text-muted-foreground">Assine para gerar avatares com IA</p>
                        </div>
                      </div>
                      <Link to="/assinar-premium">
                        <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90">
                          <Zap className="w-4 h-4 mr-1" />
                          Assinar
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
                
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || !isPremium}
                  className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient hover:opacity-90 text-lg px-8 py-6"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Gerando com IA...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Gerar Avatar Mágico ✨
                    </>
                  )}
                </Button>
                
                {isPremium && (
                  <p className="text-sm text-muted-foreground mt-3">
                    A IA criará um avatar único baseado nas suas escolhas
                  </p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg"
            >
              <Cat className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="font-display text-xl font-bold text-foreground">Gat.AI</span>
          </Link>

          <div className="flex items-center gap-3">
            {isPremium && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 px-4 py-2 rounded-full border border-amber-400/30"
              >
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-600">Premium</span>
              </motion.div>
            )}
            {!isPremium && (
              <Link to="/assinar-premium">
                <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            <span className="text-gradient">Criador de Avatar</span> 🎮
          </h1>
          <p className="text-muted-foreground text-lg">
            Personalize cada detalhe e deixe a IA criar seu gatinho perfeito!
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center justify-center gap-2 min-w-max">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = getStepIndex(currentStep) > index;

              return (
                <motion.button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : isPast
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:block">{step.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep !== "generate" && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={getStepIndex(currentStep) === 0}
                >
                  Voltar
                </Button>
                <Button onClick={nextStep} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {currentStep === "generate" && !generatedImage && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={() => setCurrentStep("breed")}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Recomeçar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CriarAvatar;
