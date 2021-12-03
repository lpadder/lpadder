import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ command }) => {
  return {
    // "/absproxy/3000" is my code-server proxy URL.
    base: command === "serve" ? "/absproxy/3000/" : "/",
    plugins: [
      react(),
      VitePWA({
        includeAssets: [
          "robots.txt",
          "favicon.ico",
          "apple-touch-icon.png"
        ],
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
    }
  }
});
