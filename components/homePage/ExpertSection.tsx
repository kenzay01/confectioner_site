"use client";
import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
// Placeholder image - replace with actual chef image
const chefImage = "/chef-photo.jpg"; // Add your chef photo
import sweet3 from "@/public/materials/sweet3.png";

export default function ExpertSection() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);

  return (
    <section className="py-16 sm:py-24  px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <Image
          src={sweet3}
          alt="Sweet 3"
          width={400}
          height={400}
          className="absolute -right-25 bottom-0 md:-right-25 rotate-25 md:-bottom-15 drop-shadow-lg z-5 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96"
          sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
          placeholder="blur"
          quality={75}
        />
        <div className="text-center mb-12 z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-4">
            {dict?.home?.expert?.title}
          </h2>
          <h3 className="text-xl sm:text-2xl text-[var(--accent-color)] font-medium">
            {dict?.home?.expert?.subtitle}
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center z-10">
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={chefImage}
                alt="Chef Yaroslav Semkiv"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            {/* <div className="absolute -top-6 -left-6 w-24 h-24 bg-[var(--brown-color)] rounded-full opacity-20"></div> */}
            {/* <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--accent-color)] rounded-full opacity-15"></div> */}
          </div>

          <div className="space-y-6 z-10 mb-28">
            <p className="text-lg sm:text-xl text-[var(--accent-color)] leading-relaxed">
              {dict?.home?.expert?.description}
            </p>
            <div className="p-6 bg-[var(--brown-color)]/5 rounded-2xl border-l-4 border-[var(--brown-color)]">
              <p className="text-lg font-medium text-[var(--brown-color)]">
                {dict?.home?.expert?.limitedSeats}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
