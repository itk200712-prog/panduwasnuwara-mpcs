import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf4",
          100: "#d3f5e2",
          200: "#a9eacb",
          300: "#71d8ab",
          400: "#3bbf86",
          500: "#17a36a",
          600: "#0a8455",
          700: "#086a46",
          800: "#08543a",
          900: "#074531",
          950: "#03271c",
        },
        navy: {
          50: "#eef3f9",
          100: "#d5e1ef",
          200: "#afc4e0",
          300: "#7f9fc9",
          400: "#577cad",
          500: "#3d6192",
          600: "#2f4c78",
          700: "#283e61",
          800: "#253651",
          900: "#0b1f33",
          950: "#071522",
        },
        gold: {
          50: "#fbf7ea",
          100: "#f5ecc9",
          200: "#ebd894",
          300: "#e0c15d",
          400: "#d6ab37",
          500: "#c3922a",
          600: "#a37422",
          700: "#80571f",
          800: "#6b471f",
          900: "#5a3c1e",
          950: "#331f0d",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-sinhala)", "system-ui", "sans-serif"],
        sinhala: ["var(--font-sinhala)", "Iskoola Pota", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(11,31,51,0.06), 0 10px 30px -12px rgba(11,31,51,0.12)",
        "card-hover": "0 4px 12px rgba(11,31,51,0.08), 0 22px 45px -16px rgba(11,31,51,0.22)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-14px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.7s ease-out both",
        "slide-in": "slide-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
