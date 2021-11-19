module.exports = {
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "home-desktop": "url('/src/assets/backgrounds/home-desktop.svg')",
        "home-mobile": "url('/src/assets/backgrounds/home-mobile.svg')"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}