import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scotia: {
          red: "#EC111A",
          "red-dark": "#C40E16",
          ink: "#1A1A1A",
          muted: "#5C5C5C",
          line: "#E4E2DF",
          paper: "#F5F3F0",
          mist: "#FAF9F7",
          teal: "#0B6E6B",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(26,26,26,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
