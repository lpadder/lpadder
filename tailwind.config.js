/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  mode: "jit",
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
      sans: ["Poppins", ...defaultTheme.fontFamily.sans]
    }
  }
};
