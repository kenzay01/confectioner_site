import fs from "fs/promises";
import path from "path";
import type { SiteContent } from "@/types/siteContent";
import { defaultSiteContent } from "./siteContentDefaults";

const SITE_CONTENT_FILENAME = "site-content.json";
const SITE_CONTENT_DIR = "data";

/** Шлях до файлу контенту відносно process.cwd() */
export function getSiteContentFilePath(): string {
  return path.join(process.cwd(), SITE_CONTENT_DIR, SITE_CONTENT_FILENAME);
}

/** Повертає контент з JSON. Якщо файлу немає або поля відсутні — доповнює дефолтами. Тільки для сервера (Node). */
export async function readSiteContent(): Promise<SiteContent> {
  const filePath = getSiteContentFilePath();
  const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

  if (!fileExists) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultSiteContent, null, 2), "utf-8");
    return defaultSiteContent;
  }

  const raw = await fs.readFile(filePath, "utf-8");
  let data: SiteContent = raw ? JSON.parse(raw) : defaultSiteContent;

  // Міграція старого формату (heroLine1/2/3) → heroText
  if (data.home && !("heroText" in data.home) && "heroLine1" in (data.home as object)) {
    const old = data.home as unknown as { heroLine1?: string; heroLine2?: string; heroLine3?: string };
    data = {
      ...data,
      home: {
        ...defaultSiteContent.home,
        ...(data.home as object),
        heroText: [old.heroLine1, old.heroLine2, old.heroLine3].filter(Boolean).join("\n"),
      },
    };
  }

  // Доповнення відсутніх полів дефолтами
  data = {
    fontFamily: data.fontFamily ?? defaultSiteContent.fontFamily,
    home: {
      heroText: data.home?.heroText ?? defaultSiteContent.home.heroText,
      introPl: data.home?.introPl ?? defaultSiteContent.home.introPl,
      introEn: data.home?.introEn ?? defaultSiteContent.home.introEn,
      introImage: data.home?.introImage ?? defaultSiteContent.home.introImage,
    },
    aboutImage: (data as { aboutImage?: string }).aboutImage ?? defaultSiteContent.aboutImage,
    about: {
      pl: { ...defaultSiteContent.about.pl, ...data.about?.pl },
      en: { ...defaultSiteContent.about.en, ...data.about?.en },
    },
  };

  return data;
}

/** Записує контент у JSON. Тільки для сервера (Node). */
export async function writeSiteContent(content: SiteContent): Promise<void> {
  const filePath = getSiteContentFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
}
