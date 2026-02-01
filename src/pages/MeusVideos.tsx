import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, Plus, Download, Share2, Trash2, Crown, Play, Video, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

interface VideoItem {
  id: string;
  video_url: string;
  prompt: string;
  created_at: string;
  duration_seconds: number;
}

const MeusVideos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadVideos();
    
    // If coming from successful payment, check subscription with Stripe
    if (searchParams.get("success") === "true") {
      sonnerToast.success("Pagamento realizado! Verificando assinatura...");
      checkSubscriptionWithStripe();
    } else {
      checkPlan();
    }
  }, [searchParams]);

  const checkSubscriptionWithStripe = async () => {
    setCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        checkPlan(); // Fallback to local check
        return;
      }
      
      if (data?.subscribed) {
        setIsPremium(true);
        sonnerToast.success("🎉 Parabéns! Você agora é Premium!", {
          description: "Aproveite todos os benefícios ilimitados!"
        });
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      checkPlan(); // Fallback to local check
    } finally {
      setCheckingSubscription(false);
    }
  };

  const loadVideos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos((data as VideoItem[]) || []);
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    setIsPremium(data?.plan === "premium");
  };

  const handleDownload = async (video: VideoItem) => {
    try {
      const response = await fetch(video.video_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gat-ai-video-${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download iniciado! 📥",
        description: "Seu vídeo está sendo baixado.",
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (video: VideoItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Meu vídeo Gat.AI",
          text: "Olha o vídeo fofo que eu criei! 🐱✨",
          url: video.video_url,
        });
      } catch (error) {
        copyToClipboard(video.video_url);
      }
    } else {
      copyToClipboard(video.video_url);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado! 📋",
      description: "Cole onde quiser compartilhar.",
    });
  };

  const handleDelete = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId);

      if (error) throw error;

      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Cat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Gat.AI</span>
          </Link>

          <Link to="/criar-video">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Criar Vídeo
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Video className="w-8 h-8 text-primary" />
              Meus Vídeos 🎬
            </h1>
            <p className="text-muted-foreground mt-1">
              {videos.length} vídeo{videos.length !== 1 ? "s" : ""} criado{videos.length !== 1 ? "s" : ""}
            </p>
          </div>

          {!isPremium && (
            <Link to="/precos">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                <Crown className="w-4 h-4 mr-2" />
                Seja Premium
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-2 border-primary/20 bg-card/80 animate-pulse">
                <CardContent className="p-4">
                  <div className="aspect-[9/16] bg-muted rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <Card className="border-2 border-primary/20 bg-card/80 max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-xl font-display font-bold text-foreground mb-2">
                Nenhum vídeo ainda
              </h2>
              <p className="text-muted-foreground mb-6">
                Crie seu primeiro vídeo fofo para redes sociais!
              </p>
              <Link to="/criar-video">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar meu primeiro vídeo
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="border-2 border-primary/20 bg-card/80 hover:border-primary/40 transition-all group overflow-hidden"
              >
                <CardContent className="p-4">
                  <div 
                    className="relative aspect-[9/16] rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-primary/20 to-accent/20 cursor-pointer"
                    onClick={() => setPlayingId(playingId === video.id ? null : video.id)}
                  >
                    {playingId === video.id ? (
                      <video
                        src={video.video_url}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <video
                          src={video.video_url}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl">
                            <Play className="w-6 h-6 text-primary-foreground ml-1" />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Duration badge */}
                    <div className="absolute top-2 right-2 bg-foreground/80 text-background text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(video.duration_seconds || 5)}
                    </div>
                    
                    {!isPremium && (
                      <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-1 rounded-full">
                        Gat.AI
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all flex items-end justify-center pb-4 gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(video);
                        }}
                        className="bg-card hover:bg-card/80"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(video);
                        }}
                        className="bg-card hover:bg-card/80"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(video.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {video.prompt || "Vídeo personalizado"}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {new Date(video.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MeusVideos;
