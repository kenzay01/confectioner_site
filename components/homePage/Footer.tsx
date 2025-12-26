"use client";
import Link from "next/link";
import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import AnimatedSection from "../AnimatedSection"; // Імпортуйте утилітний компонент
import {Instagram} from "lucide-react";
import LogoFinal from "@/public/materials/logo-final.png";

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
          <Image
            src={LogoFinal}
            alt="Confectioner Masterclasses Logo"
            width={128}
            height={96}
            className="w-full h-full object-contain"
          />
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
      <div className="mt-6 pt-4 border-t border-gray-200 text-sm sm:text-base text-gray-700">
        <span className="font-medium">
          {dict?.footer?.createdBy || "Website created by"}{" "}
        </span>
        <Link 
          href="https://new.telebots.site/pl" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-black transition-colors underline font-medium"
        >
          TeleBots
        </Link>
        <span> - </span>
        <Link 
          href="https://new.telebots.site/pl" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-black transition-colors underline font-medium"
        >
          {dict?.footer?.websiteDevelopment || "Website Development"}
        </Link>
      </div>
    </AnimatedSection>
  );
}
