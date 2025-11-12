"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import LogoWithoutBg from "@/public/logo-removebg-preview.png";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";
import AnimatedSection from "./AnimatedSection";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Normalize pathname for comparison (remove trailing slashes and handle locale)
  const normalizePath = (path: string) => {
    return path.replace(/\/$/, "").replace(/^\/$/, `/${currentLocale}`);
  };

  const navLinks = [
    { link: "/", label: dict?.header.home || "Główna" },
    { link: "/masterClass", label: dict?.header.masterClass || "Szkolenia" },
    { link: "/aboutMe", label: dict?.header.aboutMe || "O mnie" },
    // { link: "/onlineProducts", label: dict?.header.onlineProducts || "Produkty online" },
    { link: "/partners", label: dict?.header.partners || "Partnerzy" },
    // {
    //   link: "/contactWithChef",
    //   label: dict?.header.contactWithChef || "Skontaktuj się z szefem kuchni",
    // },
    { link: "/contacts", label: dict?.header.contacts || "Kontakt" },
  ];

  return (
    <header className="md:relative fixed top-0 left-0 right-0 z-[250] bg-[var(--main-color)] shadow-lg md:shadow-none">
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="flex justify-between items-center h-14 sm:h-24 mx-3 sm:mx-6 lg:mx-8">
          {/* Left side - Logo */}
          <div
            onClick={() => router.push(`/${currentLocale}`)}
            className="cursor-pointer"
          >
            <div className="hidden sm:flex">
              <Image
                src={LogoWithoutBg}
                alt="Logo"
                width={165}
                height={165}
                className="flex-shrink-0 mt-2"
              />
            </div>
            <div className="flex sm:hidden">
              <Image
                src={LogoWithoutBg}
                alt="Logo"
                width={100}
                height={100}
                className="flex-shrink-0"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center justify-center space-x-4">
              {navLinks.map((link) => {
                const linkPath = `/${currentLocale}${link.link}`;
                const isActive =
                  normalizePath(pathname) === normalizePath(linkPath);
                return (
                  <Link
                    key={link.link}
                    href={linkPath}
                    className="flex items-center text-black transition-colors px-3 py-2 text-sm sm:text-base font-medium group relative cursor-pointer"
                  >
                    <label className="cursor-pointer">{link.label}</label>
                    <div
                      className={`absolute bottom-1 left-0 w-full h-0.5 bg-black ${
                        isActive
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-[15%]"
                      } group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-100`}
                    ></div>
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="hidden lg:flex">
            <LanguageSwitcher currentLocale={currentLocale} />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden flex flex-col items-center justify-center gap-1.5 p-2 sm:p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span
              className={`h-0.5 w-8 bg-gray-700 transition-transform duration-200 ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-8 bg-gray-700 transition-opacity duration-200 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-8 bg-gray-700 transition-transform duration-200 ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <AnimatedSection
            direction="down"
            duration={0.35}
            className="lg:hidden fixed top-[50px] left-0 right-0 bottom-0 bg-[var(--main-color)] z-[250] min-h-[100dvh] overflow-y-auto flex flex-col justify-center items-center pb-30"
          >
            <div className="py-3 px-3 flex flex-col items-center justify-center h-full">
              <nav className="flex flex-col space-y-1 px-3 sm:px-4 flex-3 justify-end pb-6">
                {navLinks.map((link) => {
                  const linkPath = `/${currentLocale}${link.link}`;
                  const isActive =
                    normalizePath(pathname) === normalizePath(linkPath);
                  return (
                    <AnimatedSection
                      key={link.link}
                      className="py-2 px-4 text-center"
                      direction="down"
                      delay={0.2}
                      duration={0.05 * (navLinks.indexOf(link) + 1)}
                    >
                      <Link
                        href={linkPath}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-center transition-all duration-200 rounded-lg text-xl uppercase sm:text-base ${
                          isActive ? "underline underline-offset-4" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </AnimatedSection>
                  );
                })}
              </nav>
              <div className="px-3 sm:px-4 mt-4 flex-1 flex items-end">
                <LanguageSwitcher currentLocale={currentLocale} />
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </header>
  );
};

export default Header;
