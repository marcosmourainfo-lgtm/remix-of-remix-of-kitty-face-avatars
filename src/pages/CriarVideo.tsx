import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, Sparkles, Download, Crown, LogOut, Wand2, RotateCcw, Loader2, ChevronRight, Palette, Eye, Shirt, ImageIcon, Heart, Zap, Video, ChevronLeft, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import LivingPortrait from "@/components/LivingPortrait";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";

// Cat breed options
const catTypes = [
  { id: "persian", label: "Persa", emoji: "🐱", description: "Elegante e peludo" },
  { id: "siamese", label: "Siamês", emoji: "😺", description: "Gracioso" },
  { id: "scottish", label: "Scottish Fold", emoji: "🙀", description: "Orelhas dobradas" },
  { id: "maine-coon", label: "Maine Coon", emoji: "🦁", description: "Majestoso" },
  { id: "british", label: "British Shorthair", emoji: "😸", description: "Aristocrático" },
  { id: "munchkin", label: "Munchkin", emoji: "🐈", description: "Adorável" },
  { id: "bengal", label: "Bengal", emoji: "🐆", description: "Selvagem" },
  { id: "ragdoll", label: "Ragdoll", emoji: "😻", description: "Olhos azuis" },
];

// Fur colors
const furColors = [
  { id: "orange", label: "Laranja Dourado", color: "#f97316" },
  { id: "gray", label: "Cinza Prateado", color: "#6b7280" },
  { id: "white", label: "Branco Puro", color: "#fafaf9" },
  { id: "black", label: "Preto Ébano", color: "#1c1917" },
  { id: "calico", label: "Malhado", color: "#fbbf24" },
  { id: "tuxedo", label: "Tuxedo", color: "#18181b" },
  { id: "cream", label: "Creme", color: "#fef3c7" },
  { id: "brown", label: "Marrom Chocolate", color: "#78350f" },
];

// Eye colors
const eyeColors = [
  { id: "blue", label: "Azul Safira", color: "#2563eb" },
  { id: "green", label: "Verde Esmeralda", color: "#16a34a" },
  { id: "gold", label: "Âmbar Dourado", color: "#ca8a04" },
  { id: "heterochromia", label: "Heterocromia", color: "linear-gradient(90deg, #2563eb 50%, #ca8a04 50%)" },
  { id: "copper", label: "Cobre", color: "#b45309" },
  { id: "aqua", label: "Turquesa", color: "#0891b2" },
];

// Accessories
const accessories = [
  { id: "none", label: "Nenhum", emoji: "✨" },
  { id: "crown", label: "Coroa Real", emoji: "👑" },
  { id: "wizard-hat", label: "Chapéu de Mago", emoji: "🧙" },
  { id: "bow", label: "Laço de Seda", emoji: "🎀" },
  { id: "glasses", label: "Óculos Dourados", emoji: "👓" },
  { id: "flower-crown", label: "Coroa de Flores", emoji: "🌸" },
  { id: "scarf", label: "Cachecol", emoji: "🧣" },
  { id: "superhero-cape", label: "Capa de Herói", emoji: "🦸" },
];

// Backgrounds
const backgrounds = [
  { id: "galaxy", label: "Galáxia Cósmica", emoji: "🌌", gradient: "from-purple-900 via-indigo-800 to-blue-900" },
  { id: "garden", label: "Jardim Encantado", emoji: "🌷", gradient: "from-green-600 via-emerald-500 to-teal-600" },
  { id: "sunset", label: "Pôr do Sol", emoji: "🌅", gradient: "from-orange-500 via-rose-500 to-purple-600" },
  { id: "winter", label: "Inverno Mágico", emoji: "❄️", gradient: "from-cyan-300 via-blue-300 to-indigo-400" },
  { id: "castle", label: "Castelo Fantasy", emoji: "🏰", gradient: "from-violet-600 via-purple-500 to-indigo-600" },
  { id: "beach", label: "Praia Tropical", emoji: "🏖️", gradient: "from-cyan-500 via-sky-400 to-blue-500" },
  { id: "sakura", label: "Cerejeira Japonesa", emoji: "🌸", gradient: "from-pink-400 via-rose-300 to-pink-500" },
  { id: "rainbow", label: "Arco-íris", emoji: "🌈", gradient: "from-red-400 via-yellow-400 to-green-400" },
];

