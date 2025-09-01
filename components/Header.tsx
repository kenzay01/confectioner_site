"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import LogoWithoutBg from "@/public/logo-removebg-preview.png";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Normalize pathname for comparison (remove trailing slashes and handle locale)
  const normalizePath = (path: string) => {
    // Remove trailing slash and ensure consistent format
    return path.replace(/\/$/, "").replace(/^\/$/, `/${currentLocale}`);
  };

  const navLinks = [
    { link: "/", label: dict?.header.home || "Główna" },
    { link: "/masterClass", label: dict?.header.masterClass || "Warsztaty" },
    { link: "/aboutMe", label: dict?.header.aboutMe || "O mnie" },
    {
      link: "/onlineProducts",
      label: dict?.header.onlineProducts || "Produkty online",
    },
    {
      link: "/contactWithChef",
      label: dict?.header.contactWithChef || "Skontaktuj się z szefem kuchni",
    },
    { link: "/contacts", label: dict?.header.contacts || "Kontakty" },
  ];

  return (
    <header className="md:relative fixed top-0 left-0 right-0 z-50 bg-[var(--main-color)] shadow-lg md:shadow-none">
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="flex justify-between items-center h-14 sm:h-24 mx-3 sm:mx-6 lg:mx-8 ">
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
            className="lg:hidden p-2 sm:p-3 rounded-lg text-black hover:bg-[var(--main-color)]/10 transition-colors active:bg-white/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={18} className="sm:size-6" />
            ) : (
              <Menu size={18} className="sm:size-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-3 px-3 border-b-2 border-black bg-[var(--main-color)]">
            <nav className="flex flex-col space-y-1 px-3 sm:px-4">
              {navLinks.map((link) => {
                const linkPath = `/${currentLocale}${link.link}`;
                const isActive =
                  normalizePath(pathname) === normalizePath(linkPath);
                return (
                  <Link
                    key={link.link}
                    href={linkPath}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-left text-[var(--main-color)] bg-[var(--brown-color)] transition-all duration-200 py-2 px-4 rounded-lg text-sm sm:text-base ${
                      isActive ? "bg-[var(--accent-color)]" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 sm:px-4 mt-4">
              <LanguageSwitcher currentLocale={currentLocale} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
