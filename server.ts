import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize GoogleGenAI
  let ai: GoogleGenAI | null = null;
  try {
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Google GenAI SDK initialized successfully.");
    } else {
      console.warn("GEMINI_API_KEY is not defined in environment variables.");
    }
  } catch (err) {
    console.error("Failed to initialize Google GenAI SDK:", err);
  }

  // Ensure compliance with API routes loaded first
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Interactive J.A.R.V.I.S. chatbot response route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!ai) {
        const genericResponses = [
          "Good day, Sir. I hope you are well. While our primary cognitive network uplink is currently offline (please verify your GEMINI_API_KEY in the Secrets panel to fully enable my live intellect), my static subroutines remain at your service.",
          "System diagnostics look optimal, Sir. No immediate hazards detected in area grid coordinates. I am ready to deploy the Mark-XLII whenever you give your command.",
          "Indeed, Sir. Energy levels in the Arc Reactor are steady around 1.21 Gigawatts. Thermals are stabilized. How shall we proceed with our mission?",
          "As always, Sir, I've run a localized analysis. All environmental shields are holding. Let me know if you want me to run an override of the active security protocols."
        ];
        const randomResponse = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        return res.json({ text: randomResponse });
      }

      const systemPrompt = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), the artificial intelligence developed by Tony Stark.
You are running on Aegis Core HUD framework (STITCH / NEURAL LINK) with MARK-XLII protocols.
You must speak in a highly sophisticated, British, polite, yet witty tone. Call the user "Sir" (or "Ma'am" if they prefer, default to "Sir").
You should address status checks, thermal readings, suit diagnostics, power levels, environmental shields, current grid coordinates, or weapon status upon request. Your replies must feel incredibly cinematic, smart, helpful and loyal.
Keep your answers brief, informative, and formatted with clean paragraphs or bullet points where appropriate.

Current technical HUD status you can reference:
- Mark-XLII armor: OPTIMAL
- Frame telemetry connection: STABLE [98.4%]
- Reactor Core: Active (1.21 GW output, 45°C)
- Current biometric match: 100% (ID: T-STARK-01)
- Active sector grid location: Lat 40.7128°, Lon -74.0060°, Alt 1,204 FT, Spd 0.002 Mach
- Hand gesture tracking: ACTIVE (pinch: Zoom, swipe: Rotate Globe, palm: Freeze Frame)
- Network environment: Neural link established.
`;

      const contents = [];
      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        });
      }
      contents.push({ role: "user", parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.75,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error in JARVIS chat:", error);
      res.status(500).json({ error: error.message || "Localized neural connection failure." });
    }
  });

  // Vite middleware for development or serving static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
