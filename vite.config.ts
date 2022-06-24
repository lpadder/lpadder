import type { UserConfigExport } from "vite";
import { defineConfig } from "vite";
import pkg from "./package.json";
import dotenv from "dotenv";
import path from "path";

import WindiCSS from "vite-plugin-windicss";

import type { VitePWAOptions } from "vite-plugin-pwa";
import { VitePWA } from "vite-plugin-pwa";

import solid from "solid-start";
import vercel from "solid-start-vercel";

import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";

dotenv.config({
  path: path.resolve(__dirname, ".env.local")
});

const pwaOptions: Partial<VitePWAOptions> = {
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
};

// Loaded from ".env.local".
const CLIENT_PORT = parseInt(process.env.CLIENT_PORT as string) || 3000;

const viteOptions: UserConfigExport & { ssr: { noExternal: string[] } } = {
  plugins: [
    WindiCSS(),
    solid({ adapter: vercel() }),
    AutoImport({
      dts: "./src/auto-imports.d.ts",
      eslintrc: { enabled: true },

      resolvers: [
        IconsResolver({
          prefix: "Icon",
          extension: "jsx"
        })
      ],
      
      imports: [
        "solid-app-router",
        "solid-js",
        {
          // "@solid-primitives/i18n": [
          //   "useI18n",
          //   "createI18nContext"
          // ],
          "solid-meta": [
            "Title"
          ]
        }
      ]
    }),
    Icons({ compiler: "solid" }),
    VitePWA(pwaOptions)
  ],
  
  define: {
    APP_VERSION: JSON.stringify(pkg.version)
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },

  ssr: {
    noExternal: [
      "solid-headless"
    ]
  },
  
  build: {
    target: "esnext",
    polyfillDynamicImport: false
  },

  server: {
    strictPort: true,
    
    hmr: {
      clientPort: CLIENT_PORT
    }
  }
};

export default defineConfig(viteOptions);
