import { notFound } from "next/navigation";
import { Locale } from "./config";

const dictionaries = {
  pl: () => import("./locales/pl.json").then((module) => module.default),
  en: () => import("./locales/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    notFound();
  }
  return dictionaries[locale]();
};
