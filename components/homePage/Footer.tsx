"use client";
import Link from "next/link";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import AnimatedSection from "../AnimatedSection"; // Імпортуйте утилітний компонент

export default function Footer() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);
  const navLinks = [
    { link: "/aboutMe", label: dict?.header.aboutMe || "O mnie" },
    {
      link: "/contactWithChef",
      label:
        dict?.header.contactWithChef || "Skontaktuj się kept z szefem kuchni",
    },
    { link: "/contacts", label: dict?.header.contacts || "Kontakty" },
  ];
  return (
    <AnimatedSection
      className="text-black text-center py-4 mt-8"
      direction="right"
    >
      <h1 className="text-3xl font-bold mb-4">Nieznany piekarz</h1>
      <nav className="flex justify-center space-x-4">
        {navLinks.map((link) => {
          const linkPath = `/${currentLocale}${link.link}`;
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
