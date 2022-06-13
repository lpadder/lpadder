import solid from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import mix, { nodeAdapter, vercelAdapter } from "vite-plugin-mix";
import dotenv from "dotenv";
import path from "path";
import pkg from "./package.json";

dotenv.config({
  path: path.resolve(__dirname, ".env.local")
});

// Loaded from ".env.local".
const CLIENT_PORT = parseInt(process.env.CLIENT_PORT) || 3000;

export default defineConfig({
  plugins: [
    mix({
      handler: path.resolve(__dirname, "./src/api/index.ts"),
      adapter: process.env.VERCEL
        ? vercelAdapter()
        : nodeAdapter()
    }),

    solid(),
    VitePWA({
      includeAssets: [
        "robots.txt",
        "favicon.ico",
        "apple-touch-icon.png"
      ],
      
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,svg,png,woff,woff2}"
        ]
      },

      manifest: {
        name: "lpadder.",
        short_name: "lpadder.",
        description: "Web application that lets you play Launchpad covers directly from your browser.",

        background_color: "#1E293B", // slate.800
        theme_color: "#0F172A", // slate.900

        icons: [
          {
            src: "icon-default.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-default-large.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "icon-default-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "icon-default-maskable-large.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ],
  
  define: {
    APP_VERSION: JSON.stringify(pkg.version)
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },

  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },

  server: {
    strictPort: true,
    
    hmr: {
      clientPort: CLIENT_PORT
    }
  }
});
