"use client";
import { useCurrentLanguage } from "@//hooks/getCurrentLanguage";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

export default function AboutMe() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";

  return (
    <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          {currentLocale === "pl" ? "Poznajmy się bliżej" : "Get to Know Me"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatedSection
            className="relative group mt-8 sm:mt-10 lg:mt-12"
            direction="left"
          >
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

          <AnimatedSection
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6"
            direction="right"
          >
            {currentLocale === "pl" ? (
              <div className="space-y-5 text-base sm:text-lg leading-relaxed text-gray-700">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  Cześć!
                </h2>
                <p>
                  Mam na imię Jarek – i bardzo się cieszę, że zainteresowałeś się
                  moimi szkoleniami. Jeśli szukasz miejsca, w którym możesz
                  realnie rozwinąć swoje umiejętności i wynieść poziom swojej
                  pracowni na wyższy poziom – jesteś we właściwym miejscu.
                </p>
                <p>
                  Swój warsztat doskonaliłem, pracując w najlepszych restauracjach
                  Warszawy, ale przede wszystkim dzięki determinacji, ciekawości i
                  ogromnej pasji do rzemieślniczego pieczywa. Przez kilka lat
                  prowadziłem zespół w OMNI KAISER Patisserie jako szef piekarni,
                  odbyłem liczne staże i szkolenia, które pozwoliły mi
                  ukształtować własny styl i podejście do rzemiosła.
                </p>
                <p>
                  Pomysł prowadzenia szkoleń narodził się naturalnie — po latach
                  pracy zrozumiałem, jak dużą wartość ma dzielenie się wiedzą. Od
                  2021 roku uczę pieczenia zarówno pasjonatów, jak i
                  profesjonalistów, pomagając im tworzyć nowoczesne, powtarzalne i
                  pachnące wyroby rzemieślnicze.
                </p>
                <p>
                  Zajmuję się również konsultingiem dla piekarni i cukierni,
                  wspierając je we wdrażaniu nowych produktów, usprawnianiu
                  procesów i budowaniu silnej, autentycznej marki opartej na
                  jakości.
                </p>
                <p>
                  Cieszę się na myśl o współpracy z Tobą i spotkaniu podczas
                  jednego z moich szkoleń.
                </p>
                <p className="mt-6 font-semibold text-gray-900">
                  W sprawie indywidualnej wyceny szkolenia zajrzyj do zakładki{" "}
                  <Link
                    href={`/${currentLocale}/contacts`}
                    className="underline hover:text-[var(--accent-color)] transition-colors"
                  >
                    KONTAKT
                  </Link>{" "}
                  – i nie wahaj się do mnie napisać!
                </p>
              </div>
            ) : (
              <div className="space-y-5 text-base sm:text-lg leading-relaxed text-gray-700">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  Hi there!
                </h2>
                <p>
                  My name is Jarek, and I’m thrilled you’re interested in my
                  trainings. If you’re looking for a place to truly grow your
                  skills and elevate your bakery to the next level, you’re in the
                  right spot.
                </p>
                <p>
                  I refined my craft while working in Warsaw’s top restaurants,
                  but most of all through determination, curiosity, and a deep
                  passion for artisan bread. For several years I led the team at
                  OMNI KAISER Patisserie as head baker, taking part in numerous
                  internships and trainings that helped me shape my own style and
                  approach.
                </p>
                <p>
                  The idea to run trainings came naturally—after years of work I
                  realized how valuable sharing knowledge can be. Since 2021 I
                  have been teaching both enthusiasts and professionals, helping
                  them craft modern, consistent, and aromatic artisan products.
                </p>
                <p>
                  I also consult for bakeries and pastry shops, supporting them in
                  launching new products, streamlining processes, and building
                  strong, authentic brands rooted in quality.
                </p>
                <p>
                  I’m excited at the thought of working with you and meeting
                  during one of my trainings.
                </p>
                <p className="mt-6 font-semibold text-gray-900">
                  For a tailored training quote visit{" "}
            <Link
                    href={`/${currentLocale}/contacts`}
                    className="underline hover:text-[var(--accent-color)] transition-colors"
                  >
                    CONTACT
                  </Link>{" "}
                  and feel free to reach out!
                </p>
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
