import { defineConfig, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/api/elevenlabs/tts', async (req, res, next) => {
      if (req.method !== 'POST') return next();
      try {
        let rawBody = '';
        req.on('data', (chunk) => (rawBody += chunk));
        req.on('end', async () => {
          const { text, voice_id, model_id, voice_settings } = JSON.parse(rawBody || '{}');
          if (!process.env.ELEVENLABS_API_KEY) {
            res.statusCode = 500;
            res.end('Missing ELEVENLABS_API_KEY on server');
            return;
          }
          const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id || 'pNInz6obpgDQGcFmaJgB'}`, {
            method: 'POST',
            headers: {
              Accept: 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': process.env.ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text,
              model_id: model_id || 'eleven_multilingual_v2',
              voice_settings: voice_settings || {
                stability: 0.5,
                similarity_boost: 0.8,
                style: 0.2,
                use_speaker_boost: true,
              },
            }),
          });
          const buf = Buffer.from(await r.arrayBuffer());
          res.statusCode = r.status;
          res.setHeader('Content-Type', 'audio/mpeg');
          res.end(buf);
        });
      } catch (e) {
        res.statusCode = 500;
        res.end('Proxy error');
      }
    });
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['tarjeta-de-credito.ico', 'robots.txt'],
      manifest: {
        name: 'SmartWallet Advisor',
        short_name: 'SmartWallet',
        description: 'Tu asistente financiero personal para gestionar tarjetas de crédito',
        theme_color: '#0066FF',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
