import { defineConfig } from "vite";
import pkg from "./package.json";
import path from "path";

import solid from "vite-plugin-solid";
import windi from "vite-plugin-windicss";
import { VitePWA as pwa } from "vite-plugin-pwa";

import icons from "unplugin-icons/vite";
import icons_resolver from "unplugin-icons/resolver";

import pages from "vite-plugin-pages";
import imports from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    solid(),
    windi(),

    pages({
      dirs: "./src/routes"
    }),

    icons({
      compiler: "solid"
    }),

    imports({
      dts: "./src/auto-imports.d.ts",

      resolvers: [
        icons_resolver({
          prefix: "Icon",
          extension: "jsx"
        })
      ],

      imports: [
        "solid-js",
        "@solidjs/router",
        {
          // "@solid-primitives/i18n": [
          //   "useI18n",
          //   "createI18nContext"
          // ],
          "@solidjs/meta": [
            "Title"
          ]
        }
      ]
    }),

    pwa({
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
        name: "lpadder",
        short_name: "lpadder",
        description: "Web application that lets you play Launchpad covers directly from your browser.",

        background_color: "#1E293B", // WindiCSS: slate.800
        theme_color: "#0F172A", // WindiCSS: slate.900

        categories: [
          "productivity",
          "utilities",
          "music",
          "games"
        ],

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

  server: {
    port: 3000
  },

  build: {
    target: "esnext"
  }
});
