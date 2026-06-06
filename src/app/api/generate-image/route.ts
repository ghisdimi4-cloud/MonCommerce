import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productName, category } = await request.json();

    if (!productName) {
      return NextResponse.json({ error: "Le nom du produit est requis" }, { status: 400 });
    }

    // Détermination de l'image locale générique la plus appropriée
    const n = productName.toLowerCase();
    const c = category?.toLowerCase() || "";
    let imageType = "unite"; // par défaut

    if (/(sac|riz|maïs|sucre|farine|ciment)/i.test(n) || c.includes("céréale")) {
      imageType = "sac";
    } else if (/(boîte|conserve|tomate)/i.test(n)) {
      imageType = "boite";
    } else if (/(pack|boisson|eau|jus)/i.test(n)) {
      imageType = "pack";
    } else if (/(bouteille|vin|liqueur)/i.test(n)) {
      imageType = "bouteille";
    } else if (/(carton|spaghetti)/i.test(n)) {
      imageType = "carton";
    }

    // On retourne le chemin absolu vers l'image dans le dossier public
    const imageUrl = `/images/products/generic/${imageType}.jpg`;

    // Petit délai artificiel pour simuler un traitement (pour l'expérience UX avec le toast)
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ imageUrl: imageUrl, isFallback: true });
    
  } catch (error: any) {
    console.error("Erreur API mapping image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
