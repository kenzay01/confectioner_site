"use client";
import { useState } from "react";
import { useCurrentLanguage } from "@//hooks/getCurrentLanguage";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";

export default function AboutMe() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const [currentSlide, setCurrentSlide] = useState(0);

  const biography = {
    pl: (
      <div className="prose whitespace-break-spaces text-[var(--brown-color)]">
        {`
      Witajcie wszyscy!

      Mam na imię Jarosław Semkiw i moja kulinarna historia zaczęła się, gdy miałem 15 lat. To właśnie wtedy po raz pierwszy zainteresowałem się gastronomią i zrozumiałem, że chcę poświęcić temu swoje życie. Już podczas nauki w szkole kulinarnej wiedziałem, że moja przyszłość będzie związana z kuchnią i wypiekami.

      Później przeprowadziłem się do Polski, aby rozwijać swoją pasję. Pracowałem w najlepszych restauracjach Warszawy, zdobywałem nowe umiejętności, odbyłem staże i uczestniczyłem w warsztatach, które pomogły mi ukształtować własny styl.

      Miałem zaszczyt prowadzić zespół w KAISER Patisserie jako szef cukiernictwa. Obecnie jestem ambasadorem firm Pastabella oraz Pastry Creation.

      Pomysł prowadzenia warsztatów nie powstał przypadkowo: przez lata pracy zebrałem ogromną wiedzę i zrozumiałem, że chcę dzielić się nią z innymi. Od 2021 roku uczę pieczenia wszystkich chętnych, a także doradzam piekarzom i zajmuję się konsultingiem.

      Cieszę się na myśl o współpracy z Wami i spotkaniu na jednym z moich warsztatów.

      Najbliższe wydarzenia znajdziesz tutaj:
    `}
      </div>
    ),
    en: (
      <div className="prose whitespace-break-spaces text-[var(--brown-color)]">{`
      Hello everyone!

      My name is Yaroslav Semkiv, and my culinary journey began at the age of 15. That’s when I first became fascinated with gastronomy and realized I wanted to dedicate my life to it. While studying at culinary school, I knew for certain that my future would be tied to cooking and baking.

      Later, I moved to Poland to pursue my passion. I worked in Warsaw’s top restaurants, honed new skills, completed internships, and attended masterclasses that helped me develop my unique style.

      I had the privilege of leading the team at KAISER Patisserie as head pastry chef. Currently, I am an ambassador for Pastabella and Pastry Creation.

      The idea of conducting masterclasses came naturally: over the years, I accumulated a wealth of knowledge and realized I wanted to share it with others. Since 2021, I’ve been teaching baking to enthusiasts, consulting with bakers, and providing culinary guidance.

      I look forward to collaborating with you and meeting at one of my masterclasses.

      Find upcoming events here:
    `}</div>
    ),
  };

  const pastEvents = [
    {
      year: 2024,
      events: [
        {
          pl: "Szkolenie w Warsaw Pastry Academy – duży kurs piekarski (3. edycja)",
          en: "Training at Warsaw Pastry Academy – major baking course (3rd edition)",
        },
        {
          pl: "Technologiczne wdrożenie nowego parku maszynowego dla poprawy jakości i efektywności produkcji",
          en: "Technological implementation of new machinery for improved quality and production efficiency",
        },
        {
          pl: "Kompleksowe wsparcie przy otwarciu nowej cukierni-piekarni w Grudziądzu",
          en: "Comprehensive support for opening a new bakery in Grudziądz",
        },
        {
          pl: "Warsztaty z nadzień i ciasta półfrancuskiego dla Sowa",
          en: "Workshops on fillings and puff pastry for Sowa",
        },
        {
          pl: "Szkolenie z chlebów na zakwasie w kawiarni Doza (Warszawa)",
          en: "Sourdough bread training at Doza café (Warsaw)",
        },
        {
          pl: "Kursy z chlebów na zakwasie i ciasta półfrancuskiego w cukierni Małgosia (Radzymin)",
          en: "Sourdough bread and puff pastry courses at Małgosia bakery (Radzymin)",
        },
        {
          pl: "Szkolenie z chlebów na zakwasie i ciasta drożdżowego w piekarni Dańca (Zakopane)",
          en: "Sourdough bread and yeast dough training at Dańca bakery (Zakopane)",
        },
        {
          pl: "Trening z ciasta drożdżowego i nadzień w piekarni Ozdowscy (Kutno)",
          en: "Yeast dough and fillings training at Ozdowscy bakery (Kutno)",
        },
        {
          pl: "Technologiczne wdrożenie nowego parku maszynowego w Kazimierzu Dolnym",
          en: "Technological implementation of new machinery in Kazimierz Dolny",
        },
        {
          pl: "Cykl treningów „Zrozum swoją zakwas” razem z Asociacją Rzemieślników",
          en: "Series of workshops 'Understand Your Sourdough' with the Craftsmen Association",
        },
        {
          pl: "Szkolenie z ciasta drożdżowego i odroczonego wypieku w cukierni Gagatek (Wieluń)",
          en: "Yeast dough and delayed baking training at Gagatek bakery (Wieluń)",
        },
        {
          pl: "Szkolenie z ciasta półfrancuskiego i odroczonej fermentacji w Białej Podlaskiej",
          en: "Puff pastry and delayed fermentation training in Biała Podlaska",
        },
        {
          pl: "Trening z ciasta półfrancuskiego i nadzień w piekarni Montag (Łódź)",
          en: "Puff pastry and fillings training at Montag bakery (Łódź)",
        },
        {
          pl: "Szkolenie z chlebów na zakwasie w cukierni Sowa",
          en: "Sourdough bread training at Sowa bakery",
        },
        {
          pl: "Kompleksowe wdrożenie technologii i nowego sprzętu w cukierni Malinka (Żabno)",
          en: "Comprehensive technology and equipment implementation at Malinka bakery (Żabno)",
        },
        {
          pl: "Masterclass z panettone w piekarni Świeżo Upieczona (Kraków)",
          en: "Panettone masterclass at Świeżo Upieczona bakery (Kraków)",
        },
        {
          pl: "Szkolenie z ciasta półfrancuskiego w piekarni Sekrety Piekarza (Kraków)",
          en: "Puff pastry training at Sekrety Piekarza bakery (Kraków)",
        },
        {
          pl: "Wdrożenie półautomatycznej linii do rogalików w Dopiewie",
          en: "Implementation of a semi-automatic croissant line in Dopiewo",
        },
        {
          pl: "Trening w piekarni Otrębusy z ciasta półfrancuskiego i nadzień",
          en: "Puff pastry and fillings training at Otrębusy bakery",
        },
      ],
    },
    {
      year: 2023,
      events: [
        {
          pl: "Szkolenie w Warsaw Pastry Academy — duży kurs piekarski (4. edycja)",
          en: "Training at Warsaw Pastry Academy – major baking course (4th edition)",
        },
        {
          pl: "Trening w piekarni ABC (Gdynia) z ciasta półfrancuskiego i chlebów na zakwasie",
          en: "Puff pastry and sourdough bread training at ABC bakery (Gdynia)",
        },
        {
          pl: "Szkolenie w cukierni Sobczak (Poznań) z ciasta półfrancuskiego",
          en: "Puff pastry training at Sobczak bakery (Poznań)",
        },
        {
          pl: "Prezentacja maszyn i szkolenie technologiczne w firmie INplus",
          en: "Machinery presentation and technological training at INplus",
        },
        {
          pl: "Kompleksowe wdrożenie technologii i sprzętu w piekarni ABC (Gdynia)",
          en: "Comprehensive technology and equipment implementation at ABC bakery (Gdynia)",
        },
      ],
    },
    {
      year: 2022,
      events: [
        {
          pl: "Szkolenie w piekarni Frydrych (Krosno) z chlebów na zakwasie i wypieków skandynawskich",
          en: "Sourdough bread and Scandinavian baking training at Frydrych bakery (Krosno)",
        },
      ],
    },
    {
      year: 2021,
      events: [
        {
          pl: "Szkolenie w Omni Kaiser Patisserie z francuskiego chleba",
          en: "French bread training at Omni Kaiser Patisserie",
        },
        {
          pl: "Szkolenie w cukierni GIGI z ciasta półfrancuskiego",
          en: "Puff pastry training at GIGI bakery",
        },
        {
          pl: "Szkolenie w cukierni MISS MELLOW z chlebów na zakwasie",
          en: "Sourdough bread training at MISS MELLOW bakery",
        },
      ],
    },
  ];

  // Slider navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % pastEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + pastEvents.length) % pastEvents.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Biography Section */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-8 text-center">
          {currentLocale === "pl" ? "Wszystko o Szefie" : "All About the Chef"}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image */}
          <div className="relative group">
            <Image
              src="/chef.jpg"
              alt={
                currentLocale === "pl"
                  ? "Szef Jarosław Semkiw"
                  : "Chef Yaroslav Semkiv"
              }
              width={600}
              height={400}
              className="relative rounded-lg object-cover w-full h-[400px] shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
          </div>
          {/* Right: Biography */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10">
            <div className="prose text-[var(--brown-color)]">
              {biography[currentLocale]}
            </div>
            <Link
              href={`/${currentLocale}/masterClass`}
              className="inline-block px-6 py-3 rounded-full font-bold text-white bg-[var(--brown-color)] hover:bg-[var(--accent-color)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mt-4"
            >
              {currentLocale === "pl"
                ? "Kalendarz wydarzeń"
                : "Calendar of Events"}
            </Link>
          </div>
        </div>

        {/* Past Events Section */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--brown-color)] mb-6 text-center">
          {currentLocale === "pl"
            ? "Co już udało mi się przeprowadzić"
            : "What I’ve Already Conducted"}
        </h2>
        <div className="relative mb-12">
          {/* Slider Content */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {pastEvents.map((yearGroup) => (
                <div key={yearGroup.year} className="min-w-full px-4">
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10">
                    <h3 className="text-xl font-semibold text-[var(--brown-color)] mb-4 text-center">
                      {yearGroup.year}
                    </h3>
                    <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--brown-color)]/50 scrollbar-track-transparent">
                      <ul className=" list-inside text-[var(--brown-color)] space-y-2 pr-4 decoration-0">
                        {yearGroup.events.map((event, index) => (
                          <li key={index} className=" flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-1 text-[var(--brown-color)]/60 flex-shrink-0" />
                            {event[currentLocale]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm text-[var(--brown-color)] hover:bg-[var(--accent-color)] hover:text-white p-2 rounded-full shadow-lg transition-all duration-300"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm text-[var(--brown-color)] hover:bg-[var(--accent-color)] hover:text-white p-2 rounded-full shadow-lg transition-all duration-300"
            disabled={currentSlide === pastEvents.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {pastEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index
                    ? "bg-[var(--accent-color)]"
                    : "bg-[var(--brown-color)]/50 hover:bg-[var(--brown-color)]"
                } transition-colors duration-300`}
              >
                <span className="sr-only">Slide {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
