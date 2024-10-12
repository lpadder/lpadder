import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno()],

  theme: {
    fontFamily: {
      sans: "Poppins",
    }
  },
});
