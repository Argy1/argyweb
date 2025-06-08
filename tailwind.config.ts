import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",            // ← pastikan ini
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // (opsional) warna kustom
      colors: {
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
}

export default config
