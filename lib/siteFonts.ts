import {
  DM_Sans,
  Lato,
  Literata,
  Merriweather,
  Montserrat,
  Open_Sans,
  Plus_Jakarta_Sans,
  Nunito,
  Playfair_Display,
  Raleway,
  Roboto,
  Work_Sans,
} from "next/font/google";

/** Site + masterclass font families — minimal weights to cut build size and LCP cost. */
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-montserrat",
  preload: true,
  display: "swap",
});

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-lato",
  preload: false,
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
  preload: false,
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  preload: false,
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair-display",
  preload: false,
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
  preload: false,
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-dm-sans",
  preload: false,
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-plus-jakarta-sans",
  preload: false,
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  preload: false,
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-raleway",
  preload: false,
  display: "swap",
});

const literata = Literata({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-literata",
  preload: false,
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-work-sans",
  preload: false,
  display: "swap",
});

export const siteFontVariables = [
  montserrat.variable,
  lato.variable,
  openSans.variable,
  roboto.variable,
  playfairDisplay.variable,
  merriweather.variable,
  dmSans.variable,
  plusJakartaSans.variable,
  nunito.variable,
  raleway.variable,
  literata.variable,
  workSans.variable,
].join(" ");
