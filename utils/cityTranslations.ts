export function getCityName(cityName: string, locale: string | null | undefined): string {
  if (!cityName) return "";

  const translations: Record<
    string,
    {
      pl: string;
      en: string;
    }
  > = {
    Krakow: { pl: "Kraków", en: "Krakow" },
    Warsaw: { pl: "Warszawa", en: "Warsaw" },
    Wroclaw: { pl: "Wrocław", en: "Wroclaw" },
    Gdansk: { pl: "Gdańsk", en: "Gdansk" },
    Poznan: { pl: "Poznań", en: "Poznan" },
    Lodz: { pl: "Łódź", en: "Lodz" },
    Szczecin: { pl: "Szczecin", en: "Szczecin" },
    Lublin: { pl: "Lublin", en: "Lublin" },
    Katowice: { pl: "Katowice", en: "Katowice" },
  };

  const key = cityName.trim();
  const entry = translations[key];

  if (!entry) {
    return cityName;
  }

  if (locale === "en") {
    return entry.en;
  }

  // domyślnie polski
  return entry.pl;
}


