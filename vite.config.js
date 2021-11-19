import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
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
        description: "Offline application that allows you to play Launchpad covers from anywhere.",

        // Style
        background_color: "#191919",
        theme_color: "#191919",

        // Icons
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
  ]
});
