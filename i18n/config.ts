export const defaultLocale = "pl" as const;
export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeNames = {
  pl: "Pol",
  en: "Eng",
};
