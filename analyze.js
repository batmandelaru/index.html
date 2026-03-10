// api/analyze.js
// Fonction Vercel Serverless — proxy sécurisé vers l'API Anthropic
// La clé API reste côté serveur, jamais exposée dans le navigateur

export default async function handler(req, res) {

  // Autorise uniquement les requêtes POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Headers CORS — permet à ton index.html d'appeler cette fonction
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Gère le preflight OPTIONS (vérification CORS du navigateur)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Le paramètre 'prompt' est manquant" });
    }

    // Clé API récupérée depuis les variables d'environnement Vercel (jamais exposée)
    const apiKey = process.env.ANTHROPIC_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Clé API Anthropic non configurée sur le serveur" });
    }

    // Appel à l'API Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    // Retourne la réponse au navigateur
    return res.status(200).json(data);

  } catch (error) {
    console.error("Erreur API:", error);
    return res.status(500).json({ error: "Erreur serveur : " + error.message });
  }
}
