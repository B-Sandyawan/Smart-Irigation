/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5E9DB", 
        primary: {
          light: "#9BC19B",
          DEFAULT: "#4B9567",
          dark: "#2D3B2E"
        },
        surface: "#FEF9F3",
        textMain: "#111111",
        textMuted: "#A5A5A5",
      },
      fontFamily: {
        sans: ['"Onest"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

