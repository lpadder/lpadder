import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from "dotenv";
import path from "path";



export default defineConfig(() => {
  dotenv.config({ path: path.resolve(__dirname, ".env.local") });
  const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

  return {
    plugins: [
      react(),
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
          // Global informations.
          name: "lpadder.",
          short_name: "lpadder.",
          description: "Web application that lets you play Launchpad covers directly from your browser.",

          // Colors from Tailwind's color palette.
          background_color: "#1E293B", // blueGray-800
          theme_color: "#0F172A", // blueGray-900

          // Icons.
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
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    server: {
      strictPort: true,
      hmr: {
        clientPort: CLIENT_PORT
      }
    }
  };
});
