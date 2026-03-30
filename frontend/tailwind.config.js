/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102542",
        cream: "#f6f3ea",
        coral: "#f26b5b",
        teal: "#1f7a8c",
        sand: "#e7d8c9",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(16, 37, 66, 0.12)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
