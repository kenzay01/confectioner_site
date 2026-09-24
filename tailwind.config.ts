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
      fontFamily: {
        sans: [
          "var(--font-montserrat)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        montserrat: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
        lato: ["var(--font-lato)", "ui-sans-serif", "system-ui"],
        openSans: ["var(--font-open-sans)", "ui-sans-serif", "system-ui"],
        roboto: ["var(--font-roboto)", "ui-sans-serif", "system-ui"],
        playfairDisplay: [
          "var(--font-playfair-display)",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        merriweather: ["var(--font-merriweather)", "ui-serif", "Georgia"],
        dmSans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui"],
        plusJakartaSans: [
          "var(--font-plus-jakarta-sans)",
          "ui-sans-serif",
          "system-ui",
        ],
        nunito: ["var(--font-nunito)", "ui-sans-serif", "system-ui"],
        raleway: ["var(--font-raleway)", "ui-sans-serif", "system-ui"],
        literata: ["var(--font-literata)", "ui-serif", "Georgia"],
        workSans: ["var(--font-work-sans)", "ui-sans-serif", "system-ui"],
      },
      spacing: {
        "92": "23rem",
        "102": "25.5rem",
        "140": "35rem",
      },
      height: {
        "92": "23rem",
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
