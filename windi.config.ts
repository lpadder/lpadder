import { defineConfig } from "windicss/helpers";
import colors from "windicss/colors";

import aspectRatioPlugin from "windicss/plugin/aspect-ratio";

export default defineConfig({
  darkMode: "class",
  attributify: false,

  theme: {
    extend: {
      backgroundImage: {
        "home-desktop": "url('/src/assets/backgrounds/home-desktop.svg')",
        "home-mobile": "url('/src/assets/backgrounds/home-mobile.svg')"
      }
    },

    colors: {
      transparent: "transparent",
      current: "currentColor",
      pink: colors.fuchsia,
      gray: colors.slate,
      blue: colors.sky
    },

    fontFamily: {
      sans: ["Poppins", "sans-serif"]
    }
  },

  plugins: [aspectRatioPlugin]
});
