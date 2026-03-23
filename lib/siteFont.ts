import type { SiteContentFontFamily } from "@/types/siteContent";

export const SITE_FONT_STACK: Record<SiteContentFontFamily, string> = {
  montserrat: "var(--font-montserrat), ui-sans-serif, system-ui, sans-serif",
  lato: "var(--font-lato), ui-sans-serif, system-ui, sans-serif",
  openSans: "var(--font-open-sans), ui-sans-serif, system-ui, sans-serif",
  roboto: "var(--font-roboto), ui-sans-serif, system-ui, sans-serif",
  playfairDisplay:
    "var(--font-playfair-display), ui-serif, Georgia, serif",
  merriweather: "var(--font-merriweather), ui-serif, Georgia, serif",
  dmSans: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
  plusJakartaSans:
    "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
  nunito: "var(--font-nunito), ui-sans-serif, system-ui, sans-serif",
  raleway: "var(--font-raleway), ui-sans-serif, system-ui, sans-serif",
  literata: "var(--font-literata), ui-serif, Georgia, serif",
  workSans: "var(--font-work-sans), ui-sans-serif, system-ui, sans-serif",
};

const VALID: SiteContentFontFamily[] = [
  "montserrat",
  "lato",
  "openSans",
  "roboto",
  "playfairDisplay",
  "merriweather",
  "dmSans",
  "plusJakartaSans",
  "nunito",
  "raleway",
  "literata",
  "workSans",
];

export function isValidSiteFontFamily(v: string): v is SiteContentFontFamily {
  return VALID.includes(v as SiteContentFontFamily);
}

export function getSiteFontStack(family: SiteContentFontFamily): string {
  return SITE_FONT_STACK[family] ?? SITE_FONT_STACK.montserrat;
}

export function coerceSiteFontFamily(
  v: unknown,
  fallback: SiteContentFontFamily
): SiteContentFontFamily {
  return typeof v === "string" && isValidSiteFontFamily(v) ? v : fallback;
}
