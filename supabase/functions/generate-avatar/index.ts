import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-AVATAR] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }
    logStep("API key verified");

    const { catType, furColor, eyeColor, accessory, background, personality, style } = await req.json();
    logStep("Received parameters", { catType, furColor, eyeColor, accessory, background, personality, style });

    // Build a detailed prompt for generating a cute cat avatar
    const prompt = buildPrompt({ catType, furColor, eyeColor, accessory, background, personality, style });
    logStep("Built prompt", { promptLength: prompt.length });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep("AI Gateway error", { status: response.status, error: errorText });
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Muitas requisições. Por favor, aguarde um momento e tente novamente.",
          code: "RATE_LIMIT"
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Créditos insuficientes. Por favor, adicione créditos à sua conta.",
          code: "PAYMENT_REQUIRED"
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    logStep("AI response received");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      logStep("No image in response", { data });
      throw new Error("Não foi possível gerar a imagem. Tente novamente.");
    }

    logStep("Image generated successfully");

    return new Response(JSON.stringify({ 
      success: true,
      imageUrl,
      message: "Avatar gerado com sucesso!"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function buildPrompt(options: {
  catType: string;
  furColor: string;
  eyeColor: string;
  accessory: string;
  background: string;
  personality: string;
  style: string;
}): string {
  const { catType, furColor, eyeColor, accessory, background, personality, style } = options;

  const catDescriptions: Record<string, string> = {
    "persian": "Persian cat with fluffy long fur and flat face",
    "siamese": "Siamese cat with sleek body and pointed coloration",
    "scottish": "Scottish Fold cat with adorable folded ears",
    "maine-coon": "Maine Coon cat with majestic long fur and large size",
    "british": "British Shorthair cat with round face and dense coat",
    "ragdoll": "Ragdoll cat with beautiful blue eyes and semi-long fur",
    "munchkin": "Munchkin cat with short legs and playful appearance",
    "bengal": "Bengal cat with exotic spotted or marbled coat pattern",
  };

  const furDescriptions: Record<string, string> = {
    "orange": "orange tabby fur",
    "gray": "gray and silver fur",
    "white": "pure white fluffy fur",
    "black": "sleek black fur",
    "calico": "beautiful calico pattern with orange, black and white patches",
    "tuxedo": "tuxedo pattern with black and white",
    "cream": "soft cream colored fur",
    "brown": "warm brown tabby fur",
  };

  const eyeDescriptions: Record<string, string> = {
    "blue": "sparkling bright blue eyes",
    "green": "vivid emerald green eyes",
    "gold": "warm golden amber eyes",
    "heterochromia": "unique heterochromia with one blue and one gold eye",
    "copper": "deep copper colored eyes",
    "aqua": "stunning aqua turquoise eyes",
  };

  const accessoryDescriptions: Record<string, string> = {
    "none": "",
    "crown": "wearing a golden royal crown with gems",
    "wizard-hat": "wearing a magical purple wizard hat with stars",
    "bow": "wearing an adorable pink bow on the head",
    "glasses": "wearing cute round glasses",
    "flower-crown": "wearing a beautiful flower crown",
    "scarf": "wearing a cozy knitted scarf",
    "superhero-cape": "wearing a red superhero cape",
    "pirate-hat": "wearing a pirate captain hat",
  };

  const backgroundDescriptions: Record<string, string> = {
    "galaxy": "cosmic galaxy background with stars and nebulas",
    "garden": "beautiful flower garden background",
    "sunset": "warm sunset sky background with orange and pink clouds",
    "winter": "magical snowy winter wonderland background",
    "castle": "fantasy castle background",
    "beach": "tropical beach background with palm trees",
    "sakura": "Japanese cherry blossom (sakura) background",
    "rainbow": "colorful rainbow and clouds background",
  };

  const personalityDescriptions: Record<string, string> = {
    "happy": "with a happy joyful expression and smile",
    "sleepy": "with a cute sleepy drowsy expression",
    "curious": "with a curious wide-eyed expression",
    "playful": "with a playful mischievous expression",
    "royal": "with a regal majestic expression",
    "shy": "with a shy adorable blushing expression",
  };

  const styleDescriptions: Record<string, string> = {
    "anime": "in cute anime art style, kawaii, vibrant colors",
    "realistic": "photorealistic, high detail, professional photography style",
    "chibi": "in chibi style, super cute with big head and small body",
    "watercolor": "in beautiful watercolor painting style",
    "pixel": "in retro pixel art style",
    "3d": "in adorable 3D rendered style, like a Pixar character",
  };

  const catDesc = catDescriptions[catType] || "adorable cat";
  const furDesc = furDescriptions[furColor] || "soft fur";
  const eyeDesc = eyeDescriptions[eyeColor] || "beautiful eyes";
  const accessoryDesc = accessoryDescriptions[accessory] || "";
  const bgDesc = backgroundDescriptions[background] || "beautiful background";
  const personalityDesc = personalityDescriptions[personality] || "cute expression";
  const styleDesc = styleDescriptions[style] || "cute illustration style";

  return `Generate a beautiful avatar portrait of a ${catDesc} with ${furDesc} and ${eyeDesc}, ${personalityDesc}${accessoryDesc ? ", " + accessoryDesc : ""}. Set against a ${bgDesc}. Art style: ${styleDesc}. The image should be a centered portrait suitable for a profile avatar, with the cat as the main focus. Make it adorable and appealing. High quality, detailed artwork.`;
}
