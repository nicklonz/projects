import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
          tint: "#dbeafe"
        }
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgba(0,0,0,0.1)"
      }
    },
  },
  plugins: []
}
export default config
