import Header from "@/components/Header";
import { locales } from "@/i18n/config";
import { Metadata } from "next";
import "../globals.css";
import { Montserrat } from "next/font/google";
import { ItemsProvider } from "@/context/itemsContext";
import Footer from "@/components/homePage/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});


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
    colorScheme: "light",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" }
    ],
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${montserrat.variable} font-sans`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo-removebg-preview.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-removebg-preview.png" />
      </head>
      <body>
        <Header />
        <ItemsProvider>
          <main>{children}</main>
        </ItemsProvider>
        <div className="overflow-hidden">
          <Footer />
        </div>
      </body>
    </html>
  );
}
