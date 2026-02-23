export type SiteContentFontFamily = "montserrat" | "lato" | "openSans" | "roboto";

export interface AboutLocaleBlock {
  title: string;
  greeting: string;
  paragraphs: string[];
  contactText: string;
}

export interface SiteContent {
  fontFamily: SiteContentFontFamily;
  home: {
    /** Tekst hero – nowa linia (Enter) = nowy wiersz na stronie */
    heroText: string;
    /** Tekst pod sekcją hero obok zdjęcia (PL) – pusty wiersz = nowy akapit */
    introPl: string;
    /** Tekst pod sekcją hero obok zdjęcia (EN) */
    introEn: string;
    /** Ścieżka do zdjęcia pod sekcją hero (strona główna), np. /slavik.jpg */
    introImage: string;
  };
  /** Ścieżka do zdjęcia na stronie O mnie, np. /slavik.jpg */
  aboutImage: string;
  about: {
    pl: AboutLocaleBlock;
    en: AboutLocaleBlock;
  };
}
