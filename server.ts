import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
const configPath = path.join(process.cwd(), 'system-config.json');

function getSystemConfig() {
  let cfg = {
    apiKey: process.env.VERTEX_API_KEY || '',
    projectId: process.env.VERTEX_PROJECT_ID || '',
    location: process.env.VERTEX_LOCATION || 'us-central1'
  };
  
  if (fs.existsSync(configPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      cfg = { ...cfg, ...data };
    } catch (e) {
      console.error('Error leyendo config:', e);
    }
  }
  return cfg;
}

function initializeAI() {
  const cfg = getSystemConfig();
  
  if (cfg.apiKey && cfg.projectId && cfg.location) {
    try {
      ai = new GoogleGenAI({ 
          // @ts-ignore - Indispensable ignorar tipado para forzar este modo de auth en Vertex
          vertexai: { project: cfg.projectId, location: cfg.location },
          apiKey: cfg.apiKey
      });
      console.log("Asistente de IA inicializado usando Vertex Express con API Key. Proyecto:", cfg.projectId);
    } catch(e) {
      console.error("Fallo al iniciar el Asistente Vertex IA Express:", e);
    }
  } else {
    ai = null;
    console.log("Inicialización de IA omitida. Faltan configuraciones de Vertex en el Panel de Admin.");
  }
}

// Inicializar al arrancar
initializeAI();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Admin routes
  app.get('/api/admin/system-config', (req, res) => {
     res.json(getSystemConfig());
  });

  app.post('/api/admin/system-config', (req, res) => {
     const { apiKey, projectId, location } = req.body;
     const existing = getSystemConfig();
     
     const newConfig = { 
         ...existing, 
         apiKey: apiKey !== undefined ? apiKey : existing.apiKey, 
         projectId: projectId !== undefined ? projectId : existing.projectId, 
         location: location !== undefined ? location : existing.location
     };

     fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
     
     // Reinicializar el cliente de Vertex al instante con las nuevas credenciales
     initializeAI();
     res.json({ success: true });
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!ai) {
        return res.status(500).json({ reply: "Vertex AI no está configurado o inicializado. Por favor, configure las credenciales en el Panel de Admin." });
      }

      const contents = history ? history.map((item: any) => ({
         role: item.role,
         parts: [{ text: item.content }]
      })) : [];
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
           systemInstruction: "Eres un Asistente Senior experto en planificación y arquitectura de software. Tu objetivo es ayudar y guiar al usuario en la creación, planificación y definición técnica de su proyecto o aplicación de software. Sé profesional, estructurado, constructivo y motivador en español.",
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ reply: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
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

  // Bind to 0.0.0.0
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
