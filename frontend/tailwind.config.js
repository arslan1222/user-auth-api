/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f2",
          100: "#fde8e8",
          200: "#fbd5d5",
          300: "#f8b4b4",
          400: "#f98080",
          500: "#e02424",
          600: "#b91c1c",
          700: "#8b0b0b",
          800: "#610505", // Main Brand Color
          900: "#450303",
          950: "#2b0101",
        },

        secondary: {
          50: "#faf7f7",
          100: "#f3eded",
          200: "#e5dada",
          300: "#d3c1c1",
          400: "#b79d9d",
          500: "#9c7f7f",
          600: "#7f6464",
          700: "#654d4d",
          800: "#4c3838",
          900: "#352626",
        },

        accent: {
          50: "#fffaf0",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4a017", // Gold Accent
          600: "#b8860b",
          700: "#926f09",
          800: "#755808",
          900: "#5f4706",
        },
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        slideUp: {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};