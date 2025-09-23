import Header from "@/components/Header";
import { locales } from "@/i18n/config";
import { Metadata } from "next";
import "../globals.css";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { ItemsProvider } from "@/context/itemsContext";
import Footer from "@/components/homePage/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const helvetica = localFont({
  src: "../../public/fonts/HelveticaNeueBlack.otf",
  variable: "--font-helvetica-neue",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Szkolenia z nowoczesnego piekarnictwa | Masterclasses",
    description: "Profesjonalne szkolenia z nowoczesnego piekarnictwa. Naucz się technik wypieku chleba, ciast francuskich i słodkich wypieków od najlepszych mistrzów piekarnictwa w Polsce.",
    keywords: "szkolenia piekarnictwo, masterclass piekarnictwo, kursy piekarnicze, chleb, ciasta francuskie, wypieki, Tychy, Warszawa, Kraków, Gdańsk, Wrocław",
    authors: [{ name: "Confectioner Masterclasses" }],
    creator: "Confectioner Masterclasses",
    publisher: "Confectioner Masterclasses",
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
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual Google verification code
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