// Personalities/Expressions
const personalities = [
  { id: "happy", label: "Feliz", emoji: "😊", description: "Alegre e radiante" },
  { id: "sleepy", label: "Sonolento", emoji: "😴", description: "Pacífico e calmo" },
  { id: "curious", label: "Curioso", emoji: "🧐", description: "Atento e inteligente" },
  { id: "playful", label: "Brincalhão", emoji: "😜", description: "Travesso e divertido" },
  { id: "royal", label: "Majestoso", emoji: "👑", description: "Nobre e digno" },
  { id: "shy", label: "Tímido", emoji: "🥺", description: "Doce e gentil" },
];

// Motion types for animation
const motionTypes = [
  { id: "breathing", label: "Respirando", emoji: "💨", description: "Suave movimento" },
  { id: "blinking", label: "Piscando", emoji: "👁️", description: "Piscar elegante" },
  { id: "head-tilt", label: "Inclinando Cabeça", emoji: "🐱", description: "Curioso" },
  { id: "purring", label: "Ronronando", emoji: "😻", description: "Contentamento" },
  { id: "looking-around", label: "Olhando ao Redor", emoji: "👀", description: "Olhos curiosos" },
  { id: "tail-swish", label: "Balançando Rabo", emoji: "🐾", description: "Gracioso" },
];

type Step = "breed" | "fur" | "eyes" | "accessory" | "background" | "personality" | "motion" | "generate";

const steps: { id: Step; label: string; icon: any }[] = [
  { id: "breed", label: "Raça", icon: Cat },
  { id: "fur", label: "Pelo", icon: Palette },
  { id: "eyes", label: "Olhos", icon: Eye },
  { id: "accessory", label: "Acessório", icon: Shirt },
  { id: "background", label: "Cenário", icon: ImageIcon },
  { id: "personality", label: "Expressão", icon: Heart },
  { id: "motion", label: "Movimento", icon: Video },
  { id: "generate", label: "Criar!", icon: Wand2 },
];

