import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, baseKitten, accessory, background, baseImageUrl, isPremium, geminiApiKey } = await req.json();
    
    // Use client-provided Gemini API key if available, otherwise fall back to LOVABLE_API_KEY
    const apiKey = geminiApiKey || Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      throw new Error("API Key não configurada. Por favor, insira sua API Key do Google Gemini.");
    }

    // Determine which API to use based on the key provided
    const useGeminiDirect = !!geminiApiKey;

    const durationSeconds = isPremium ? 120 : 5;
    
    console.log("Generating styled avatar with prompt:", prompt);
    console.log("Base image provided:", baseImageUrl ? "Yes" : "No");
    console.log("Is Premium:", isPremium);

    let generatedImageUrl: string | null = null;
    
    if (baseImageUrl) {
      // Generate styled image using image-to-image transformation
      const imagePrompt = buildImagePrompt(prompt, accessory, background);
      
      // Use Google's Gemini API directly if client provided their own key
      // Use imagen-3.0-generate-002 for image generation with direct Gemini API
      const apiUrl = useGeminiDirect 
        ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent"
        : "https://ai.gateway.lovable.dev/v1/chat/completions";
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      let requestBody: any;
      
      if (useGeminiDirect) {
        // Direct Gemini API format for image generation model
        headers["x-goog-api-key"] = apiKey;
        requestBody = {
          contents: [
            {
              parts: [
                { text: imagePrompt },
                {
                  inlineData: {
                    mimeType: "image/png",
                    data: baseImageUrl.replace(/^data:image\/\w+;base64,/, "")
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        };
      } else {
        // Lovable AI Gateway format
        headers["Authorization"] = `Bearer ${apiKey}`;
        requestBody = {
          model: "google/gemini-3-pro-image-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: imagePrompt },
                { type: "image_url", image_url: { url: baseImageUrl } }
              ],
            },
          ],
          modalities: ["image", "text"],
        };
      }

      let imageResponse = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      // If using user's Gemini key and it fails, fallback to Lovable AI Gateway
      if (!imageResponse.ok && useGeminiDirect) {
        const errorText = await imageResponse.text();
        console.error("User Gemini API error:", imageResponse.status, errorText);
        
        const isQuotaOrRateLimit = imageResponse.status === 429 || errorText.includes("quota") || errorText.includes("RESOURCE_EXHAUSTED");
        const isInvalidKey = errorText.includes("API_KEY_INVALID") || errorText.includes("API key not valid");
        
        if (isQuotaOrRateLimit || isInvalidKey || imageResponse.status >= 400) {
          console.log("Falling back to Lovable AI Gateway...");
          
          const fallbackApiKey = Deno.env.get("LOVABLE_API_KEY");
          if (fallbackApiKey) {
            const fallbackHeaders = {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${fallbackApiKey}`,
            };
            
            const fallbackBody = {
              model: "google/gemini-3-pro-image-preview",
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: imagePrompt },
                    { type: "image_url", image_url: { url: baseImageUrl } }
                  ],
                },
              ],
              modalities: ["image", "text"],
            };
            
            imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: fallbackHeaders,
              body: JSON.stringify(fallbackBody),
            });
            
            if (imageResponse.ok) {
              console.log("Fallback to Lovable AI Gateway successful");
              const imageData = await imageResponse.json();
              generatedImageUrl = extractImageFromResponse(imageData);
            }
          }
        }
        
        // If fallback also failed, return appropriate error
        if (!imageResponse.ok) {
          if (isQuotaOrRateLimit) {
            return new Response(
              JSON.stringify({ error: "Limite de uso atingido. Aguarde alguns minutos e tente novamente." }),
              { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          if (isInvalidKey) {
            return new Response(
              JSON.stringify({ error: "API Key inválida. Verifique se você copiou a chave corretamente." }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          throw new Error(`Image API error: ${imageResponse.status}`);
        }
      } else if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error("Image API error:", imageResponse.status, errorText);
        throw new Error(`Image API error: ${imageResponse.status}`);
      }

      // Only parse response if we haven't already (fallback case)
      if (!generatedImageUrl) {
        const imageData = await imageResponse.json();
        console.log("Image response received");
        
        generatedImageUrl = useGeminiDirect 
          ? extractImageFromGeminiResponse(imageData) 
          : extractImageFromResponse(imageData);
      }
    } else {
      // Generate image from text only
      const textPrompt = buildTextOnlyPrompt(prompt, accessory, background, baseKitten);
      
      const apiUrl = useGeminiDirect 
        ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent"
        : "https://ai.gateway.lovable.dev/v1/chat/completions";
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      let requestBody: any;
      
      if (useGeminiDirect) {
        headers["x-goog-api-key"] = apiKey;
        requestBody = {
          contents: [
            {
              parts: [{ text: textPrompt }]
            }
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        };
      } else {
        headers["Authorization"] = `Bearer ${apiKey}`;
        requestBody = {
          model: "google/gemini-3-pro-image-preview",
          messages: [
            { role: "user", content: textPrompt },
          ],
          modalities: ["image", "text"],
        };
      }

      const imageResponse = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error("Text-to-image API error:", imageResponse.status, errorText);
        throw new Error(`Image API error: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();
      generatedImageUrl = useGeminiDirect 
        ? extractImageFromGeminiResponse(imageData) 
        : extractImageFromResponse(imageData);
    }

    if (!generatedImageUrl) {
      console.error("No image found in response");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Não foi possível gerar a imagem. Tente novamente.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        videoUrl: generatedImageUrl,
        durationSeconds,
        thumbnailUrl: generatedImageUrl,
        isImage: true 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error generating content:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao gerar conteúdo";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function extractImageFromResponse(data: any): string | null {
  try {
    const message = data.choices?.[0]?.message;
    if (!message) return null;

    // Check for images array
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

    // Check for content array with inline_data
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

function extractImageFromGeminiResponse(data: any): string | null {
  try {
    // Gemini direct API response format
    const candidates = data.candidates;
    if (!candidates || !candidates.length) return null;
    
    const content = candidates[0]?.content;
    if (!content || !content.parts) return null;
    
    for (const part of content.parts) {
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (e) {
    console.error("Error extracting image from Gemini response:", e);
    return null;
  }
}

function buildImagePrompt(customPrompt: string, accessory: string, background: string): string {
  const accessoryMap: Record<string, string> = {
    none: "",
    hat: "wearing a cute magical top hat",
    glasses: "wearing stylish cool sunglasses",
    bow: "wearing an adorable pink ribbon bow on its head",
    crown: "wearing a beautiful golden crown with gems",
  };

  const backgroundMap: Record<string, string> = {
    pink: "soft pastel pink gradient background",
    blue: "gentle sky blue gradient background", 
    green: "fresh mint green gradient background",
    purple: "dreamy lavender purple gradient background",
    yellow: "warm sunny yellow gradient background",
  };

  let prompt = `Transform this kitten into a beautiful, expressive animated character perfect for social media.

CRITICAL REQUIREMENTS:
- Create a stunning kawaii/anime style illustration
- Big sparkly expressive eyes with highlights
- Soft, fluffy fur with beautiful lighting
- Happy, lovable expression with slight smile
- High quality digital art, vibrant saturated colors
- 9:16 vertical format optimized for Stories/Reels
- The kitten should look ready to animate - dynamic pose`;

  if (accessory && accessory !== "none" && accessoryMap[accessory]) {
    prompt += `\n- Accessory: ${accessoryMap[accessory]}`;
  }

  if (background && backgroundMap[background]) {
    prompt += `\n- Background: ${backgroundMap[background]}, with magical sparkles and floating hearts`;
  }

  if (customPrompt && customPrompt.trim()) {
    prompt += `\n- Scene/Action: ${customPrompt}`;
  }

  prompt += `\n\nOUTPUT: A single beautiful vertical portrait image (9:16 aspect ratio), centered, ready for social media sharing. Make it incredibly cute and viral-worthy!`;

  return prompt;
}

function buildTextOnlyPrompt(customPrompt: string, accessory: string, background: string, baseKitten: string): string {
  const accessoryMap: Record<string, string> = {
    none: "",
    hat: "wearing a cute magical top hat",
    glasses: "wearing stylish cool sunglasses",
    bow: "wearing an adorable pink ribbon bow on its head",
    crown: "wearing a beautiful golden crown with gems",
  };

  const backgroundMap: Record<string, string> = {
    pink: "soft pastel pink gradient background",
    blue: "gentle sky blue gradient background", 
    green: "fresh mint green gradient background",
    purple: "dreamy lavender purple gradient background",
    yellow: "warm sunny yellow gradient background",
  };

  let prompt = `Generate a beautiful kawaii/anime style illustration of an adorable kitten character for social media.

STYLE:
- Ultra cute kawaii/anime aesthetic
- Big sparkly expressive eyes with star highlights
- Soft, fluffy fur with beautiful shading
- Happy, lovable expression
- High quality digital art
- Vibrant, saturated pastel colors
- 9:16 vertical format (portrait)`;

  if (accessory && accessory !== "none" && accessoryMap[accessory]) {
    prompt += `\n- The kitten is ${accessoryMap[accessory]}`;
  }

  if (background && backgroundMap[background]) {
    prompt += `\n- Background: ${backgroundMap[background]}, with magical sparkles and floating hearts`;
  }

  if (customPrompt && customPrompt.trim()) {
    prompt += `\n- Scene/Action: ${customPrompt}`;
  }

  prompt += `\n\nCREATE: A stunning vertical portrait of an incredibly cute kitten, perfect for Instagram Stories, TikTok, and social media!`;

  return prompt;
}
