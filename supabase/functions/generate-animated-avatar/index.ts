import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-ANIMATED-AVATAR] ${step}${detailsStr}`);
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      catType, 
      furColor, 
      eyeColor, 
      accessory, 
      background, 
      personality, 
      artStyle,
      motion,
      generateVideo = false,
      imageUrl: existingImageUrl
    } = await req.json();
    
    logStep("Received parameters", { catType, furColor, generateVideo, hasExistingImage: !!existingImageUrl });

    // Video generation is not supported through the AI gateway
    // Return a message if video was requested
    if (generateVideo && existingImageUrl) {
      logStep("Video generation requested but not supported via gateway");
      
      return new Response(JSON.stringify({ 
        success: false,
        error: "Geração de vídeo não está disponível no momento. Por favor, use apenas a imagem.",
        videoNotSupported: true
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Generate the avatar image
    const imagePrompt = buildImagePrompt({ 
      catType, furColor, eyeColor, accessory, background, personality, artStyle 
    });
    logStep("Built image prompt", { promptLength: imagePrompt.length });

    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      logStep("Image generation error", { status: imageResponse.status, error: errorText });
      
      if (imageResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Muitas requisições. Aguarde um momento e tente novamente.",
          code: "RATE_LIMIT"
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (imageResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Créditos insuficientes.",
          code: "PAYMENT_REQUIRED"
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`Image generation failed: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    logStep("Image response received");

    const generatedImageUrl = extractImageFromResponse(imageData);
    
    if (!generatedImageUrl) {
      logStep("No image in response", { data: imageData });
      throw new Error("Não foi possível gerar a imagem base. Tente novamente.");
    }

    logStep("Base image generated successfully");

    // Upload base64 image to storage
    let storedImageUrl = generatedImageUrl;
    
    if (generatedImageUrl.startsWith('data:image')) {
      try {
        const base64Data = generatedImageUrl.split(',')[1];
        const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, imageBytes, {
            contentType: 'image/png',
            upsert: false
          });

        if (uploadError) {
          logStep("Upload error", { error: uploadError.message });
        } else {
          const { data: publicUrl } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          storedImageUrl = publicUrl.publicUrl;
          logStep("Image uploaded to storage", { url: storedImageUrl });
        }
      } catch (uploadErr) {
        logStep("Failed to upload to storage, using base64", { error: uploadErr });
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      imageUrl: storedImageUrl,
      message: "Imagem gerada! Agora você pode baixar ou criar o vídeo animado.",
      motionPrompt: buildMotionPrompt(motion, personality)
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

function extractImageFromResponse(data: any): string | null {
  try {
    const message = data.choices?.[0]?.message;
    if (!message) return null;

    if (Array.isArray(message.images)) {
      for (const img of message.images) {
        if (img.type === "image_url" && img.image_url?.url) {
          return img.image_url.url;
        }
        if (img.url) {
          return img.url;
        }
      }
    }

    if (message.images?.[0]?.image_url?.url) {
      return message.images[0].image_url.url;
    }

    if (Array.isArray(message.content)) {
      for (const part of message.content) {
        if (part.inline_data?.data) {
          const mimeType = part.inline_data.mime_type || 'image/png';
          return `data:${mimeType};base64,${part.inline_data.data}`;
        }
        if (part.type === "image_url" && part.image_url?.url) {
          return part.image_url.url;
        }
      }
    }

    return null;
  } catch (e) {
    console.error("Error extracting image:", e);
    return null;
  }
}

function buildImagePrompt(options: {
  catType: string;
  furColor: string;
  eyeColor: string;
  accessory: string;
  background: string;
  personality: string;
  artStyle: string;
}): string {
  const { catType, furColor, eyeColor, accessory, background, personality, artStyle } = options;

  const catDescriptions: Record<string, string> = {
    "persian": "elegant Persian cat with luxurious long flowing fur and sweet flat face",
    "siamese": "graceful Siamese cat with sleek body and striking pointed coloration",
    "scottish": "charming Scottish Fold cat with endearing folded ears and round face",
    "maine-coon": "majestic Maine Coon cat with magnificent long fur and impressive size",
    "british": "distinguished British Shorthair cat with plush round face and dense coat",
    "ragdoll": "beautiful Ragdoll cat with captivating blue eyes and silky semi-long fur",
    "munchkin": "adorable Munchkin cat with sweet short legs and playful demeanor",
    "bengal": "exotic Bengal cat with stunning wild spotted or marbled coat pattern",
  };

  const furDescriptions: Record<string, string> = {
    "orange": "rich warm orange tabby fur with beautiful golden undertones",
    "gray": "elegant silver-gray fur with subtle blue undertones",
    "white": "pristine pure white fur, soft and cloud-like",
    "black": "sleek deep black fur with subtle sheen",
    "calico": "stunning calico pattern with harmonious orange, black and white patches",
    "tuxedo": "classic tuxedo pattern with striking black and white contrast",
    "cream": "delicate cream-colored fur with warm peachy tones",
    "brown": "rich chocolate brown tabby fur with intricate patterns",
  };

  const eyeDescriptions: Record<string, string> = {
    "blue": "mesmerizing deep sapphire blue eyes that sparkle with intelligence",
    "green": "captivating emerald green eyes full of mystery",
    "gold": "warm golden amber eyes that glow with wisdom",
    "heterochromia": "enchanting heterochromia with one striking blue eye and one golden eye",
    "copper": "deep rich copper eyes with warm intensity",
    "aqua": "stunning aquamarine turquoise eyes like tropical waters",
  };

  const accessoryDescriptions: Record<string, string> = {
    "none": "",
    "crown": "wearing an ornate golden royal crown encrusted with rubies and sapphires",
    "wizard-hat": "wearing a mystical purple wizard hat adorned with golden stars and moons",
    "bow": "wearing an elegant silk bow with intricate lace details",
    "glasses": "wearing sophisticated round spectacles with golden frames",
    "flower-crown": "wearing a delicate crown of fresh roses, daisies and wildflowers",
    "scarf": "wearing a luxurious hand-knitted woolen scarf",
    "superhero-cape": "wearing a flowing crimson superhero cape billowing dramatically",
    "pirate-hat": "wearing a weathered leather pirate captain's tricorn hat",
  };

  const backgroundDescriptions: Record<string, string> = {
    "galaxy": "cosmic deep space background with swirling nebulas, distant stars and aurora lights",
    "garden": "lush enchanted garden with blooming roses, butterflies and golden sunlight filtering through leaves",
    "sunset": "dramatic sunset sky with rich oranges, pinks and purples reflecting on clouds",
    "winter": "magical snowy winter wonderland with frost-covered trees and gently falling snowflakes",
    "castle": "grand fantasy castle backdrop with towering spires and mystical atmosphere",
    "beach": "serene tropical beach with turquoise waters, palm trees and golden sand",
    "sakura": "dreamy Japanese cherry blossom scene with pink petals floating in the breeze",
    "rainbow": "whimsical rainbow arching across a sky filled with fluffy cotton candy clouds",
  };

  const personalityDescriptions: Record<string, string> = {
    "happy": "with a warm, joyful expression and gentle smile that radiates pure happiness",
    "sleepy": "with drowsy half-closed eyes and a peaceful, content expression",
    "curious": "with wide alert eyes and tilted head, radiating intelligent curiosity",
    "playful": "with a mischievous glint in the eyes and playful, energetic pose",
    "royal": "with a dignified, regal bearing and noble, commanding presence",
    "shy": "with a sweet, bashful expression and endearing gentle demeanor",
  };

  const catDesc = catDescriptions[catType] || "beautiful cat";
  const furDesc = furDescriptions[furColor] || "soft luxurious fur";
  const eyeDesc = eyeDescriptions[eyeColor] || "beautiful expressive eyes";
  const accessoryDesc = accessoryDescriptions[accessory] || "";
  const bgDesc = backgroundDescriptions[background] || "beautiful atmospheric background";
  const personalityDesc = personalityDescriptions[personality] || "expressive demeanor";

  // Ultra realistic oil painting style
  const styleDesc = `ULTRA REALISTIC masterful oil painting in the style of classical Dutch Golden Age masters. 
Extremely detailed brushwork visible in every fur strand. 
Rich impasto technique with thick, textured paint layers.
Dramatic chiaroscuro lighting with deep shadows and luminous highlights.
Deep, saturated colors with subtle glazing and layering.
Museum-quality fine art with visible canvas texture.
Photorealistic proportions with painterly artistic interpretation.`;

  return `Create an absolutely stunning, museum-worthy portrait of a ${catDesc} with ${furDesc} and ${eyeDesc}, ${personalityDesc}${accessoryDesc ? ", " + accessoryDesc : ""}. 

Setting: ${bgDesc}.

Art Style: ${styleDesc}

CRITICAL Technical Requirements:
- Square 1:1 aspect ratio portrait composition
- Cat face prominently centered, filling most of the frame
- Professional portrait studio lighting with dramatic shadows
- EXTREMELY detailed fur texture showing every individual strand and whisker
- Eyes must be the focal point with realistic catchlights and depth
- Background should be painterly and complement the subject
- Visible oil paint brushstrokes throughout
- Rich, deep color palette typical of classical oil paintings
- Ultra high resolution, 8K quality artwork

This must look like a real oil painting you would find in a prestigious art museum. Make it breathtaking.`;
}

function buildMotionPrompt(motion: string, personality: string): string {
  const motionDescriptions: Record<string, string> = {
    "breathing": "gentle rhythmic breathing with subtle chest expansion, soft whisker movement, and delicate ear twitches",
    "blinking": "slow elegant blinking with natural eye moisture, subtle eyelid movement and occasional ear flicks",
    "head-tilt": "curious slow head tilt from one side to another with alert perked ears following the movement",
    "purring": "content purring vibration visible in the chest and throat, half-closed peaceful eyes, relaxed posture",
    "looking-around": "gentle eye movements scanning left to right, ears rotating to follow sounds, alert expression",
    "tail-swish": "graceful flowing tail movement swaying gently, body remaining mostly still and composed",
  };

  const personalityMotions: Record<string, string> = {
    "happy": "with joyful warmth, occasional playful energy, bright alert eyes",
    "sleepy": "with drowsy slow movements, heavy peaceful eyelids, relaxed muscles",
    "curious": "with alert attentive movements, wide interested eyes, perked ears",
    "playful": "with energetic bouncy subtle movements, ready-to-pounce tension",
    "royal": "with dignified slow deliberate movements, noble composed bearing",
    "shy": "with gentle tentative movements, soft bashful glances, delicate gestures",
  };

  const motionDesc = motionDescriptions[motion] || "gentle natural breathing and subtle movements";
  const personalityMotion = personalityMotions[personality] || "";

  return `Animate this ultra-realistic oil painting portrait of a cat with ${motionDesc}${personalityMotion ? ", " + personalityMotion : ""}. 

IMPORTANT ANIMATION GUIDELINES:
- Maintain the rich oil painting texture and artistic quality throughout
- Motion should be smooth, natural, and lifelike
- Keep camera completely static to preserve the classic portrait feel
- Loop must be seamless and continuous
- Focus on subtle, realistic cat movements
- Preserve all painterly brushstroke details during animation
- Eyes should have natural moisture and occasional blink reflex
- Fur should have subtle movement responding to breathing`;
}
