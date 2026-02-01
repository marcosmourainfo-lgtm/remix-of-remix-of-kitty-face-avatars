import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import CriarAvatar from "./pages/CriarAvatar";
import CriarVideo from "./pages/CriarVideo";
import MeusVideos from "./pages/MeusVideos";
import Precos from "./pages/Precos";
import AssinarPremium from "./pages/AssinarPremium";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/criar-avatar" element={<CriarAvatar />} />
          <Route path="/criar-video" element={<CriarVideo />} />
          <Route path="/meus-videos" element={<MeusVideos />} />
          <Route path="/precos" element={<Precos />} />
          <Route path="/assinar-premium" element={<AssinarPremium />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