const CriarVideo = () => {
  const [currentStep, setCurrentStep] = useState<Step>("breed");
  const [selectedCatType, setSelectedCatType] = useState(catTypes[0].id);
  const [selectedFurColor, setSelectedFurColor] = useState(furColors[0].id);
  const [selectedEyeColor, setSelectedEyeColor] = useState(eyeColors[0].id);
  const [selectedAccessory, setSelectedAccessory] = useState("none");
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0].id);
  const [selectedPersonality, setSelectedPersonality] = useState(personalities[0].id);
  const [selectedMotion, setSelectedMotion] = useState(motionTypes[0].id);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const portraitRef = useRef<HTMLDivElement>(null);
  
  const { isRecording, videoUrl, progress, recordElement, downloadVideo, reset: resetVideo } = useVideoRecorder({ duration: 5 });

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
    setSelectedMotion(motionTypes[0].id);
    setGeneratedImage(null);
    setCurrentStep("breed");
    resetVideo();
  };

  const handleCreateVideo = async () => {
    if (!generatedImage || !portraitRef.current) {
      sonnerToast.error("Imagem não disponível");
      return;
    }

    sonnerToast.loading("🎬 Gravando vídeo mágico de 5 segundos...", { id: "recording" });
    
    try {
      const url = await recordElement(portraitRef.current, generatedImage);
      
      if (url) {
        sonnerToast.success("✨ Vídeo criado com sucesso!", { 
          id: "recording",
          description: "Seu retrato vivo está pronto para download!"
        });

        // Save video to database
        if (user) {
          await supabase.from("videos").insert({
            user_id: user.id,
            video_url: url,
            prompt: `${selectedCatType} - ${selectedFurColor} - ${selectedMotion}`,
            accessory: selectedAccessory,
            background: selectedBackground,
            base_kitten: selectedCatType,
            duration_seconds: 5,
            video_type: "living-portrait",
          });
        }
      } else {
        throw new Error("Falha ao criar vídeo");
      }
    } catch (error: any) {
      console.error("Error creating video:", error);
      sonnerToast.error("Erro ao criar vídeo", {
        id: "recording",
        description: error.message || "Tente novamente",
      });
    }
  };

  const handleGenerateImage = async () => {
    if (!isPremium) {
      sonnerToast.error("Recurso Premium", {
        description: "Criação de retratos é exclusiva para assinantes Premium!",
        action: {
          label: "Assinar",
          onClick: () => navigate("/assinar-premium"),
        },
      });
      return;
    }

    setIsGenerating(true);
    sonnerToast.loading("🎨 Pintando seu retrato a óleo ultra realista...", { id: "generating" });

    try {
      const { data, error } = await supabase.functions.invoke("generate-animated-avatar", {
        body: {
          catType: selectedCatType,
          furColor: selectedFurColor,
          eyeColor: selectedEyeColor,
          accessory: selectedAccessory,
          background: selectedBackground,
          personality: selectedPersonality,
          artStyle: "oil-painting",
          motion: selectedMotion,
          generateVideo: false,
        },
      });

      if (error) {
        throw new Error(error.message || "Erro ao gerar imagem");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        sonnerToast.success("✨ Obra-prima criada!", { 
          id: "generating",
          description: "Seu retrato em óleo ultra realista está pronto para download!"
        });

        // Save image to database
        if (user) {
          await supabase.from("videos").insert({
            user_id: user.id,
            video_url: data.imageUrl,
            prompt: `${selectedCatType} - ${selectedFurColor} - ${selectedBackground}`,
            accessory: selectedAccessory,
            background: selectedBackground,
            base_kitten: selectedCatType,
            duration_seconds: 0,
            video_type: "oil-painting-image",
          });
        }
      } else {
        throw new Error("Imagem não foi gerada");
      }
    } catch (error: any) {
      console.error("Error generating:", error);
      sonnerToast.error("Erro ao gerar", {
        id: "generating",
        description: error.message || "Tente novamente em alguns segundos",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `retrato-oleo-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      sonnerToast.success("Imagem baixada! 🖼️");
    } catch {
      sonnerToast.error("Erro ao baixar imagem");
    }
  };


  const getSelectedCatType = () => catTypes.find(c => c.id === selectedCatType);
  const getSelectedFurColor = () => furColors.find(c => c.id === selectedFurColor);
  const getSelectedEyeColor = () => eyeColors.find(c => c.id === selectedEyeColor);
  const getSelectedAccessory = () => accessories.find(c => c.id === selectedAccessory);
  const getSelectedBackground = () => backgrounds.find(c => c.id === selectedBackground);
  const getSelectedPersonality = () => personalities.find(c => c.id === selectedPersonality);
  const getSelectedMotion = () => motionTypes.find(c => c.id === selectedMotion);

  const renderStepContent = () => {
    switch (currentStep) {
      case "breed":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Escolha a Raça 🐱</h2>
              <p className="text-muted-foreground">Qual felino será eternizado em óleo?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {catTypes.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCatType(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCatType === cat.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
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
            <div className="text-center">
              <h2 className="text-2xl font-bold">Cor da Pelagem 🎨</h2>
              <p className="text-muted-foreground">Escolha os tons para as pinceladas</p>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {furColors.map((fur) => (
                <motion.button
                  key={fur.id}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFurColor(fur.id)}
                  className={`aspect-square rounded-full border-4 transition-all shadow-lg ${
                    selectedFurColor === fur.id
                      ? "border-primary ring-4 ring-primary/30 scale-110"
                      : "border-border/50 hover:border-primary/50"
                  }`}
                  style={{ backgroundColor: fur.color }}
                  title={fur.label}
                />
              ))}
            </div>
            <p className="text-center font-medium text-lg">{getSelectedFurColor()?.label}</p>
          </div>
        );

      case "eyes":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Cor dos Olhos 👁️</h2>
              <p className="text-muted-foreground">Os olhos são a alma do retrato</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {eyeColors.map((eye) => (
                <motion.button
                  key={eye.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEyeColor(eye.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    selectedEyeColor === eye.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-full border-4 border-stone-800 shadow-inner"
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
            <div className="text-center">
              <h2 className="text-2xl font-bold">Acessório ✨</h2>
              <p className="text-muted-foreground">Adicione um toque especial ao retrato</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {accessories.map((acc) => (
                <motion.button
                  key={acc.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAccessory(acc.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAccessory === acc.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-4xl block mb-2">{acc.emoji}</span>
                  <span className="text-sm font-medium">{acc.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "background":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Cenário 🖼️</h2>
              <p className="text-muted-foreground">O pano de fundo da sua obra</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {backgrounds.map((bg) => (
                <motion.button
                  key={bg.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBackground(bg.id)}
                  className={`p-5 rounded-xl border-2 transition-all bg-gradient-to-br ${bg.gradient} ${
                    selectedBackground === bg.id
                      ? "border-white ring-4 ring-primary/50 shadow-xl"
                      : "border-transparent hover:border-white/50"
                  }`}
                >
                  <span className="text-3xl block mb-2">{bg.emoji}</span>
                  <span className="text-sm font-bold text-white drop-shadow-lg">{bg.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "personality":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Expressão 😺</h2>
              <p className="text-muted-foreground">A emoção capturada na pintura</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {personalities.map((p) => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPersonality(p.id)}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    selectedPersonality === p.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-5xl block mb-2">{p.emoji}</span>
                  <span className="font-bold block">{p.label}</span>
                  <span className="text-xs text-muted-foreground">{p.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "motion":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Tipo de Movimento 🎬</h2>
              <p className="text-muted-foreground">Como seu retrato ganhará vida no vídeo</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {motionTypes.map((m) => (
                <motion.button
                  key={m.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMotion(m.id)}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    selectedMotion === m.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-4xl block mb-2">{m.emoji}</span>
                  <span className="font-bold block">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "generate":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Pronto para a Obra-Prima! 🎨</h2>
              <p className="text-muted-foreground">Estilo Pintura a Óleo Ultra Realista</p>
            </div>
            
            {/* Summary */}
            <Card className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5 border-amber-500/20">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 text-center text-lg">📜 Sua Encomenda</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-background/50">
                    <span className="text-2xl block">{getSelectedCatType()?.emoji}</span>
                    <span className="text-xs text-muted-foreground">{getSelectedCatType()?.label}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <div
                      className="w-8 h-8 rounded-full mx-auto border-2 border-border shadow-md"
                      style={{ backgroundColor: getSelectedFurColor()?.color }}
                    />
                    <span className="text-xs text-muted-foreground">{getSelectedFurColor()?.label}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <div
                      className="w-8 h-8 rounded-full mx-auto border-2 border-stone-700 shadow-inner"
                      style={{ background: getSelectedEyeColor()?.color }}
                    />
                    <span className="text-xs text-muted-foreground">{getSelectedEyeColor()?.label}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <span className="text-2xl block">{getSelectedAccessory()?.emoji}</span>
                    <span className="text-xs text-muted-foreground">{getSelectedAccessory()?.label}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                  <div className="p-2 rounded-lg bg-background/50">
                    <span className="text-xl block">{getSelectedBackground()?.emoji}</span>
                    <span className="text-xs text-muted-foreground">{getSelectedBackground()?.label}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <span className="text-xl block">{getSelectedPersonality()?.emoji}</span>
                    <span className="text-xs text-muted-foreground">{getSelectedPersonality()?.label}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <span className="text-xl block">{getSelectedMotion()?.emoji}</span>
                    <span className="text-xs text-muted-foreground">{getSelectedMotion()?.label}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Result */}
            {generatedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                {/* Video Player (if video is ready) */}
                {videoUrl ? (
                  <div className="space-y-4">
                    <div className="relative max-w-lg mx-auto">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-4 -right-4 z-40 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Vídeo Pronto! 🎬
                      </motion.div>
                      <video 
                        src={videoUrl} 
                        controls 
                        autoPlay 
                        loop
                        className="w-full rounded-2xl shadow-2xl border-4 border-rose-900/30"
                      />
                    </div>
                    
                    <div className="flex gap-3 justify-center flex-wrap">
                      <Button onClick={downloadVideo} size="lg" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90">
                        <Download className="w-5 h-5 mr-2" />
                        Baixar Vídeo
                      </Button>
                      <Button onClick={handleDownloadImage} variant="outline" size="lg">
                        <Download className="w-5 h-5 mr-2" />
                        Baixar Imagem
                      </Button>
                      <Button onClick={handleReset} variant="outline" size="lg">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Criar Outro
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Living Portrait with Animation */}
                    <div ref={portraitRef} className="relative max-w-lg mx-auto">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-4 -right-4 z-40 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Retrato Vivo ✨
                      </motion.div>
                      
                      <LivingPortrait
                        imageUrl={generatedImage}
                        motionType={selectedMotion}
                        personality={selectedPersonality}
                        className="border-4 border-amber-900/30"
                      />
                    </div>

                    <p className="text-sm text-muted-foreground italic">
                      🎭 Animação "{getSelectedMotion()?.label}" aplicada ao retrato
                    </p>

                    {/* Recording Progress */}
                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-center gap-2 text-rose-600">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium">Gravando vídeo... {progress}%</span>
                        </div>
                        <div className="w-64 mx-auto h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="flex gap-3 justify-center flex-wrap">
                      <Button 
                        onClick={handleCreateVideo} 
                        size="lg" 
                        disabled={isRecording}
                        className="bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90"
                      >
                        {isRecording ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Gravando...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Criar Vídeo 5s 🎬
                          </>
                        )}
                      </Button>
                      <Button onClick={handleDownloadImage} variant="outline" size="lg" disabled={isRecording}>
                        <Download className="w-5 h-5 mr-2" />
                        Baixar Imagem
                      </Button>
                      <Button onClick={handleReset} variant="outline" size="lg" disabled={isRecording}>
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Criar Outro
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <div className="text-center space-y-4">
                {!isPremium && (
                  <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Crown className="w-6 h-6 text-amber-500" />
                        <div className="text-left">
                          <p className="font-bold text-amber-700">Recurso Premium</p>
                          <p className="text-sm text-muted-foreground">Assine para criar retratos</p>
                        </div>
                      </div>
                      <Link to="/assinar-premium">
                        <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90">
                          <Zap className="w-4 h-4 mr-1" />
                          Assinar
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
                
                <Button
                  size="lg"
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !isPremium}
                  className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 hover:opacity-90 text-lg px-10 py-7 shadow-xl"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Pintando Obra-Prima...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-6 h-6 mr-3" />
                      Criar Retrato a Óleo 🎨
                    </>
                  )}
                </Button>
                
                {isPremium && (
                  <p className="text-sm text-muted-foreground">
                    Primeiro gere a imagem, depois você pode criar o vídeo animado de 5 segundos
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
    <div className="min-h-screen bg-gradient-to-br from-amber-900/10 via-background to-orange-900/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Cat className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-display text-xl font-bold text-foreground">Gat.AI</span>
          </Link>

          <div className="flex items-center gap-3">
            {isPremium && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-orange-400/20 px-4 py-2 rounded-full border border-amber-400/30"
              >
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-600">Premium</span>
              </motion.div>
            )}
            {!isPremium && (
              <Link to="/assinar-premium">
                <Button variant="outline" size="sm" className="border-amber-500/30 hover:bg-amber-500/10">
                  <Crown className="w-4 h-4 mr-2 text-amber-500" />
                  Upgrade
                </Button>
              </Link>
            )}
            <Link to="/meus-videos">
              <Button variant="outline" size="sm">
                Meus Vídeos
              </Button>
            </Link>
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
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Retrato a Óleo
            </span> 🎨
          </h1>
          <p className="text-muted-foreground text-lg">
            Crie uma pintura a óleo ultra realista do seu gatinho!
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm text-amber-600">
              <ImageIcon className="w-4 h-4" />
              <span>Imagem</span>
            </div>
            <span className="text-muted-foreground">+</span>
            <div className="flex items-center gap-1 text-sm text-rose-600">
              <Sparkles className="w-4 h-4" />
              <span>Animação Mágica</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center justify-center gap-1 min-w-max">
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
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                      : isPast
                      ? "bg-amber-500/20 text-amber-600"
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
        <Card className="border-2 border-amber-500/20 bg-card/80 backdrop-blur-sm shadow-2xl">
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
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                >
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

export default CriarVideo;
