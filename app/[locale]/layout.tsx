import Header from "@/components/Header";
import { locales } from "@/i18n/config";
import { Metadata, Viewport } from "next";
import "../globals.css";
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
import { ItemsProvider } from "@/context/itemsContext";
import { SiteContentProvider } from "@/context/siteContentContext";
import Footer from "@/components/homePage/Footer";
import { readSiteContent } from "@/lib/siteContent";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
});

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
});

const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair-display",
});

const merriweather = Merriweather({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
});

const raleway = Raleway({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
});

const literata = Literata({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-literata",
});

const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-work-sans",
});

const fontVariables = [
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

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "Szkolenia z nowoczesnego piekarnictwa | Masterclasses",
      template: "%s | Confectioner Masterclasses"
    },
    description: "Profesjonalne szkolenia z nowoczesnego piekarnictwa. Naucz się technik wypieku chleba, ciast francuskich i słodkich wypieków od najlepszych mistrzów piekarnictwa w Polsce.",
    keywords: "szkolenia piekarnictwo, masterclass piekarnictwo, kursy piekarnicze, chleb, ciasta francuskie, wypieki, Tychy, Warszawa, Kraków, Gdańsk, Wrocław, confectioner, masterclasses, baking, pastry, bread making",
    authors: [{ name: "Confectioner Masterclasses", url: "https://confectioner-masterclasses.com" }],
    creator: "Confectioner Masterclasses",
    publisher: "Confectioner Masterclasses",
    category: "Education",
    classification: "Professional Baking Education",
    applicationName: "Confectioner Masterclasses",
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://confectioner-masterclasses.com'),
    alternates: {
      canonical: '/',
      languages: {
        'pl-PL': '/pl',
        'en-US': '/en',
      },
    },
    icons: {
      icon: [
        { url: '/logo.png', sizes: '32x32', type: 'image/png' },
        { url: '/logo.png', sizes: '16x16', type: 'image/png' },
        { url: '/logo.png', sizes: '48x48', type: 'image/png' },
        { url: '/logo.png', sizes: '64x64', type: 'image/png' }
      ],
      shortcut: '/logo.png',
      apple: [
        { url: '/logo.png', sizes: '180x180', type: 'image/png' },
        { url: '/logo.png', sizes: '152x152', type: 'image/png' },
        { url: '/logo.png', sizes: '120x120', type: 'image/png' }
      ],
      other: [
        { rel: 'mask-icon', url: '/logo.png', color: '#000000' }
      ]
    },
    manifest: '/manifest.json',
    openGraph: {
      title: "Szkolenia z nowoczesnego piekarnictwa | Masterclasses",
      description: "Profesjonalne szkolenia z nowoczesnego piekarnictwa. Naucz się technik wypieku chleba, ciast francuskich i słodkich wypieków od najlepszych mistrzów piekarnictwa w Polsce.",
      url: 'https://confectioner-masterclasses.com',
      siteName: 'Confectioner Masterclasses',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'Confectioner Masterclasses Logo',
        },
      ],
      locale: 'pl_PL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Szkolenia z nowoczesnego piekarnictwa | Masterclasses",
      description: "Profesjonalne szkolenia z nowoczesnego piekarnictwa. Naucz się technik wypieku chleba, ciast francuskich i słodkich wypieków od najlepszych mistrzów piekarnictwa w Polsce.",
      images: ['/logo.png'],
      creator: '@confectioner_masterclasses',
      site: '@confectioner_masterclasses',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual Google verification code
      yandex: 'your-yandex-verification-code', // Replace with actual Yandex verification code
      yahoo: 'your-yahoo-verification-code', // Replace with actual Yahoo verification code
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Confectioner Masterclasses',
      'msapplication-TileColor': '#000000',
      'msapplication-config': '/browserconfig.xml',
    },
  };
}

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    colorScheme: "light",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" }
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialContent = await readSiteContent();
  return (
    <html
      lang="pl"
      className={`${fontVariables} font-sans`}
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body>
        <Header />
        <SiteContentProvider initialContent={initialContent}>
          <ItemsProvider>
            <main className="pt-14 sm:pt-24">{children}</main>
          </ItemsProvider>
        </SiteContentProvider>
        <div className="overflow-hidden">
          <Footer />
        </div>
      </body>
    </html>
  );
}
