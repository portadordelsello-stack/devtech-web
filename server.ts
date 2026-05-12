import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from '@google/genai';
import { Resend } from 'resend';

let ai: GoogleGenAI | null = null;
let resend: Resend | null = null;
const configPath = path.join(process.cwd(), 'system-config.json');

function getSystemConfig() {
  let cfg = {
    apiKey: process.env.VERTEX_API_KEY || '',
    projectId: process.env.VERTEX_PROJECT_ID || '',
    location: process.env.VERTEX_LOCATION || 'us-central1',
    resendApiKey: process.env.RESEND_API_KEY || ''
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

  if (cfg.resendApiKey) {
    resend = new Resend(cfg.resendApiKey);
    console.log("Resend inicializado.");
  } else {
    resend = null;
    console.log("Resend omitido (falta API key).");
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
     const { apiKey, projectId, location, resendApiKey } = req.body;
     const existing = getSystemConfig();
     
     const newConfig = { 
         ...existing, 
         apiKey: apiKey !== undefined ? apiKey : existing.apiKey, 
         projectId: projectId !== undefined ? projectId : existing.projectId, 
         location: location !== undefined ? location : existing.location,
         resendApiKey: resendApiKey !== undefined ? resendApiKey : existing.resendApiKey
     };

     fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
     
     // Reinicializar el cliente de Vertex al instante con las nuevas credenciales
     initializeAI();
     res.json({ success: true });
  });

  app.post('/api/register-workshop', async (req, res) => {
    try {
      const { name, email, problem } = req.body;
      
      if (resend) {
        await resend.emails.send({
          from: 'DevTech Workshop <onboarding@resend.dev>', // Usar resend.dev para pruebas por ahora si no hay dominio
          to: [email],
          subject: '¡Felicidades por dar el primer paso! 🚀',
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
              <h2 style="color: #4F46E5;">¡Hola ${name}!</h2>
              <p>Queríamos felicitarte personalmente por decidirte a transformar tus ideas en herramientas reales.</p>
              <p>Hemos recibido tu registro con el siguiente desafío:</p>
              <blockquote style="background: #f9f9f9; border-left: 4px solid #4F46E5; padding: 10px; font-style: italic;">"${problem}"</blockquote>
              <p>Es un excelente punto de partida. Pronto nos contactaremos por WhatsApp o correo para organizar tu participación en nuestro próximo VibeCoding Workshop.</p>
              <br/>
              <p>¡Nos vemos pronto!</p>
              <p>El equipo de <strong>DevTech</strong></p>
            </div>
          `
        });
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error en register-workshop:", error);
      res.status(500).json({ error: error.message });
    }
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
           systemInstruction: "Eres un Asistente Senior experto en planificación y modelos de negocio. Tu objetivo es ayudar y guiar al usuario en la creación, planificación y definición de su proyecto usando un Business Model Canvas. Sé profesional, estructurado, constructivo y motivador en español. IMPORTANTE: Extrae la información de la conversación y usa la herramienta 'updateBusinessModelCanvas' para actualizar el modelo en tiempo real.",
           tools: [{
             functionDeclarations: [
               {
                 name: "updateBusinessModelCanvas",
                 description: "Actualiza el Business Model Canvas del proyecto con la información extraída de la conversación",
                 parameters: {
                   type: Type.OBJECT,
                   properties: {
                     customerSegments: { type: Type.ARRAY, items: { type: Type.STRING } },
                     valuePropositions: { type: Type.ARRAY, items: { type: Type.STRING } },
                     channels: { type: Type.ARRAY, items: { type: Type.STRING } },
                     customerRelationships: { type: Type.ARRAY, items: { type: Type.STRING } },
                     revenueStreams: { type: Type.ARRAY, items: { type: Type.STRING } },
                     keyResources: { type: Type.ARRAY, items: { type: Type.STRING } },
                     keyActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
                     keyPartnerships: { type: Type.ARRAY, items: { type: Type.STRING } },
                     costStructure: { type: Type.ARRAY, items: { type: Type.STRING } }
                   }
                 }
               }
             ]
           }]
        }
      });

      let reply = response.text || "";
      let canvasUpdate = undefined;

      if (response.functionCalls && response.functionCalls.length > 0) {
        const fc = response.functionCalls[0];
        if (fc.name === 'updateBusinessModelCanvas') {
           canvasUpdate = fc.args;
           if (!reply) {
             reply = "¡He actualizado el Business Model Canvas basándome en lo que conversamos! Revísalo en la pantalla.";
           }
        }
      }

      res.json({ reply, canvasUpdate });
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
