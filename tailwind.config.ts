import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fbf7ee",
          100: "#f5ecd0",
          200: "#ead79f",
          300: "#dcbb63",
          400: "#c99e3d",
          500: "#b1842b",
          600: "#8f6821",
          700: "#6d4f19",
          800: "#4a3610",
          900: "#2b1f08",
        },
        ink: {
          50: "#f7f7f7",
          100: "#eaeaea",
          800: "#1c1c1c",
          900: "#0e0e0e",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Be Vietnam Pro'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 20px 60px -20px rgba(140, 100, 30, 0.35)",
      },
      backgroundImage: {
        "grain": "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 200 200\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\'/></filter><rect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23n)\\' opacity=\\'0.06\\'/></svg>')",
      },
    },
  },
  plugins: [],
};

export default config;
