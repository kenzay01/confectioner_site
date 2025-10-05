"use client";
import Link from "next/link";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import AnimatedSection from "../AnimatedSection"; // Імпортуйте утилітний компонент
import {Instagram} from "lucide-react";

export default function Footer() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);
  const navLinks = [
    { link: "/aboutMe", label: dict?.header.aboutMe || "O mnie" },
    {
      link: "https://instagram.com/slaviksemkiv", icon: <Instagram className="w-6 h-6" />, type: "social"
    },
    { link: "/contacts", label: dict?.header.contacts || "Kontakt" },
  ];
  
  const legalLinks = [
    { link: "/privacy-policy", label: dict?.footer?.privacyPolicy || "Polityka prywatności" },
    { link: "/terms-of-service", label: dict?.footer?.termsOfService || "Regulamin" },
  ];
  return (
    <AnimatedSection
      className="text-black text-center py-4"
      direction="right"
    >
      <div className="flex justify-center h-24 mb-8 pr-4">
        <div className="relative w-32 h-24">
          <video
            autoPlay
            muted
            playsInline
            preload="auto"
            webkit-playsinline="true"
            x5-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            className="w-full h-full object-contain"
            onLoadedData={(e) => {
              e.currentTarget.play().catch(console.error);
            }}
            onEnded={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = e.currentTarget.duration;
            }}
          >
            <source src="/white_BG.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <nav className="flex justify-center space-x-4 mb-4">
        {navLinks.map((link) => {
          const linkPath = `/${currentLocale}${link.link}`;
          if (link.type === "social") {
            return (
              <Link
                key={link.link}
                href={link.link}
                className="flex items-center text-black transition-colors px-2 py-1 text-sm sm:text-base font-medium group relative cursor-pointer"
              >
                {link.icon}
              </Link>
            );
          }
          return (
            <Link
              key={link.link}
              href={linkPath}
              className="flex items-center text-black transition-colors px-3 py-2 text-sm sm:text-base font-medium group relative cursor-pointer"
            >
              <label className="cursor-pointer">{link.label}</label>
              <div
                className={`absolute bottom-1 left-0 w-full h-0.5 bg-black opacity-0 translate-x-[15%] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-100`}
              ></div>
            </Link>
          );
        })}
      </nav>
      
      {/* Legal Links */}
      <div className="flex justify-center space-x-6 text-xs text-gray-600 mb-4">
        {legalLinks.map((link) => {
          const linkPath = `/${currentLocale}${link.link}`;
          return (
            <Link
              key={link.link}
              href={linkPath}
              className="hover:text-black transition-colors underline"
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      
      {/* TeleBots Credit */}
      <div className="text-xs text-gray-500">
        <span>{dict?.footer?.createdBy || "Website created by"} </span>
        <Link 
          href="https://telebots.site/pl" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-black transition-colors underline"
        >
          TeleBots
        </Link>
        <span> - </span>
        <Link 
          href="https://telebots.site/pl" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-black transition-colors underline"
        >
          {dict?.footer?.websiteDevelopment || "Website Development"}
        </Link>
      </div>
    </AnimatedSection>
  );
}
