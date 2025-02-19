import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#2a3e48",
        foreground: "var(--foreground)",
        card: {
          background: {
            light: "white",
            dark: "white"
          }
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
