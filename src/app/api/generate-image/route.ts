import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { productName, category, description } = await request.json();

    if (!productName) {
      return NextResponse.json({ error: "Le nom du produit est requis" }, { status: 400 });
    }

    // 1. Build a highly specific prompt for the AI based on the user's requirements
    let promptContext = "Professional e-commerce studio photography of ";
    
    if (category?.toLowerCase().includes("alimentation")) {
      if (/(sac|riz|maïs|sucre|farine)/i.test(productName)) {
        promptContext += `a premium burlap sack packaging of ${productName}`;
      } else if (/(boîte|conserve|tomate)/i.test(productName)) {
        promptContext += `a modern tin can packaging of ${productName}`;
      } else {
        promptContext += `a high quality premium food packaging of ${productName}`;
      }
    } else if (category?.toLowerCase().includes("boisson") || /(coca|jus|bouteille)/i.test(productName)) {
      promptContext += `a premium bottle or can of ${productName} beverage`;
    } else if (category?.toLowerCase().includes("cosmétique")) {
      promptContext += `elegant modern cosmetic bottles or cream jars of ${productName}`;
    } else if (category?.toLowerCase().includes("électronique")) {
      promptContext += `a realistic modern tech gadget or smartphone named ${productName}`;
    } else if (category?.toLowerCase().includes("pharmacie")) {
      promptContext += `a professional medical packaging box of ${productName}`;
    } else {
      promptContext += `${productName} packaging box`;
    }

    const fullPrompt = `${promptContext}, clean white background, 3/4 angle, subtle soft shadow, studio lighting, highly detailed, 4k resolution, white background, standalone product. No people, no distractions.`;

    // 2. Call pollinations.ai (Free, no API key required, generates high-quality images via URL)
    // We add a random seed to avoid caching on their CDN if we want a fresh image, but here we want uniqueness.
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=800&height=800&nologo=true&seed=${seed}`;

    // 3. Fetch the image to store it in Supabase
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Erreur lors de la génération de l'image par l'IA");
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    // 4. Upload to Supabase Storage
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const fileName = `product_${Date.now()}_${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    
    // We try to upload. If the bucket "product-images" doesn't exist or RLS fails, we fallback to returning the pollinations URL directly.
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      console.warn("Erreur upload Supabase (le bucket 'product-images' n'existe peut-être pas ou les permissions RLS manquent). Fallback vers l'URL de l'IA :", error);
      return NextResponse.json({ imageUrl: imageUrl, isFallback: true });
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ imageUrl: publicUrlData.publicUrl, isFallback: false });
    
  } catch (error: any) {
    console.error("Erreur API generation image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
