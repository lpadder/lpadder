import { defineConfig } from "vite";
import pkg from "./package.json";
import dotenv from "dotenv";
import path from "path";

import WindiCSS from "vite-plugin-windicss";

import type { VitePWAOptions } from "vite-plugin-pwa";
import { VitePWA } from "vite-plugin-pwa";

import solid from "solid-start/vite";
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
};

// Loaded from ".env.local".
// Const CLIENT_PORT = parseInt(process.env.CLIENT_PORT as string) || 3000;

export default defineConfig({
  plugins: [
    WindiCSS(),
    solid({ ssr: false, adapter: vercel() }),
    AutoImport({
      dts: "./src/auto-imports.d.ts",

      resolvers: [
        IconsResolver({
          prefix: "Icon",
          extension: "jsx"
        })
      ],

      imports: [
        "solid-js",
        {
          // "@solid-primitives/i18n": [
          //   "useI18n",
          //   "createI18nContext"
          // ],
          "@solidjs/router": [
            "Link",
            "NavLink",
            "Navigate",
            "Outlet",
            "Route",
            "Router",
            "Routes",
            "_mergeSearchString",
            "createIntegration",
            "hashIntegration",
            "normalizeIntegration",
            "pathIntegration",
            "staticIntegration",
            "useHref",
            "useIsRouting",
            "useLocation",
            "useMatch",
            "useNavigate",
            "useParams",
            "useResolvedPath",
            "useRouteData",
            "useRoutes",
            "useSearchParams"
          ],
          "@solidjs/meta": [
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

  // Ssr: {
  //   NoExternal: [
  //     "solid-headless"
  //   ]
  // },

  build: {
    ssr: false
  },

  server: {
    port: 3000
    // Hmr: {
    //   ClientPort: CLIENT_PORT
    // }
  }
});
