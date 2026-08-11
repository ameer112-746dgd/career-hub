/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ADD THIS LINE
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all your components and pages
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Fallback blue so things aren't invisible
          foreground: "#ffffff",
        },
        background: "white",
        foreground: "#0f172a",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
}