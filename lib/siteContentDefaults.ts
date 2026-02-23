import type { SiteContent } from "@/types/siteContent";

/** Єдине джерело дефолтного контенту. Використовується при відсутності/помилці JSON та в контексті до завантаження. */
export const defaultSiteContent: SiteContent = {
  fontFamily: "montserrat",
  home: {
    heroText: "Szkolenia\nz nowoczesnego\npiekarnictwa",
    introPl:
      "Mam na imię Jarek i pomagam piekarzom oraz pasjonatom odkrywać prawdziwe rzemiosło piekarnicze.\n\nPodczas moich szkoleń uczę, jak pracować z naturalnym zakwasem, jak prowadzić fermentację w czasie i jak tworzyć ciasta francuskie i półfrancuskie, które zachwycają strukturą i aromatem.\n\nMoje warsztaty to nie tylko wiedza technologiczna – to praktyka, doświadczenie i pasja do prostych, naturalnych składników.\n\nDołącz do grona piekarzy, którzy wprowadzili do swoich pracowni naturalne, długo fermentowane pieczywo.\n\n👉\n\nSprawdź, w jakich miastach odbyły się już moje szkolenia.",
    introEn:
      "My name is Jarek and I help bakers and enthusiasts discover real baking craft.\n\nIn my workshops I teach how to work with natural leaven, how to manage fermentation in time, and how to create French and semi-French pastries that delight with structure and aroma.\n\nMy workshops are not only technical knowledge – they are practice, experience and passion for simple, natural ingredients.\n\nJoin the bakers who have introduced natural, long-fermented bread to their bakeries.\n\n👉\n\nCheck in which cities my workshops have already taken place.",
    introImage: "/slavik.jpg",
  },
  aboutImage: "/slavik.jpg",
  about: {
    pl: {
      title: "O mnie",
      greeting: "Cześć! Jestem Jarosław Semkiw.",
      paragraphs: [
        "Prowadzę szkolenia z nowoczesnego piekarnictwa. Zapraszam na masterclassy.",
      ],
      contactText: "Masz pytania? KONTAKT pomoże.",
    },
    en: {
      title: "About me",
      greeting: "Hi! I'm Yaroslav Semkiv.",
      paragraphs: [
        "I run modern baking masterclasses. Join my workshops.",
      ],
      contactText: "Questions? CONTACT me.",
    },
  },
};
