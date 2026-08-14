import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F6B4F",
          hover: "#0A4F3A",
          soft: "#E8F1ED",
          light: "#F0F7F4",
        },
        accent: {
          DEFAULT: "#C2600F",
          hover: "#9E4E0C",
          soft: "#FDF3EC",
        },
        text: {
          main: "#111827",
          muted: "#5B6672",
          light: "#8C96A3",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F5F7F6",
          tertiary: "#EAEFEA",
        }
      },
      borderRadius: {
        ctrl: "8px",
        card: "12px",
        block: "16px",
      },
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
