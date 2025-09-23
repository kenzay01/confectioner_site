"use client";
import { useCurrentLanguage } from "@//hooks/getCurrentLanguage";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection"; // Імпортуйте утилітний компонент
import PolandMapSection from "@/components/homePage/PolandMapSection";

export default function AboutMe() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";

  const biography = {
    pl: (
      <div className="prose whitespace-break-spaces ">
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
      <div className="prose whitespace-break-spaces ">{`
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

  

  return (
    <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Biography Section */}
        <h1 className="text-3xl sm:text-4xl font-bold  mb-8 text-center">
          {currentLocale === "pl" ? "Wszystko o Szefie" : "All About the Chef"}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image */}
          <AnimatedSection className="relative group mt-8 sm:mt-10 lg:mt-12" direction="left">
            <Image
              src="/slavik.jpg"
              alt={
                currentLocale === "pl"
                  ? "Szef Jarosław Semkiw"
                  : "Chef Yaroslav Semkiv"
              }
              width={400}
              height={600}
              className="relative rounded-lg object-cover w-full h-[500px] sm:h-[600px] lg:h-[700px] transition-transform duration-300 group-hover:scale-[1.02]"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
          </AnimatedSection>
          {/* Right: Biography */}
          <AnimatedSection
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6  "
            direction="right"
          >
            <div className="prose ">{biography[currentLocale]}</div>
            <Link
              href={`/${currentLocale}/masterClass`}
              className="inline-block btn-unified px-6 py-3 mt-4"
            >
              {currentLocale === "pl"
                ? "Kalendarz wydarzeń"
                : "Calendar of Events"}
            </Link>
          </AnimatedSection>
        </div>

        <PolandMapSection />
      </div>
    </div>
  );
}
