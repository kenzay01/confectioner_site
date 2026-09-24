import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        "102": "25.5rem",
        "140": "35rem",
      },
      height: {
        "140": "35rem",
      },
      minHeight: {
        "140": "35rem",
      },
    },
  },
  plugins: [],
};

export default config;
