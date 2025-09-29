"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames } from "@/i18n/config";
import { useEffect } from "react";

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem("preferredLocale", currentLocale);
    document.cookie = `preferredLocale=${currentLocale}; path=/; max-age=31536000`;
  }, [currentLocale]);

  const getLocalizedPath = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="flex items-center md:space-x-1 mb-1">
      {locales.map((locale, index) => (
        <div key={locale} className="flex items-center">
          <Link
            href={getLocalizedPath(locale)}
            className={`btn-unified px-2 py-1 text-sm ${
              currentLocale === locale
                ? "bg-gray-200 border-gray-600"
                : ""
            }`}
          >
            {localeNames[locale]}
          </Link>
          {index < locales.length - 1 && (
            <span className="text-[var(--accent-color)] mx-1">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
