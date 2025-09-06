"use client";
import Link from "next/link";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import AnimatedSection from "../AnimatedSection"; // Імпортуйте утилітний компонент
import Image from "next/image";
import logo from "@/public/logo-removebg-preview.png";
import {Instagram} from "lucide-react";

export default function Footer() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);
  const navLinks = [
    { link: "/aboutMe", label: dict?.header.aboutMe || "O mnie" },
    {
      link: "https://instagram.com/slaviksemkiv", icon: <Instagram className="w-6 h-6" />, type: "social"
    },
    { link: "/contacts", label: dict?.header.contacts || "Kontakty" },
  ];
  return (
    <AnimatedSection
      className="text-black text-center py-4"
      direction="right"
    >
      <div className="flex justify-center h-24 mb-8 pr-4">
        <Image src={logo} alt="logo" width={600} height={600} className="w-auto h-42 object-cover"/>
      </div>
      <nav className="flex justify-center space-x-4">
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
    </AnimatedSection>
  );
}
