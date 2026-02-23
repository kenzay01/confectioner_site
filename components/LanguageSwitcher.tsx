"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames } from "@/i18n/config";
import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("preferredLocale", currentLocale);
    document.cookie = `preferredLocale=${currentLocale}; path=/; max-age=31536000`;
  }, [currentLocale]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLocalizedPath = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Zamknij menu języków" : "Zmień język"}
        aria-expanded={isOpen}
        className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-black/5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"
      >
        <Globe className="w-[22px] h-[22px]" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 py-1 min-w-[100px] bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-50"
          role="menu"
        >
          {locales.map((locale) => {
            const isActive = currentLocale === locale;
            return (
              <Link
                key={locale}
                href={getLocalizedPath(locale)}
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className={`flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "text-gray-900 font-medium bg-gray-50/80"
                    : "text-gray-600 hover:bg-gray-50/60 hover:text-gray-900"
                }`}
              >
                <span>{localeNames[locale]}</span>
                {isActive && <Check className="w-4 h-4 shrink-0 text-gray-600" strokeWidth={2.2} />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
